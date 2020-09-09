'use strict';

const _ = require('lodash');
const Event = use('Event');
const DataBase = use('Database');
const { sanitizor } = use('Validator');

class BaseRepository {
  constructor(model, columnsToSearch = [], columnsDateBetween = []) {
    this.model = model;
    this.tableName = sanitizor.plural(this.model.name).toLowerCase();
    this.noRecordFound = `${this.model.name} - Resource not found`;
    this.columnsToSearch = columnsToSearch;
    this.columnsDateBetween = columnsDateBetween;
  }

  async index({ request }) {
    const { q } = request.only('q');
    const { nullFields } = request.only('nullFields');
    const { totals } = request.only('totals');
    const { status } = request.only('status');
    const { excel } = request.only('excel');
    const { pdf } = request.only('pdf');
    const hasDateBetween = await this.existDateBetween(request.all());

    const paramsToQuery = request.except([
      'page',
      'perPage',
      'include',
      'q',
      'order',
      'sort',
      'totals',
      'excel',
      'pdf',
      'total',
      'nullFields',
      'status',
      ...hasDateBetween,
    ]);

    const paramsToPaginate = request.only(['page', 'perPage']);
    const { order = 'desc', sort } = request.all();
    const query = this.model.query();

    if (q) {
      await this.getColumnstoSearh(query, q);
    }

    if (hasDateBetween.length !== 0) {
      await this.getColumnstoSearhDatesBetween(query, hasDateBetween, request);
    }

    Object.keys(paramsToQuery).forEach((key) => {
      if (paramsToQuery[key]) {
        query.where(key, paramsToQuery[key]);
      }
    });

    query.where('status', status || true);

    this.addWhereNullFieldsQuery(query, nullFields);

    if (sort) {
      query.orderBy(sort, order);
    }

    if (excel || pdf || totals) {
      return await query.fetch();
    }

    const result = await query.paginate(
      paramsToPaginate.page,
      paramsToPaginate.perPage,
    );

    return result;
  }

  async store({ request, response }) {
    const input = request.all();
    const modelObj = new this.model();

    _.forEach(input, (e, i) => {
      modelObj[i] = e;
    });

    await modelObj.save();

    Event.fire(`new::${this.model.name}`, modelObj);

    return response.status(201).json({
      msg: `${this.model.name} created successfully`,
      data: modelObj,
    });
  }

  async show(params, response) {
    const modelObj = await this.model.query().where('id', params.id).first();

    if (!modelObj) {
      return response.status(404).json({ msg: this.noRecordFound });
    }
    return modelObj;
  }

  async update({ params, request, response }) {
    const input = request.all();

    const modelObj = await this.model.query().where({ id: params.id }).first();

    if (!modelObj) {
      return response.status(404).json({ msg: this.noRecordFound });
    }

    _.forEach(input, (e, i) => {
      modelObj[i] = e;
    });

    await modelObj.save();

    Event.fire(`update::${this.model.name}`, modelObj);
    return response.status(200).json({
      msg: `${this.model.name} has been updated`,
      data: modelObj,
    });
  }

  async destroy({ params, response }) {
    const modelObj = await this.model.query().where({ id: params.id }).first();
    if (!modelObj) {
      return response.status(404).json({ msg: this.noRecordFound });
    }
    modelObj.status = false;
    modelObj.deleted_at = new Date();
    await modelObj.save();
    Event.fire(`destroy::${this.model.name}`, modelObj);
    return response.noContent();
  }

  async isAdmin(auth) {
    const profiles = await auth.user.profiles().fetch();

    if (!profiles.rows.length) return false;

    const hasAdminProfile = profiles.rows.some((profile) => profile.id === 1);
    return hasAdminProfile;
  }

  async _getColumns(type = ['character varying']) {
    const columnsToSearch = [];
    const columns = await DataBase.table(this.tableName).columnInfo();

    for (var c in columns) {
      if (type.includes(columns[c].type)) {
        columnsToSearch.push({
          name: c,
          type: columns[c].type,
        });
      }
    }
    return columnsToSearch;
  }

  async getColumnstoSearh(query, q) {
    if (!this.columnsToSearch.length) {
      this.columnsToSearch = await this._getColumns();
    }

    this.columnsToSearch.forEach((column, index) => {
      const isFirst = index === 0;

      if (isFirst) {
        query.whereRaw(`unaccent(${column.name}) ILIKE unaccent(?)`, `%${q}%`);
      }
      query.orWhereRaw(`unaccent(${column.name}) ILIKE unaccent(?)`, `%${q}%`);
      return query;
    });
  }

  async isDataInicio(data) {
    return data.includes('_inicio');
  }

  async getColumnstoSearhDatesBetween(query, datesParams, request) {
    if (!this.columnsDateBetween.length) {
      this.columnsDateBetween = await this._getColumns([
        'date',
        'timestamp with time zone',
      ]);
    }
    const [dataFieldParam] = datesParams;

    this.columnsDateBetween
      .filter((c) => dataFieldParam.includes(c.name))
      .forEach((column) => {
        const { inicio, fim } = datesParams.reduce((acumulador, prop) => {
          const datas = request.only(datesParams);
          if (prop.includes('inicio'))
            return { ...acumulador, inicio: datas[prop] };

          return { ...acumulador, fim: datas[prop] };
        }, {});

        if (column.type === 'date') {
          query.whereBetween(column.name, [inicio, fim]);
        }

        if (column.type === 'timestamp with time zone') {
          query.whereBetween(column.name, [
            `${inicio} 00:00:01`,
            `${fim} 23:59:59`,
          ]);
        }
      });
  }

  /**
   * Verifica na request se existem datas de acordo com a expressao regular  (data_???_inicio e data_???_fim)
   * @param {*} requestParams
   */
  async existDateBetween(requestParams) {
    return Object.keys(requestParams).filter((prop) =>
      prop.match(/data\w{1,}(inicio|fim)/gi),
    );
  }

  async _updateFiles(model, files) {
    await model.files().sync([...files]);
  }

  async generateReport() {
    throw Error(
      `Método generateReport ainda NÃO está implementado no repository ${this.constructor.name}.`,
    );
  }

  async getTotals() {
    throw Error(
      `Método getTotals ainda NÃO está implementado no repository ${this.constructor.name}.`,
    );
  }

  addWhereNullFieldsQuery(query, nullFields) {
    if (!nullFields) return;

    const fields = nullFields.split(',');

    fields.forEach((field) => query.whereNull(field));
  }
}

module.exports = BaseRepository;
