'use strict';

import http from 'http';
import express from 'express';
import config from '../config.json';

let app = express();

// register routers
import qnRouter from './router/qn_router';

app.use('/qnservice', qnRouter);

// handle 404
app.use((req, res, next) => {
    let err = new Error('Not found.');
    err.status = 404;
    next(err);
});
// handel error
app.use((err, req, res, next) => { console.log(err);
    res.status(err.status || 500).json(err);
});


// listening
let port = config.port || 4000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});