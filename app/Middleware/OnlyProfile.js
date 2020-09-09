'use strict';

/**
 * Accept Request only for profiles with access
 */
class OnlyProfile {
  async handle({ response, auth }, next, properties) {
    const canAccess = await this.validateAcess(auth, properties);

    if (!canAccess) {
      response.status(401).json('Unauthorized');
    }
    await next();
  }

  async validateAcess(auth, profilesAllowd) {
    const userProfile = await auth.user.profiles().fetch();

    const collection = userProfile.toJSON();
    return collection.find((p) => {
      return p.name == profilesAllowd;
    });
  }
}

module.exports = OnlyProfile;
