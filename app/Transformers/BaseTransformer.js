const BumblebeeTransformer = use('Bumblebee/Transformer');

class BaseTransformer extends BumblebeeTransformer {
  transform(model) {
    return model;
  }
}

module.exports = BaseTransformer;
