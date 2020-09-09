---
to: app/Models/<%= h.inflection.camelize(resource) %>.js
unless_exists: true
---
'use strict';
const Model = use('Model');

class <%= h.capitalize(resource) %> extends Model {}

module.exports = <%= h.capitalize(resource) %>;
