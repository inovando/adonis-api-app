# Adonis API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Usage

1. Setup a [Postgis Database](#postgis)

2. Initialize your project with this command:

```bash
adonis new yardstick --blueprint=inovando/adonis-api-app
```

3. Modify `.env` fulfilling variables as needed

4. Run the following command:

```bash
adonis serve --dev
```

5. Done 🎉

### Postgis

#### Local install

[Follow this link](https://postgis.net/install/)

#### Docker

```bash
docker run --name database -e POSTGRES_PASSWORD=some-password -p 5432:5432 -d postgis/postgis
docker start database
```

### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```

### Roadmap

- [x] Abstração Controller/Repository
- [x] [Bumblebee (include)](https://github.com/rhwilr/adonis-bumblebee)
- [x] Enviar e-mails
- [x] Método para autenticar, resetar senha
- [x] Endpoints `/me`
- [x] Abstração de profiles
- [x] Upload de arquivos genérico
- [x] Sentry
- [x] Redis Cache
- [x] User and Profile Seeder

