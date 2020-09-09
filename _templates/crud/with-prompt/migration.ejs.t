---
to: database/migrations/<%= `${+new Date()}_${ h.changeCase.lower(resource) }_schema.js` %>
unless_exists: true
description: "Gera uma migração para você"

---

'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class <%= h.capitalize(resource) %>Schema extends Schema {
  up() {
    this.create("<%=  h.inflection.transform(resource, ['pluralize', 'underscore']) %>", (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('uuid_generate_v4()'));
      table.boolean('status').defaultTo(1);
      table.datetime('deleted_at');
      table.timestamps();
    });

  }

  down() {
    this.drop("<%= h.inflection.transform(resource, ['pluralize', 'underscore'])%>");
  }
}

module.exports = <%= h.capitalize(resource) %>Schema;