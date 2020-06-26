'user-strict';

const Redis = use('Redis');
const Env = use('Env');
const USE_CACHE_REDIS = Env.get('USE_CACHE_REDIS', false);

class BaseController {
  constructor(repository, transformer = 'BaseTransformer') {
    this.repository = repository;
    this.transformerName = transformer;
    this.useCache = USE_CACHE_REDIS == 1;
  }

  async index({ request, auth, transform }) {
    if (this.useCache) {
      const cachedItens = await Redis.get(
        `${this.repository.model.name}_index`,
      );

      if (cachedItens) {
        return JSON.parse(cachedItens);
      }
    }

    const itens = await this.repository.index(request.all(), auth);

    if (this.useCache) {
      await Redis.set(
        `${this.repository.model.name}_index`,
        JSON.stringify(itens),
      );
    }

    return transform.paginate(itens, this.transformerName);
  }

  async store(ctx) {
    return this.repository.store(ctx);
  }

  async show({ params, transform, response }) {
    if (this.useCache) {
      const cachedItens = await Redis.get(
        `${this.repository.model.name}_show_${params.id}`,
      );

      if (cachedItens) {
        return JSON.parse(cachedItens);
      }
    }
    const itens = await this.repository.show(params, response);

    if (this.useCache) {
      await Redis.set(
        `${this.repository.model.name}_show_${params.id}`,
        JSON.stringify(itens),
      );
    }
    return transform.item(itens, this.transformerName);
  }

  async update(ctx) {
    return this.repository.update(ctx);
  }

  async destroy(ctx) {
    return this.repository.destroy(ctx);
  }
}

module.exports = BaseController;
