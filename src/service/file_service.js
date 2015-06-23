import fs from 'fs';
import crypto from 'crypto';
import os from 'os';
import promise from 'bluebird';
import File from '../model/file';
import logger from './logger';
import * as qnService from './qn_service';

/**
 * Some initializing work before using file service.
 */
export function init() {
    qnService.initFileBucketKey();
}

/**
 * Insert a new file, put meta data to db and upload body to qiniu.
 *
 * @param {Object} file - The file object.
 * @returns {Promise}
 */
export function insertFile(file) {
    let upToken = qnService.getUploadToken();
    let key = generateKey();

    return promise.promisify(fs.readFile).call(this, file.path)
        .then((data) => {
            logger.verbose('Read file data from temp.');
            return qnService.upload(upToken, key, data);
        })
        .then((ret) => {
            logger.verbose('File uploaded.')
            fs.unlink(file.path); // [async] don't care the result of this action.
            let fileObj = new File(fileAdaptor(file, key));
            return fileObj.saveAsync();
        });
}

/**
 * Remove a file info, and remove the resource on qiniu.
 *
 * @param {String} key - The key of resource.
 * @returns {Promise}
 */
export function removeFile(key) {
    logger.verbose('Ready to remove %s.', key);
    return File.findOneAndRemoveAsync({ key: key })
        .then((ret) => {
            if(!ret) return;
            return qnService.remove(key);
        });
}

/**
 * Get a file info, and download from qiniu.
 *
 * @param {String} key - The key of resource.
 * @returns {Promise}
 */
export function getFileUrl(key) {
    logger.verbose('Ready to get download url %s.', key);
    return File.findOneAsync({ key: key })
        .then((file) => {
            if(!file) {
                let err = new Error("Can't find file from key " + key + ".");
                err.status = 404;
                throw err;
            }
            logger.verbose('Key %s existed in db.', key);
            return [qnService.getDownloadUrl(file.key), file];
        });
}

/**
 * Check a file is exist or not.
 *
 * @param {String} key - The key of resource.
 * @returns {Promise}
 */
export function checkFile(key) {
    return File.findOneAsync({ key: key })
        .then((file) => {
            // if(!file) {
            //     let err = new Error("Can't find file from key " + key + ".");
            //     err.status = 404;
            //     throw err;
            // }
            if(!file) return;
            else return qnService.getFileInfo(key);
        });
}

/**
 * Adaptor for transform the File object to mongo model.
 *
 * @param {Object} file - The File object.
 * @param {String} key - Given key for resource.
 */
function fileAdaptor(file, key) {
    return {
        key: key || generateKey(),
        meta: {
            mime: file.type,
            size: file.size,
            name: file.name
        }
    }
}

/**
 * Method for generate unique key for resource.
 *
 * @return {String} Unique key.
 */
function generateKey() {
    let md5 = crypto.createHash('md5'),
        secret = '' + new Date().getTime() + os.hostname();

    md5.update(secret);

    return md5.digest('hex');
}
