'use strict';

const yosay = require('yosay');
const { blue, magenta } = require('ansi-colors');
const rhythm = [
  magenta,
  blue.dim,
  magenta.dim,
  magenta,
  blue,
  magenta,
  blue.dim,
];
const frame = (arr, i) => arr[i % arr.length];

module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        header: yosay('✨ Inovan.do Crud Generator ✨'),
        type: 'input',
        name: 'resource',
        message: 'Nome do Recurso (ex: post, comment)',
        timers: {
          separator: 999,
          prefix: 999,
        },
        prefix(state) {
          return frame(rhythm, state.timer.tick)('✈');
        },
        separator(state) {
          return frame(rhythm, state.timer.tick)('✈');
        },
      },
      {
        type: 'confirm',
        name: 'has_seeder',
        message: 'Gerar Seeder?',
        timers: {
          separator: 250,
          prefix: 220,
        },
        prefix(state) {
          return frame(rhythm, state.timer.tick)('💡');
        },
        separator(state) {
          return frame(rhythm, state.timer.tick)('💡');
        },
      },
      {
        type: 'confirm',
        name: 'has_transformer',
        message: 'Gerar Transformer?',
        timers: {
          separator: 250,
          prefix: 220,
        },
        prefix(state) {
          return frame(rhythm, state.timer.tick)('♥');
        },
        separator(state) {
          return frame(rhythm, state.timer.tick)('♥');
        },
      },

      {
        type: 'confirm',
        name: 'route',
        message: 'Adicionar as rotas?',
        timers: {
          separator: 250,
          prefix: 220,
        },
        prefix(state) {
          return frame(rhythm, state.timer.tick)('💡');
        },
        separator(state) {
          return frame(rhythm, state.timer.tick)('💡');
        },
      },
      {
        type: 'input',
        name: 'camposTabela',
        message:
          'Atributos do recurso? (separados por virgula: "field1, field2,field3")',
      },
    ];

    return inquirer.prompt(questions).then((answers) => {
      const { camposTabela } = answers;
      const questions = [];

      // these values can be retrieved in the template with: eval(field + '.validation')
      camposTabela.split(',').forEach((field) => {
        questions.push(
          {
            type: 'select',
            name: field + '.tipo',
            message: `Qual o tipo de dado para o campo [${field}]?`,
            choices: [
              'string',
              'integer',
              'text',
              'boolean',
              'float',
              'uuid',
              'date',
              'datetime',
            ],
          },
          {
            type: 'confirm',
            name: field + '.notNullable',
            message: `[${field}] notNullable?`,
          },
          {
            type: 'confirm',
            name: field + '.default',
            message: `[${field}]  valor default?`,
          },
          {
            type: 'input',
            name: field + '.default_value',
            message: `Valor default para [${field}]?`,
          },
          {
            type: 'confirm',
            name: field + '.unique',
            message: `[${field}] valor Unique?`,
          },
        );
      });

      // both set of answers must be returned as a merged object, else the previous set of answers won't be available to the templates
      return inquirer.prompt(questions).then((nextAnswers) => {
        const camposTabela = { ...nextAnswers };
        const questionsMerged = Object.assign({}, answers, {
          tiposDados: camposTabela,
        });
        console.log(JSON.stringify(questionsMerged));
        return questionsMerged;
      });
    });
  },
};
/**
module.exports = [
  {
    header: yosay('✨ Inovan.do Crud Generator ✨'),
    type: 'input',
    name: 'resource',
    message: 'Nome do Recurso',
    timers: {
      separator: 250,
      prefix: 220,
    },
    prefix(state) {
      return frame(rhythm, state.timer.tick)('💡');
    },
    separator(state) {
      return frame(rhythm, state.timer.tick)('💡');
    },
  },
  {
    type: 'confirm',
    name: 'route',
    message: 'Adicionar as rotas?',
    timers: {
      separator: 250,
      prefix: 220,
    },
    prefix(state) {
      return frame(rhythm, state.timer.tick)('💡');
    },
    separator(state) {
      return frame(rhythm, state.timer.tick)('💡');
    },
  },
  {
    type: 'confirm',
    name: 'has_seeder',
    message: 'Gerar Seeder?',
    timers: {
      separator: 250,
      prefix: 220,
    },
    prefix(state) {
      return frame(rhythm, state.timer.tick)('💡');
    },
    separator(state) {
      return frame(rhythm, state.timer.tick)('💡');
    },
  },
  {
    type: 'confirm',
    name: 'has_transformer',
    message: 'Gerar Transformer?',
    timers: {
      separator: 250,
      prefix: 220,
    },
    prefix(state) {
      return frame(rhythm, state.timer.tick)('♥');
    },
    separator(state) {
      return frame(rhythm, state.timer.tick)('♥');
    },
  },
];
*/
