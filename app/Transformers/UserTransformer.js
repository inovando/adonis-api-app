const BumblebeeTransformer = use('Bumblebee/Transformer');
const moment = require('moment');

class UserTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ['profiles'];
  }

  transform(model) {
    return {
      id: model.id,
      username: model.username,
      email: model.email,
      created_at: model.created_at,
      created_at_formated: moment(model.created_at).format('D/MM/Y'),
    };
  }

  includeProfiles(model) {
    return this.collection(model.getRelated('profiles'), 'BaseTransformer');
  }
}

module.exports = UserTransformer;
