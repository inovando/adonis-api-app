'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class FileSchema extends Schema {
  up() {
    this.create('files', (table) => {
      table.uuid('id').primary().defaultTo(this.db.raw('uuid_generate_v4()'));
      table.boolean('status').defaultTo(1);

      table.string('path').notNullable();
      table.string('name');

      table
        .uuid('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.timestamps();
      table.datetime('deleted_at');
    });
  }

  down() {
    this.drop('files');
  }
}

module.exports = FileSchema;
