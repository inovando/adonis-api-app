# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick --blueprint=inovando/adonis-api-app
```

or manually clone the repo and then run `yarn install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

### Roadmap

- [ ] Abstração Controller/Repository
- [ ] [Bumblebee (include)](https://github.com/rhwilr/adonis-bumblebee)
- [ ] Enviar e-mails
- [ ] Método para autenticar, resetar senha
- [ ] Endpoints `/me`
- [ ] Abstração de profiles
- [ ] Upload de arquivos genérico
- [ ] Sentry
