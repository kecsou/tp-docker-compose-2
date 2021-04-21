# TP docker-compose-2
Your rendering must be done throug a private repository of yours where you will have to invite me.

The purpose of this exercise is to create a connection between your application and two databases (mongodb and postgres).

Your application is nodejs based, therefore your will need the following commands for running your application:
  - yarn install
  - yarn start

If you don't have yarn you can use npm as well (``npm install`` and ``npm start``).


# Step 1
You have to contenerize your nodejs application by creating a Dockerfile.

# Step 2
You have to find a way to make your application interact with the two databses.

When running your application your will have to provide it two environnement variables:
  - MONGO_CONNECTION
  - POSTGRES_CONNECTION

This is an exemple of the pattern you will have to use for the environnement variable `MONGO_CONNECTION`
You can refer to the dockerHub's documentation for the mongo docker container [here](https://hub.docker.com/_/mongo)

```
# mongodb://localhost:27017
```

And this is an exemple of the pattern you will have to use for the `POSTGRES_CONNECTION` environnement variable 

```
# postgres://username:userpassword@localhost:5432/postgres
```
You can refer to the dockerHub's documentation for the postgres docker container [here](https://hub.docker.com/_/postgres)

If you don't provide these variables a proper error message will be printed

`/!\ Always read all of your error messages COMPLETELY /!\`.

Remember you will have to create docker networks for setting up this infrastructure.

Here you have to use `docker-compose` for setting up all your services and your configurations.
# Step 3
You have to create a workflow which will create build and push your image on DockerHub.

After this you will have ensure that you use this image as reference for your docker container inside of your docker-compose.yaml file.

# Bonus
You have to set your monngodb's your postgres's data persistent using docker volumes.

If you want information on the directory where these databases store their data, you can refer to the Docker Hub documentation provided above.

```
Use the endpoint /calls/count for having an idea of your databases's volume state
```
