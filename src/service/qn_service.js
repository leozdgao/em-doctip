import qn from 'qiniu'
import qs from 'querystring'
import crypto from 'crypto'
import config from '../../config'

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
  let putPolicy = new qn.rs.PutPolicy('testbucket');
  putPolicy.callbackUrl = '/qnservice/callback';
  putPolicy.callbackBody = qs.stringify({
    key: '$(key)',
    fname: '$(fname)',
    fsize: '$(fsize)'
  });
  
  return putPolicy.token();
};