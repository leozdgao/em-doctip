import express from 'express';
import formidable from 'formidable';
import * as fileService from '../service/file_service';

let router = express.Router();

router.use((req, res, next) => {
    fileService.init();
    next();
});

/**
 * Route for downloading a file.
 */
router.get('/:id', (req, res) => {
    // db query and get resource key

    // get download url

    // request and set header
});

/**
 * Route for uploading a file.
 */
router.post('/', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if(err) next(err);
        else {
            // upload every file and insert db record.
            let promiseCollection = files.map((file) => fileService.insertFile(file));
            promise.all(promiseCollection)
                // after save file document
                .then((files) => {
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
router.delete('/:id', (req, res) => {
    //
});

export default router;