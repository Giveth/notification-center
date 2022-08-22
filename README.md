It's forked from https://github.com/Giveth/apiGive
# Notification Center
This is a microservice for managing notifications for both https://giveth.io and other Dapps notifications

[Used Technologies](#Used_Technologies)

[Installation](#Installation)

[Test](#Test)

[Logs](#Logs)

[Migrations](#Migrations)

[References](#References)

### Used_Technologies
* Nodejs **v16**
* Typescript **v4.5.2**
* DB: postgres **v14.2**
* DB ORM: TypeORM **v0.3.6**
* Redis **v5.0.9**
* API protocol : REST
* Web application: Express **v4.17.3**
* Deployment: docker-compose **v3.3**
* API Documentation: Swagger
* Test framework: Mocha **v9.2.2**
* CI/CD tools : [GitHub Actions](https://github.com/Giveth/notification-center/blob/staging/.github/workflows/CI-CD.yml)

### Installation and Run

* `git clone git@github.com:Giveth/notification-center.git`
* `cd notification-center`
* `npm ci`
* Bringing up database, you can install that in other way, but I suggest
  using docker `docker-compose -f docker-compose-local-postgres-redis.ym up -d`
* Creat a file named `development.env` based on [Env example file](./config/example.env) and put it in `./config`
* Run [Migrations](#Migrations)
* `npm start`
* Now you can browse [Swagger](http:localhost:3040/docs)

### Test
You should have a postgress instance up in order to running tests so you can use  [Local DB docker-compose](./docker-compose-local-postgres-redis.ym)
* `npm run test`

### Logs

In localhost and test we put logs in console and file but in production and staging we just use file for writing logs You can see logs beautifully with this command

* `npm i -g bunyan`
* `tail -f logs/notification-center.log | bunyan`

### Migrations

#### Create new Migration file

```
typeorm migration:create --dir ./migrations --name seedNotificationType
```


#### Then you need to run the migrations like so

```
npm run db:migrate:run:local
```

#### If you want to revert last migration

```
npm run db:migrate:revert:local
```


## References

I used these articles for writing project

* https://blog.logrocket.com/linting-typescript-using-eslint-and-prettier

* https://rsbh.dev/blog/rest-api-with-express-typescript
