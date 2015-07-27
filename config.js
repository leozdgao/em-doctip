var debug = (process.env['PRODUCT'] != 'true');
var testdb = process.env['MONGO_FILE_TEST'] || "mongodb://10.10.73.207:27018/test";
var productdb = process.env['MONGO_FILE_PRODUCT'] || "mongodb://10.10.73.207:27018/Ps_Service";

module.exports = {
    port: process.env['FILE_PORT'] || 4000,
    mode: debug ? 'dev' : '',
    path: '/', // mount
    qiniu: {
        kvs: {
            doc: {
                access_key: 'mW7zd3zNY0LHwbh6loeAWDyzYYnsD5UaXPMveMBc',
                secret_key: 'vUNx0iFBux7BHEML7VK6mcoee_RiJ16s6jcmAxMk'
            },
            image: {
                access_key: '',
                secret_key: ''
            }
        },
        mode: "",
        bucket: {
            name: 'testbucket',
            host: '7xjb4p.com1.z0.glb.clouddn.com'
        }
    },
    db: {
        connection: debug ? testdb : productdb,
        timeout: 30000 //  30s
    },
    log: {
        info: 'info.log',
        err: 'err.log'
    },
    release: {
        server: {
            src: 'src/**/*.js',
            dist: 'server'
        }
    }
};
