---
to: app/Controllers/Http/<%= h.inflection.camelize(resource) %>Controller.js
unless_exists: true
eof_last: true
sh: yarn eslint --fix app/Controllers/
---
'use strict';
const <%= h.capitalize(resource) %>Repository = use('App/Repositories/<%= h.capitalize(resource) %>Repository');
const BaseController = use('/BaseController');

const TRANSFORM = {
  collection: '<%= h.capitalize(resource) %>Transformer.collection',
  item: '<%= h.capitalize(resource) %>Transformer.item',
};

const INCLUDES = [];

class <%= h.capitalize(resource) %>Controller extends BaseController {
  constructor() {
    super(<%= h.capitalize(resource) %>Repository, TRANSFORM);
    this.respository = <%= h.capitalize(resource) %>Repository;
    this.includesTransform = INCLUDES;
  }
}

module.exports = <%= h.capitalize(resource) %>Controller;
