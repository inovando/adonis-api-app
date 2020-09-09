---
to: "<%= has_transformer ? `app/Transformers/${h.inflection.camelize(resource)}Transformer.js` : null %>"
unless_exists: true
sh: adonis migration:refresh  --seed
---

const BumblebeeTransformer = use('Bumblebee/Transformer');

class <%= h.capitalize(resource) %>Transformer extends BumblebeeTransformer {
  transformCollection(model) {
    return {
      id: model.id,
      status: model.status,
      created_at: model.created_at,
    };
  }

  transformItem(model) {
    return {
      id: model.id,
      status: model.status,
      created_at: model.created_at,
    };
  }
}

module.exports = <%= h.capitalize(resource) %>Transformer;
