---
to: "<%= has_transformer ? `app/Transformers/${h.inflection.camelize(resource)}Transformer.js` : null %>"
unless_exists: true
sh: adonis migration:refresh  --seed
---

const BumblebeeTransformer = use('Bumblebee/Transformer');

class <%= h.capitalize(resource) %>Transformer extends BumblebeeTransformer {

  <%= resource %>(model) {
    return {
      id: model.id,
      status: model.status,
      created_at: model.created_at,
        <% Object.keys(tiposDados).forEach(function(key) { %>
         <%=key%> : model.<%=key%>,
        <% }); %>
    };
  }
  transformCollection(model) {
    return this.<%= resource %>(model);
  }

  transformItem(model) {
    return this.<%= resource %>(model);
  }
}

module.exports = <%= h.capitalize(resource) %>Transformer;
