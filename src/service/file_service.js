import fs from 'fs';
import crypto from 'crypto';
import os from 'os';
import promise from 'bluebird';
import File from '../model/file';
import * as qnService from './qn_service';

/**
 * Some initializing work before using file service.
 */
export function init() {
    qnService.initFileBucketKey();
}

/**
 * Insert a new file, put meta data to db and upload body to qiniu.
 * @param {Object} file - The file object.
 */
export function insertFile(file) {
    let upToken = qnService.getUploadToken();
    let key = generateKey();
    let body = fs.read(file.path);

    return promise.promisify(fs.readFile).call(this, file.path)
        .then((data) => {
            return qnService.upload(upToken, key, data);
        })
        .then((ret) => { console.dir(ret);
            fs.unlink(file.path); // [async] don't care the result of this action.
            let fileObj = new File(fileAdaptor(file, key));
            return fileObj.saveAsync();
        });
}

/**
 * Remove a file info, and remove the resource on qiniu.
 * @param {String} key - The key of resource.
 */
export function removeFile(key) {
    file.findOneAndRemoveAsync({ key: key })
        .then(() => {

        })
}

/**
 * Get a file info, and download from qiniu.
 * @param {String} key - The key of resource.
 */
export function getFile(key) {
    File.findOneAsync({ key: key })
        .then((file) => {
            if(!file) throw new Error('File not found.');
        })
        // download
        .then((key) => {

        });
}

/**
 * Check a file is exist or not.
 * @param {String} key - The key of resource.
 */
export function checkFile(key) {

}

/**
 * Adaptor for transform the File object to mongo model.
 * @param {Object} file - The File object.
 * @param {String} key - Given key for resource.
 */
function fileAdaptor(file, key) {
    return {
        key: key || generateKey(),
        meta: {
            mime: file.type,
            size: file.size
        }
    }
}

/**
 * Method for generate unique key for resource.
 * @return {String} Unique key.
 */
function generateKey() {
    let md5 = crypto.createHash('md5'),
        secret = '' + new Date().getTime() + os.hostname();

    md5.update(secret);

    return md5.digest('hex');
}
