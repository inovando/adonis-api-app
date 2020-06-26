'use strict';
const BaseExceptionHandler = use('BaseExceptionHandler');
const sentry = use('Sentry');
const Logger = use('Logger');
const Env = use('Env');
const Youch = use('youch');

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response, auth }) {
    if (error.name === 'ValidationException') {
      return response.status(error.status).send(error.message);
    }

    if (error.name === 'InvalidJwtToken') {
      const msg = 'Token Invalido ou não informado.';
      this.logErro(msg, auth);
      return response.status(error.status).send({ msg });
    }

    if (Env.get('NODE_ENV') === 'development') {
      const youch = new Youch(error, request.request);
      const errorJson = await youch.toJSON();

      this.logErro(errorJson, auth);
      return response.status(error.status).send(errorJson);
    }

    this.logErro(error, auth);
    return response.status(error.status).send('server error');
  }

  async logErro(error, auth) {
    const user = auth.user ? auth.user : {};
    const logErrro = JSON.stringify(error);
    Logger.error({ user, msg: `Exceção capturada: ${logErrro}` });
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error) {
    sentry.captureException(error);
  }
}

module.exports = ExceptionHandler;
