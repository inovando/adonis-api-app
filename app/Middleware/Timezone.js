'use strict';

class Timezone {
  async handle({ timezone }, next) {
    timezone.activate('America/Sao_Paulo');
    await next();
  }
}

module.exports = Timezone;
