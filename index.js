const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { ApiCallModel } = require('./src/ApiCall');

const port = Number(process.env.port || 80);
const mongo_connection = process.env.mongo_connection;
const app = express();
app.use(helmet());

if (typeof mongo_connection !== 'string') {
    console.error('A mongo connection must be provided');
    process.exit(1);
}

async function bootstrap() {
    try {
        await mongoose.connect(mongo_connection, {
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
            const count = await ApiCallModel.count();
            res.status(200).json({ count });
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
