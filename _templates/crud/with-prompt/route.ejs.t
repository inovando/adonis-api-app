---
inject: true
to: start/routes.js
append: true
---
<% if(route){ -%>

Route.resource("<%= h.inflection.transform(resource, ['pluralize', 'underscore'])%>", '<%= h.inflection.camelize(resource) %>Controller').middleware(['auth']).apiOnly();
<% } -%>