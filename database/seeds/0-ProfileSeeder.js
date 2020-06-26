'use strict';

/*
|--------------------------------------------------------------------------
| ProfileSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/
const Profile = use('App/Models/Profile');

class ProfileSeeder {
  async run() {
    const profiles = [{ name: 'Administrador' }, { name: 'Default' }];

    for (let index = 0; index < profiles.length; index++) {
      const element = profiles[index];
      const profile = new Profile();
      profile.name = element.name;
      await profile.save();
      await profile.reload();
    }
    console.log('ProfileSeeder Finished');
  }
}

module.exports = ProfileSeeder;
