const BumblebeeTransformer = use('Bumblebee/Transformer');

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
    };
  }

  includeProfiles(model) {
    return this.collection(model.getRelated('profiles'), 'BaseTransformer');
  }
}

module.exports = UserTransformer;
