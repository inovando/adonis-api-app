'use strict';

const UserRepository = use('App/Repositories/UserRepository');

class UserController extends use('/BaseController') {
  constructor() {
    super(UserRepository, 'UserTransformer');
    this.respository = UserRepository;
  }
}

module.exports = UserController;
