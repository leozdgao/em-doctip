import express from 'express'
import qs from 'querystring'
import bodyParser from 'body-parser'
import * as qnService from '../service/qn_service'

let router = express.Router();

/**
 * Url for token request
 */
router.get('/token', (req, res) => {
    // return upload token
    res.status(200).json({
        token: qnService.getUploadToken()
    });
});

/**
 * Callback url for qiniu upload callback mode, and response in json format which 
 * will be responsed to client by qiniu service.
 * 
 * DevDoc: http://developer.qiniu.com/docs/v6/api/overview/up/response/callback.html
 * 
 * Example request body:
 * 
 *     POST /callback  HTTP/1.1
 *     Content-Type: application/x-www-form-urlencoded
 *     User-Agent: qiniu go-sdk v6.0.0
 *     Host: api.examples.com
 *     Authorization: QBox iN7NgwM31j4-BZacMjPrOQBs34UG1maYCAQmhdCV:tDK-3f5xF3SJYEAwsll5g=
 *      
 *     name=sunflower.jpg&hash=Fn6qeQi4VDLQ347NiRm- \
 *     RlQx_4O2&location=Shanghai&price=1500.00&uid=123
 */
router.post('/callback', bodyParser.urlencoded({extended: true}), (req, res) => {
    // parse args
    let authHeader = req.get('Authorization'),
        path = req.path,
        body = qs.stringify(req.body);

    // check Authorization header
    if(qnService.checkAuth(authHeader, path, body)) {
        
        // parse body
        let { fsize, fname, key } = req.body;
                
        // save meta data to db
        
        // response
        res.json({ success: true });
    }
    // invalid callback request
    else {
        res.status(401).end();
    }
});
