'use strict';

const _ = require('lodash');
const Event = use('Event');

class BaseRepository {
  constructor(model) {
    this.model = model;
    this.noRecordFound = `${this.model.name} - Resource not found`;
  }

  async index(page, request) {
    const { status = true } = request;

    const query = this.model.query();
    query.where('status', status);
    query.whereNull('deleted_at');
    const result = await query.paginate(page);
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

  async update(params, request, response) {
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

  async destroy(params, response) {
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
}

module.exports = BaseRepository;
