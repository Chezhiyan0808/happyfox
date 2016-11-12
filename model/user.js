/**
 * Created by zoram on 10/11/16.
 */
var keyprefix = require('../config/keyprefix');
var rclient = require('../config/redisclient');
var strings = require('../config/strings');
var misc = require('../utils/misc');
var async = require('async');
var _uid = null;

var USER = module.exports = function USER(urid) {
    _uid = urid;
}


USER.prototype.addUser = function (attrib, cb) {
    var self = this;
    self.generateURID(function (err, usrid) {
        if (err) {
            return cb(true, strings.ERRORS.USER_ALLOCATION_FAILED);
        }
        _uid = usrid;
        var usrobj = {}
        var hkey = keyprefix.USER + _uid;
        usrobj.name = attrib.name;
        usrobj.email = attrib.email;
        usrobj.password = attrib.password;

        var multi = rclient.multi();
        multi.hmset(hkey,usrobj);
        multi.set(keyprefix.EMAIL_USER + attrib.email, _uid);
        multi.sadd(keyprefix.USR_COL, _uid);
        multi.exec(function(e,r){
            if(e){
                return cb(true,strings.ERRORS.USER_ALLOCATION_FAILED);
            }
            self.createUserSession(function(e,r){
                if(e){
                    return cb(true,strings.ERRORS.USER_SESSION);
                }
                return cb(null,{urid:_uid,stkn:r});
            })
        })
    });
}


USER.prototype.createUserSession = function (cb) {
    var self = this;
    var ss = {};

    //1. get a unique token
    var tkn = misc.getRandToken();
    async.waterfall([
        function(cb) {
            rclient.set(keyprefix.SESSION_USER + tkn, _uid, function (err, res) {
                //need to handle error
                if (err || !res) {
                    console.log("cant create session");
                    return cb(err, {"msg": "Session creation error"});
                }
                return cb();
            });
        },
        function(cb){
            rclient.set(keyprefix.USER_SESSION + _uid, tkn, function (e, r) {
                if (e) {
                    console.log("session reverse index create error");
                    return cb(true, e);
                }
                return cb();
            });
        },
        function(cb){
            rclient.sadd(keyprefix.SESSION_COL, tkn, function (e, r) {
                if (e) {
                    console.log("session reverse index create error");
                    return cb(true, e);
                }
                return cb();
            });
        }

    ],function(e,r){
        if(e){
            return cb(true);
        }
        return cb(null,tkn);
    })
}

USER.prototype.generateURID = function (cb) {
    rclient.INCR(keyprefix.USR_CNT, function (err, count) {
        if (err) {
           return  cb(true);
        }
        return cb(null, count);
    });
};