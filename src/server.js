import http from 'http';
import express from 'express';
import promise from 'bluebird';
import mongoose from 'mongoose';
import logger from './service/logger';
import config from '../config.json';

let app = express();

promise.promisifyAll(mongoose);

if(config.mode == 'dev') app.use(express.static('public'));

// register routers
// import qnRouter from './router/qn_router';
import fileRouter from './router/file_router';

app.use('/file', fileRouter);
// app.use('/qnservice', qnRouter);

// handle 404
app.use((req, res, next) => {
    let err = new Error('Not found.');
    err.status = 404;
    next(err);
});
// handel error
app.use((err, req, res, next) => {
    let statusCode = err.status || 500;
    logger.warning('Request process error: ' + statusCode + ' ' + err.message);
    res.status(statusCode).json(err);
});

// listening
let port = config.port || 4000;
app.listen(port, () => {
    logger.info('Server start and listening on port ' + port);
});

// try to connect to db
var connected = false;

// set db connection config, timeout 5s
var dbConfig = {
    server: {
        socketOptions: { connectTimeoutMS: 5000 }
    }
};

mongoose.connect(config.db.connection, dbConfig);

mongoose.connection.on("connected", () => {

    logger.info("Connected to DB...");
    connected = true;
});

mongoose.connection.on("disconnected", () => {

    // after a successful connecting,
    // mongoose will reconnect automatically if connection disconnected.
    if(!connected) {

        logger.warning("DBConnection closed. Try to reconnect.");

        setTimeout(function() {
            mongoose.connection.open(config.db.connection, dbConfig);
        }, 5000);
    }
});

mongoose.connection.on("error", (err) => {
    logger.error("DB connection error occurred: " + err.message);
});
