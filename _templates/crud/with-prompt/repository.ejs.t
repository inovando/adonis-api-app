---
to: app/Repositories/<%= h.inflection.camelize(resource) %>Repository.js
unless_exists: true
sh: yarn eslint --fix app/Repositories/
---

'use strict';

const BaseRepository = use('./BaseRepository');
const { ioc } = require('@adonisjs/fold');

class <%= h.capitalize(resource) %>Repository extends BaseRepository {
  constructor(model) {
    super(model);
    this.model = model;
  }
}

ioc.singleton('<%= h.capitalize(resource) %>Repository',(app) => new <%= h.capitalize(resource) %>Repository(app.use('App/Models/<%= h.capitalize(resource) %>')),
);

module.exports = ioc.use('<%= h.capitalize(resource) %>Repository');
