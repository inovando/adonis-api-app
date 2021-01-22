'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class DbSetupSchema extends Schema {
  async up() {
    await this.db.raw(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp" schema public',
    );

    await this.db.raw(
      'CREATE EXTENSION IF NOT EXISTS "unaccent" schema public',
    );
  }

  down() {}
}

module.exports = DbSetupSchema;
