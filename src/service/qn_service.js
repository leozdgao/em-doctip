import qn from 'qiniu';
import qs from 'querystring';
import crypto from 'crypto';
import config from '../../config.json';

export function initKey () {
    let dockv = config.qiniu.kvs.doc;
    qn.conf.ACCESS_KEY = dockv['access_key'];
    qn.conf.SECRET_KEY = dockv['secret_key'];
}

export function checkAuth (authHeader, path, body) {
    if (/^QBox /.test(authHeader)) {

        let temp = authHeader.slice(5).split(':'),
            access_key = temp[0];

        if (config.qiniu['access_key'] == access_key) {

            let encoded_data = temp[1],
                secret_key = config.qiniu['secret_key'],
                data = path + '\n' + body,
                key = crypto.createHmac('sha1', secret_key).update(data).digest('base64');

            if (encoded_data == key) return true;
        }
    }

    return false;
}

/**
 * Generate PutPolicy for qiniu
 * 
 * DevDoc: http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html
 */
export function getUploadToken () {
    
    let mode = config.qiniu.mode;
    let putPolicy = new qn.rs.PutPolicy('testbucket');
    if(mode == 'callback') {
        putPolicy.callbackUrl = 'http://10.10.74.15:8080/qnservice/callback';
        putPolicy.callbackBody = qs.stringify({
            key: '$(key)',
            fname: '$(fname)',
            fsize: '$(fsize)'
        });
    }

    return putPolicy.token();
}

export function getDownloadUrl(key) {

    let domain = config.qiniu.bucket.host,
        baseUrl = qn.rs.makeBaseUrl(domain, key),
        policy = new qn.rs.GetPolicy();

    return policy.makeRequest(baseUrl);
}

export function remove(key, cb) {
    let domain = config.qiniu.bucket.name,
        client = new qn.rs.Client();

    client.remove(domain, key, cb);
}

export function getEncodedEntryURI(key) {
    let domain = config.qiniu.bucket.name,
        entry = domain + ':' + key;

    return qn.util.urlsafeBase64Encode(entry);
}