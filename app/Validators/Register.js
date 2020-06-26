'use strict';

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
    return {
      'email.required': 'You must provide a email address.',
      'email.email': 'You must provide a valid email address.',
      'email.unique': 'This email is already registered.',
      'password.required': 'You must provide a password',
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).json({ error: errorMessages });
  }
}

module.exports = Register;
