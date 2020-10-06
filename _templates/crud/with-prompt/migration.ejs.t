---
to: database/migrations/<%= `${+new Date()}_${ h.changeCase.lower(resource) }_schema.js` %>
unless_exists: true
description: "Gera uma migração para você"
sh: yarn eslint --fix database/migrations/
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

      <% Object.keys(tiposDados).forEach(function(key) { %>
      <%if (tiposDados[key].tipo == 'uuid') { %>
        table.uuid('<%=key %>').primary().defaultTo(this.db.raw('uuid_generate_v4()'));
      <% } %>
      table.<%= tiposDados[key].tipo %>('<%=key %>')<%if (tiposDados[key].notNullable ) { %>
        .notNullable()<% } %>
        <%if (tiposDados[key].default) { %>
        .defaultTo('<%=tiposDados[key].default_value%>')<% } %>
        <%if (tiposDados[key].unique) { %>
        .unique()
      <% } %>
      <% }); %>
    });

  }

  down() {
    this.drop("<%= h.inflection.transform(resource, ['pluralize', 'underscore'])%>");
  }
}

module.exports = <%= h.capitalize(resource) %>Schema;
