'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ProfilesSchema extends Schema {
  up() {
    this.create('profiles', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.boolean('status').defaultTo(1);
      table.datetime('deleted_at');
      table.timestamps();
    });
  }

  down() {
    this.dropIfExists('profiles');
  }
}

module.exports = ProfilesSchema;
