'user-strict';

class BaseController {
  constructor(repository, transformer = 'BaseTransformer') {
    this.repository = repository;
    this.transformer = transformer;
    this.ignoreParamsToQuery = [];
  }

  async index({ transform, request }) {
    const { excel } = request.only('excel');
    const { pdf } = request.only('pdf');
    const { totals } = request.only('totals');
    const { all } = request.only('all');
    const { page, perPage } = request.only(['page', 'perPage']);

    const { query } = await this.repository.index(
      ...arguments,
      this.ignoreParamsToQuery,
    );

    if (excel || pdf || totals) {
      return await this.generateReport(...arguments, query);
    }

    await this.repository.customIndex(...arguments, query);

    if (all) {
      return await this.getAllItens(...arguments, query);
    }

    const itens = await query.paginate(page, perPage);

    return transform
      .withContext(...arguments)
      .paginate(itens, this._getTransform('collection'));
  }

  async store(ctx) {
    return this.repository.store(ctx);
  }

  async show({ response, transform }) {
    const { query } = await this.repository.show(...arguments);

    await this.repository.customShow(...arguments, query);

    const item = await query.first();

    if (!item) {
      return response.status(404).json({ msg: 'Resource not found' });
    }

    return transform.item(item, this._getTransform('item'));
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

  async generateReport({ request, transform, view, auth, response }, query) {
    const { excel } = request.only('excel');
    const { pdf } = request.only('pdf');
    const { totals } = request.only('totals');
    const itens = await query.fetch();

    const transformedItens = await transform.collection(
      itens,
      this._getTransform('collection'),
    );

    if (totals) {
      return await this.repository.getTotals(transformedItens);
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
  }

  async getAllItens({ transform }, query) {
    const itens = await query.fetch();

    return transform.collection(itens, this._getTransform('collection'));
  }
}

module.exports = BaseController;
