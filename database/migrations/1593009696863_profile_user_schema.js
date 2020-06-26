'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ProfileUserSchema extends Schema {
  up() {
    this.create('profile_user', (table) => {
      table.increments('id');

      table
        .uuid('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();

      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .notNullable();

      table.timestamps();
    });
  }

  down() {
    this.dropIfExists('profile_user');
  }
}

module.exports = ProfileUserSchema;
