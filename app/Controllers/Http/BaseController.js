'user-strict';

const Redis = use('Redis');
const Env = use('Env');
const USE_CACHE_REDIS = Env.get('USE_CACHE_REDIS', false);

class BaseController {
  constructor(repository, transformer = 'BaseTransformer') {
    this.repository = repository;
    this.transformer = transformer;
    this.useCache = USE_CACHE_REDIS == 1;
  }

  async index({ transform, request, response, view, auth }) {
    const { excel } = request.only('excel');
    const { pdf } = request.only('pdf');
    const { totals } = request.only('totals');

    if (this.useCache) {
      const cachedItens = await Redis.get(
        `${this.repository.model.name}_index`,
      );

      if (cachedItens) {
        return JSON.parse(cachedItens);
      }
    }

    const itens = await this.repository.index(...arguments);

    if (this.useCache) {
      await Redis.set(
        `${this.repository.model.name}_index`,
        JSON.stringify(itens),
      );
    }

    let transformedItens = null;
    if (excel || pdf || totals) {
      transformedItens = await transform.collection(
        itens,
        this._getTransform('collection'),
      );
    }

    if (excel) {
      return await this.repository.generateReport(
        'xlsx',
        transformedItens,
        response,
      );
    }

    if (pdf) {
      const { fileName } = await this.repository.generateReport(
        'pdf',
        transformedItens,
        response,
        view,
        auth,
      );

      return fileName;
    }

    if (totals) {
      return await this.repository.getTotals(transformedItens);
    }

    return transform.paginate(itens, this._getTransform('collection'));
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

    return transform.item(itens, this._getTransform('item'));
  }

  async update(ctx) {
    return this.repository.update(ctx);
  }

  async destroy(ctx) {
    return this.repository.destroy(ctx);
  }

  _getTransform(type) {
    return typeof this.transformer === 'string'
      ? this.transformer
      : this.transformer[type];
  }
}

module.exports = BaseController;
