/* eslint-disable camelcase */
'use strict';

const BaseRepository = use('./BaseRepository');
const { ioc } = require('@adonisjs/fold');

class UserRepository extends BaseRepository {
  constructor(model) {
    super(model);
    this.model = model;
  }

  async store({ request, response, auth }) {
    const { email, profile_id, password, username } = request.all();
    const emailLower = email.toLowerCase();

    const existUser = await this.model.findBy('email', emailLower);

    if (existUser) {
      return response.status(403).json({
        msg: 'Falha ao cadastrar usuário, email já cadastrado!',
        email: emailLower,
      });
    }

    const newUser = await this.model.create({
      email: emailLower,
      password,
      username,
    });

    newUser.profiles().attach([profile_id]);

    const accessToken = await auth.attempt(email.toLowerCase(), password);

    return response.status(201).json({
      msg: 'User created successfully.',
      access_token: accessToken.token,
      newUser,
    });
  }
}

ioc.singleton(
  'UserRepository',
  (app) => new UserRepository(app.use('App/Models/User')),
);

module.exports = ioc.use('UserRepository');
