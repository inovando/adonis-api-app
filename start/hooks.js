const { hooks } = require('@adonisjs/ignitor');
const { validateBr } = require('js-brasil');

hooks.after.providersBooted(() => {
  const Validator = use('Validator');
  const Database = use('Database');

  const existsFn = async (data, field, message, args, get) => {
    const value = get(data, field);
    if (!value) {
      /**
       * skip validation if value is not defined. `required` rule
       * should take care of it.
       */
      return;
    }

    const [table, column] = args;
    const row = await Database.table(table).where(column, value).first();

    if (!row) {
      throw message;
    }
  };

  const uniqueField = async (data, field, message, args, get) => {
    console.log('uniqueField', args);
    const value = get(data, field);
    const [table, column] = args;
    const row = await Database.table(table).where(column, value).first();

    if (row) {
      throw message;
    }
  };

  const validateDuplicidade = async (data, field, message, args, get) => {
    const value = get(data, field);
    const [table, id] = args;

    // console.log({ data, field, message, args, get, value, table, id });

    if (!value) return;

    const row = await Database.table(table)
      .whereNot('id', id)
      .andWhere(field, value)
      .first();

    if (row) {
      throw message;
    }
  };

  const documento = async (data, field, message, args, get) => {
    const [documento] = args;
    const value = get(data, field);
    if (!value) return;

    if (!validateBr[documento](value)) {
      throw message;
    }
  };

  const validateUuid = async (data, field, message, args, get) => {
    const value = get(data, field);

    if (!value) return null;

    const regex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-5][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i;
    const isUuid = regex.exec(value);

    if (isUuid) return null;

    throw message;
  };

  Validator.extend('documento', documento);
  Validator.extend('exists', existsFn);
  Validator.extend('uniqueField', uniqueField);
  Validator.extend('validateDuplicidade', validateDuplicidade);
  Validator.extend('uuid', validateUuid);
});
