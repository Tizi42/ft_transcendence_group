<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <a href="https://www.postgresql.org/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/540px-Postgresql_elephant.svg.png?20080116191800" width="200" alt="PostgreSQL Logo" /></a>
  <a href="https://vuejs.org/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1184px-Vue.js_Logo_2.svg.png" width="200" alt="VueJS Logo" /></a>
  <a href="https://www.docker.com/" target="blank"><img src="https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png" width="200" alt="Docker Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# ft_transcendence

42 school project, we have to build a single page application. We have to implement a chat, a pong game, the authentication with 42 api, and some other things.

## Run our project

This project is running inside a docker, you can lunch it through docker-compose :
```bash
docker compose up --build
```

Once running, to connect to the database with CLI :
```bash
psql -h localhost -p 9876 -d ft-transcendence-db -U user-admin
```

# Backend

[NestJs](https://github.com/nestjs/) is a nodeJs framework working with TypeScript.

### Running the app

```bash
# development
$ npm run start

# watch mode, at every change the server restart
$ npm run start:dev

```

## Database

**Postgresql** is an open source relational Database working with SQL.

### Tips to use Postrges as CLI

The default user is ``postgres`` with his database ``postgres``. 

```bash
# Launch a specific database
$ psql <db_name>

# Launch user postgres with sudo
$ sudo -u postgres psql

# Inside postgres CLI psql
<db_name>=> 

# To list databases
<db_name>=> \l+

# To list roles (users)
<db_name>=> \du+

# To quit
<db_name>=> \q

# To show authication (if log with superuser postgres)
postgres=> SELECT * FROM pg_authid;

# To connect to another database
<db_name>=> \c <new_db_name>

# To list all tables for the current db
<db_name>=> \dt+
```

# Frontend

[VueJS](https://vuejs.org/) use javascript (typescript compatible also) to build user interface.

### Running the app

It's running by default on port 8080.

```bash
# developement
$ npm run serve

```
