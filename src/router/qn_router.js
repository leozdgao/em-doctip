import express from 'express';
import qs from 'querystring';
import bodyParser from 'body-parser';
import * as qnService from '../service/qn_service';

let router = express.Router();

router.use((req, res, next) => {
    qnService.initKey();
    next();
});

/**
 * Url for token request
 */
router.get('/uptoken', (req, res) => {
    // return upload token
    res.status(200).json({
        uptoken: qnService.getUploadToken()
    });
});

router.get('/downloadurl', (req, res) => {
    let key = req.query.key;
    res.status(200).json({
        url: qnService.getDownloadUrl(key)
    });
});

router.get('/rmresource', (req, res, next) => {
    let key = req.query.key;
    qnService.remove(key, (err, ret) => { console.log(err); console.log(ret);
        if (err) {
            next(err);
        } else {
            res.status(200).json(ret);
        }
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
        
        // response to client
        res.json({ success: true });
    }
    // invalid callback request
    else {
        res.status(401).end();
    }
});

export default router;