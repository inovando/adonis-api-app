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
