'use strict';
const Antl = use('Antl');

class Register {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      username: 'required|min:3|max:255',
      email: 'required|email|unique:users',
      password: 'required|min:6|max:255',
      profile_id: `required|exists:profiles,id`,
    };
  }

  get messages() {
    return Antl.list('validation');
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).json({ error: errorMessages });
  }
}

module.exports = Register;
