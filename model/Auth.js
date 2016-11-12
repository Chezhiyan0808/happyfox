/**
 * Created by zoram on 11/11/16.
 */
var self;
var rediscli = require('../config/redisclient');
var keyprefix = require('../config/keyprefix')
var async = require('async');
var misc = require('../utils/misc')
var Auth = module.exports = function Auth(options) {
    self = this
}

Auth.prototype.getSessionUser = function (authtoken, callback) {
    console.log(authtoken, keyprefix.SESSION_USER + authtoken);

    rediscli.get(keyprefix.SESSION_USER + authtoken, function (err, res) {
        console.log("get session user ", res);
        //need to handle error
        if (err || !res) {
            console.log("Auth Error");
            return callback(true, null);
        } else {

            return callback(null, res);
        }
    });
};

Auth.prototype.getUserSession = function (urid, callback) {
    console.log("get user session ", urid);

    rediscli.get(keyprefix.USER_SESSION + urid, function (err, res) {
        console.log("get user session ", res);
        //need to handle error
        if (err || !res) {
            console.log("Auth Error");
            return callback(true, null);
        } else {
            return callback(null, res)
        }
    });
};

Auth.prototype.isEmailUser = function (email, cb) {
    var key = keyprefix.EMAIL_USER + email;
    rediscli.get(key, function (err, res) {
        if (err || !res) {
            console.log("user email id doesnot exist");
            return cb(null, {isuser: false});
        } else {
            return cb(null, {isuser: true,urid: res});
        }

    });
}

Auth.prototype.getUserPass = function (urid, cb) {
    var ukey = keyprefix.USER + urid;
    rediscli.hget(ukey, "password", function (err, res) {
        if (err || !res) {
            console.log("user email id doesnot exist");
            return cb(true);
        } else {
            return cb(null, res);
        }

    });
}

Auth.prototype.EmailAuthenticate = function (attrb, cb) {
    var self = this;
    async.waterfall([
        function (cb) {
            self.isEmailUser(attrb.email, function (e, isUser) {
                if (e && !(isUser.isuser)) {
                    console.log("user email id doesnot exist");
                    return cb(true, {msg: 'user does not exist'});
                } else {
                    cb(null, isUser.urid);
                }
            });
        },
        function (urid, cb) {
            self.getUserPass(urid, function (e, r) {
                if (e || r !== attrb.password) {
                    console.log("invalide password " + r);
                    return cb(true, {msg: 'invalid password'});
                } else {
                    console.log("valid email user : " + urid);
                    cb(null, urid);
                }
            })
        }
    ], function (e, r) {
        if (e) {
            cb(true);
        } else {
            cb(null, r);
        }
    })
};