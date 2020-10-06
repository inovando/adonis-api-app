'use strict';

const DataBase = use('Database');

class OwnerOnly {
  async handle({ response, auth, params }, next, properties) {
    const [tableName] = properties;
    const user = await auth.user;

    await this.isAdmin({ response, user });
    await this.isOwner({ response, params, user }, tableName);

    await next();
  }

  async isOwner({ response, params, user }, tableName) {
    const record = await DataBase.table(tableName)
      .select('user_id')
      .where('id', params.id)
      .first();

    if (record.user_id !== user.id) {
      return response.status(401).json({ msg: 'Unauthorized' });
    }
  }

  async isAdmin({ response, user }) {
    const profiles = await user.profiles().fetch();

    const hasAdminProfile = profiles
      .toJSON()
      .find((profile) => profile.name === 'ADMIN');

    if (!hasAdminProfile) {
      return response.status(401).json({ msg: 'Unauthorized' });
    }
  }
}

module.exports = OwnerOnly;
