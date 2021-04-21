const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const ApiCallMongo = require('./src/ApiCallMongo');
const ApiCallPostgres = require('./src/ApiCallPostgres');

const port = Number(process.env.port || 80);
const MONGO_CONNECTION = process.env.MONGO_CONNECTION;
const POSTGRES_CONNECTION = process.env.POSTGRES_CONNECTION;

const app = express();
app.use(helmet());

if (typeof MONGO_CONNECTION !== 'string') {
    console.error('A MONGO_CONNECTION must be provided');
    process.exit(1);
}

if (typeof POSTGRES_CONNECTION !== 'string') {
    console.error('A POSTGRES_CONNECTION must be provided');
    process.exit(1);
}

async function bootstrap() {
    let sequelize;
    let ApiCallPostgresModel;
    try {
        await mongoose.connect(MONGO_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Connection to mongodb done');
    } catch(e) {
        console.error('Error when connecting to mongodb database');
        throw e;
    }

    try {
        sequelize = new Sequelize(POSTGRES_CONNECTION);
        await sequelize.authenticate();
        console.log('Connection to postgres database done');
        ApiCallPostgresModel = ApiCallPostgres.getApiCallModel(sequelize)
        await sequelize.sync();
    } catch(e) {
        console.error('Error when connecting to postgres database');
        throw e;
    }

    app.use(async (req, _, next) => {
        const { path, method } = req;
        const date = Date.now();
        console.log(`Call on path: ${path} with method: ${method}`);
        try {
            const apiCallMongo = new ApiCallMongo.ApiCallModel();
            const apiCallPostgres = ApiCallPostgresModel.build({ path, method, date });
            await apiCallPostgres.save();

            apiCallMongo.path = path;
            apiCallMongo.method = method;
            apiCallMongo.save((err) => {
                if (err) {
                    console.error(err);
                }
                next();
            });
        } catch(e) {
            console.error(e);
            throw e;
        }
    });

    app.get('/', (_, res) => {
        res.status(200).send('Well done!');
    });

    app.get('/calls/count', async (_, res) => {
        try {
            res.status(200).json({
                mongo: await ApiCallMongo.ApiCallModel.countDocuments(),
                postgres: await ApiCallPostgresModel.count(),
            });
        } catch(e) {
            console.error(e);
            res.status(500).send('Internal server error');
        }
    });

    app.listen(port, () => {
        console.log(`App is listenning on port ${port}`);
    });
}

bootstrap()
    .catch(console.error);
