'use strict';

const _ = require('lodash');
const DataBase = use('Database');
const { sanitizor } = use('Validator');
const isProfile = require('../Util/isProfile');

class BaseRepository {
  constructor(model, columnsToSearch = [], columnsDateBetween = []) {
    this.model = model;
    this.tableName = sanitizor.plural(this.model.name).toLowerCase();
    this.noRecordFound = `${this.model.name} - Resource not found`;
    this.columnsToSearch = columnsToSearch;
    this.columnsDateBetween = columnsDateBetween;
    this._ = _;
    this.hasUserId = false;
  }

  async index({ request }, ignoreParams = []) {
    const { q } = request.only('q');
    const { isNull } = request.only('isNull');
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
      'isNull',
      'status',
      'all',
      'roles',
      ...hasDateBetween,
      ...ignoreParams,
    ]);

    const { order = 'asc', sort } = request.all();

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

    this.addWhereNullFieldsQuery(query, isNull);

    if (sort) {
      query.orderBy(sort, order);
    }

    return { query };
  }

  async store({ request, response, user_id }) {
    const input = { ...request.all() };
    const modelObj = new this.model();
    _.forEach(input, (e, i) => {
      modelObj[i] = e;
    });

    if (this.hasUserId) {
      modelObj.user_id = user_id;
    }

    await modelObj.save();

    return response.status(201).json({
      msg: `${this.model.name} created successfully`,
      data: {
        ...modelObj.toJSON(),
        created_at: new Date(modelObj.created_at),
        update_at: new Date(modelObj.update_at),
      },
    });
  }

  async show({ params }) {
    const query = this.model.query();

    query.where('id', params.id);

    return { query };
  }

  async update({ params, request, response, auth }) {
    const input = request.all();

    const modelObj = await this.model.query().where({ id: params.id }).first();

    if (!modelObj) {
      return response.status(404).json({ msg: this.noRecordFound });
    }

    const canEditModel = await this.canEdit(auth, modelObj);
    if (!canEditModel) {
      return response.status(403).json({ msg: 'Status não permite edição' });
    }

    _.forEach(input, (e, i) => {
      modelObj[i] = e;
    });

    await modelObj.save();

    return response.status(200).json({
      msg: `${this.model.name} has been updated`,
      data: {
        ...modelObj.toJSON(),
        created_at: new Date(modelObj.created_at),
        update_at: new Date(modelObj.created_at),
      },
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

    return response.noContent();
  }

  async isAdmin(auth) {
    const profiles = await auth.user.profiles().fetch();

    if (!profiles.rows.length) return false;

    return isProfile(profiles.rows, 'ADMIN');
  }

  async isProfile(auth, profileToCheck) {
    if (!auth.user) return false;

    const profiles = await auth.user.profiles().fetch();

    return isProfile(profiles.rows, profileToCheck);
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

    query.whereExists((builder) => {
      this.columnsToSearch.forEach((column) => {
        builder.orWhereRaw(
          `unaccent(${column.name}) ILIKE unaccent(?)`,
          `%${q}%`,
        );

        return query;
      });
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

  /**
   * Método para customização da query base, que deve ser escrito no repository em que deseja ter o getAll customizado
   * @param {ctxAdonis}
   * @param {query}
   */
  async customIndex(ctx, query) {
    query.where('status', true);
  }

  async customShow(ctx, query) {
    query.where('status', true);
  }

  async canEdit() {
    return true;
  }
}

module.exports = BaseRepository;
