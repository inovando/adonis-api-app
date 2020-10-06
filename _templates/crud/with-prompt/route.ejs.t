---
inject: true
to: start/routes.js
append : true
sh: yarn eslint --fix start/routes.js
---
<% if(route){ -%>
Route.resource("<%= h.inflection.transform(resource, ['pluralize', 'underscore'])%>", '<%= h.inflection.camelize(resource) %>Controller').middleware(['auth']).apiOnly();
<% } -%>
