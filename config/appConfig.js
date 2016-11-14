/**
 * Created by zoram on 10/11/16.
 */
var Confidence = require('confidence');
var store = new Confidence.Store();
var doc = {
    "$filter": "env",
    "dev": {
    server: {
        "host": "0.0.0.0",
            "port": 5000,
            "labels":['api'],
            routes: {
            cors: true
        }
    },
    defaultStorage: "FS",
        swaggerOptions: {
        'name': 'HappyFox',
            'title': 'HappyFox API services',
            host: "localhost:5000",
            basePath:"http://localhost:5000",
            schemes:['http'],
            apiVersion: 'V0.0.1'
    },
    database: {
        redis: {
            host: 'localhost',
                port: 6379
        }
    }
},
   "$default": {
        server: {
            "host": "localhost",
            "port": 5000,
            "labels":['api'],
            routes: {
                cors: true
            }
        },
        defaultStorage: "FS",
        swaggerOptions: {
            info : {
                'title': 'HappyFox API services',
                version: 'V0.0.1'
            },
            basePath:"/",
            documentationPath: "/"
        },
        database: {
            redis: {
                host: 'localhost',
                port: 6379
            }
        }
    }
};

store.load(doc);

module.exports = function (criteria) {
    criteria = criteria ? criteria : process.env.MODE;
    console.log("APP config ",criteria);

    if (criteria == "production") {
        return store.get('/', {"env": "production"});
    }
    else if (criteria == "staging") {
        return store.get('/', {"env": "stage"});
    }
    else if (criteria == "beta") {
        return store.get('/', {"env": "beta"});
    }
    else {
        return store.get('/', {"env": "default"});
    }
};