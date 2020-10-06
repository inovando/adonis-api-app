---
to: app/Models/<%= h.inflection.camelize(resource) %>.js
unless_exists: true
sh: yarn eslint --fix database/seeds/
---
'use strict';
const Model = use('Model');

class <%= h.capitalize(resource) %> extends Model {}

module.exports = <%= h.capitalize(resource) %>;
