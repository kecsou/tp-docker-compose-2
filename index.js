const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');

const ApiCallMongo = require('./src/ApiCallMongo');

const port = Number(process.env.port || 80);
const MONGO_CONNECTION = process.env.MONGO_CONNECTION;
const POSTGRES_URI = process.env.POSTGRES_URI;

const app = express();
app.use(helmet());

if (typeof MONGO_CONNECTION !== 'string') {
    console.error('A MONGO_CONNECTION must be provided');
    process.exit(1);
}

if (typeof POSTGRES_URI !== 'string') {
    console.error('A POSTGRES_URI must be provided');
    process.exit(1);
}

async function bootstrap() {
    let sequelize;
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
        sequelize = new Sequelize(POSTGRES_URI);
        await sequelize.authenticate();
        console.log('Connection to postgress database done');
    } catch(e) {
        console.error('Error when connecting to postgres database');
        throw e;
    }

    app.use((req, _, next) => {
        const apiCall = new ApiCallModel();
        apiCall.path = req.path;
        apiCall.method = req.method;
        console.log(`Call on path: ${req.path} with method: ${req.method}`);
        apiCall.save((err) => {
            if (err) {
                console.error(err);
            }
            next();
        });
    });

    app.get('/', (_, res) => {
        res.status(200).send('Well done!');
    });

    app.get('/calls/count', async (_, res) => {
        try {
            const count = await ApiCallMongo.ApiCallModel.count();
            res.status(200).json({
                mongo: count,
                postgress: 0,
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
