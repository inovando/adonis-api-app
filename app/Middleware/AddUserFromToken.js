'use strict';

class AddUserFromToken {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(ctx, next) {
    ctx.user_id = await ctx.auth.user.id;
    await next();
  }
}

module.exports = AddUserFromToken;
