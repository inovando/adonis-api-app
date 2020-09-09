---
to: "<%= has_seeder ? `database/seeds/99-${h.inflection.camelize(resource)}Seeder.js` : null %>"
unless_exists: true
---
'use strict';

/** @type {import('@adonisjs/lucid/src/Factory')} */
const <%= h.capitalize(resource) %> = use('App/Models/<%= h.capitalize(resource) %>');

class <%= h.capitalize(resource) %>Seeder {
  async run() {
    const array<%= h.capitalize(resource) %> = ['1'];

    for (let index = 0; index < array<%= h.capitalize(resource) %>.length; index++) {
      const <%= h.capitalize(resource).toLowerCase() %> = new <%= h.capitalize(resource) %>();
      <%= h.capitalize(resource).toLowerCase() %>.status = true;
      await <%= h.capitalize(resource).toLowerCase() %>.save();
    }
    console.log('<%= h.capitalize(resource) %>Seeder Finished');
  }
}

module.exports = <%= h.capitalize(resource) %>Seeder;
