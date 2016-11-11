/**
 * Created by zoram on 11/11/16.
 */
var self;
var Strings = require('../config/strings');
var keyprefix = require('../config/keyprefix');
var rediscli = require('../config/redisclient');
var async = require('async');
var Auth = module.exports = function Auth(options) {
    self = this
}

Auth.prototype.getSessionUser = function(authtoken,callback){
    console.log(authtoken,keyprefix.sessionuser + authtoken);

    rediscli.get(keyprefix.sessionuser + authtoken, function (err, res) {
        console.log("get session user " , res);
        //need to handle error
        if (err || !res) {
            console.log("Auth Error");
            return callback(true,null);
        } else {

            return callback(null,res);
        }
    });
};

Auth.prototype.getUserSession = function(urid,callback){
    console.log("get user session ",urid);

    rediscli.get(keyprefix.usersession + urid, function (err, res) {
        console.log("get user session " ,res);
        //need to handle error
        if (err || !res) {
            console.log("Auth Error");
            return callback(true,null);
        } else {
            return callback(null,res)
        }
    });
};

