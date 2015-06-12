# EM-FileServer

It's a file server for EllieMae Team. Use [qiniu](http://www.qiniu.com/) for file storage.

There are RESTFul interface for it:

```
GET /:id      // Download a file
POST /    	  // Upload a file
DELETE /:id   // Remove a file
GET /:id/check  // Check a file exist or not
```

## Deployment

You need to install the dependencies first:

```
> npm install
```

The source code is in ECMAScript 6, I use babel for compiling it. After get the source code, use this to start server:

```
> npm start
```

or only do the compiling thing:

```
> gulp
```

## Configuration

```
{
	// port you want listen to
    "port": 8000,
    // if dev, a test page will be host
    "mode": "dev",
    // mount point
    "path": "",
    // config for qiniu
    "qiniu": {
        "kvs": {
            "doc": {
                "access_key": "mW7zd3zNY0LHwbh6loeAWDyzYYnsD5UaXPMveMBc",
                "secret_key": "vUNx0iFBux7BHEML7VK6mcoee_RiJ16s6jcmAxMk"    
            },
            "image": {
                "access_key": "",
                "secret_key": ""
            }
        },
        "mode": "",
        "bucket": {
            "name": "testbucket",
            "host": "7xjb4p.com1.z0.glb.clouddn.com"
        }
    },
    // db config
    "db": {
        "connection": "mongodb://10.10.73.207:27018/Ps_Service"
    },
    // log path
    "log": {
        "info": "info.log",
        "err": "err.log"
    },
    // release config
    "release": {
        "server": {
            "src": "src/**/*.js",
            "dist": "server"
        }
    }
}
```