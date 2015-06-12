import express from 'express';
import formidable from 'formidable';
import request from 'request';
import promise from 'bluebird';
import contentDisposition from 'content-disposition';
import logger from '../service/logger';
import * as fileService from '../service/file_service';

let router = express.Router();

router.use((req, res, next) => {
    fileService.init();
    next();
});

router.get('/:id/check', (req, res, next) => {
    let id = req.params.id;
    fileService.checkFile(id)
        .then((ret) => {
            res.json({ exist: true });
        })
        .catch((err) => {
            if(err.code == 612) res.json({ exist: false });
            else next(err);
        });
});

/**
 * Route for downloading a file.
 */
router.get('/:id', (req, res, next) => {
    // db query and get resource key
    let id = req.params.id;
    fileService.getFileUrl(id)
        .then((ret) => {
            // get download url
            let url = ret[0], file = ret[1];

            request({
                uri: url,
                method: 'GET'
            }).on('response', (resp) => {
                // TODO: figure out browser cache
                // set response header
                res.setHeader('Content-Type', file.meta.mime);
                res.setHeader('Content-Disposition', contentDisposition(file.meta.name));
                res.setHeader('Cache-Control', resp.headers['cache-control']);
                res.setHeader('ETag', resp.headers['etag']);
            }).on('error', (err) => {
                next(err);
            }).on('data', (data) => {
                // progressing
                res.write(data);
            }).on('end', () => {
                res.end();
            });
        })
        .catch((err) => {
            next(err);
        });
});

/**
 * Route for uploading a file.
 */
router.post('/', (req, res, next) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err) next(err);
        else {
            // upload every file and insert db record.
            let promiseCollection = Object.keys(files).map((name) => {
                let file = files[name];
                return fileService.insertFile(file);
            });
            promise.all(promiseCollection)
                // after save file document
                .then((files) => {
                    logger.info('All files uploaded and db entries inserted.')
                    res.status(200).json(files);
                })
                .catch((err) => {
                    next(err);
                });
        }
    });
});

/**
 * Route for removing a file.
 */
router.delete('/:id', (req, res, next) => {
    //
    let id = req.params.id;
    fileService.removeFile(id)
        .then(() => {
            res.status(200).end();
        })
        .catch((err) => {
            next(err);
        });
});

export default router;