const { hooks } = require('@adonisjs/ignitor');

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

  Validator.extend('exists', existsFn);
  Validator.extend('uniqueField', uniqueField);
  Validator.extend('validateDuplicidade', validateDuplicidade);
});
