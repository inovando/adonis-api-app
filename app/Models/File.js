'use strict';
const Env = use('Env');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class File extends Model {
  static get computed() {
    return ['url'];
  }

  getUrl({ id }) {
    const url = Env.get('APP_URL');
    return `${url}/file/${id}`;
  }
}

module.exports = File;
