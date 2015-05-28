import express from 'express';
import * as qnService from '../service/qn_service';

let router = express.Router();

router.get('/:id', (req, res) => {
    // db query and get resource key

    // get download url

    // request and set header
});

router.get('/', (req, res) => {
    // db query and list
});

router.post('/', (req, res) => {
    // insert a db document, map _id and resource key
});

router.delete('/:id', (req, res) => {
    //
});

export default router;