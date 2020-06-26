'use strict';

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const User = use('App/Models/User');
const Profile = use('App/Models/Profile');

class UserSeeder {
  async run() {
    const admin = {
      username: 'Administrador',
      email: 'admin@admin.com',
      password: 'admin123',
    };

    const profileAdmin = await Profile.find(1);
    const userAdmin = await User.findOrCreate(admin);
    await userAdmin.profiles().attach([profileAdmin.id]);

    console.log('UserSeeder Finished');
  }
}

module.exports = UserSeeder;
