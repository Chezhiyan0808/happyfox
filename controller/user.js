/**
 * Created by zoram on 10/11/16.
 */
var async = require('async');
var _ = require('underscore');
var auth = require('../model/Auth');
var usrmdl = require('../model/user');
var movmdl = require('../model/movies');
var strings = require('../config/strings');
var user = {};

user.signup = function (req, reply) {
    var attrib = req.payload;
    var Auth = new auth();
    async.waterfall([
        function (cb) {
            Auth.isEmailUser(attrib.email, function (e, r) {
                if (!e && r.isuser) {
                    cb(true, strings.ERRORS.ALREADY_USER);
                } else {
                    cb();
                }
            })
        },
        function (cb) {
            var User = new usrmdl();
            User.addUser(attrib, function (e, r) {
                if (e || !r) {
                    return cb(true, strings.ERRORS.USER_ALLOCATION_FAILED);
                } else {
                    return cb(null, r);
                }

            })
        }
    ], function (e, r) {
        var succ = _.clone(strings.SUCCESS.SUCCESS);
        if (e) {
            return reply(r);
        }
        succ.urid = r.urid;
        succ.authtoken = r.stkn;
        return reply(succ);
    })
};

user.genacctkn = function (req, reply) {
    var attrib = req.payload;
    var Auth = new auth();
    async.waterfall([
        function (cb) {
            Auth.EmailAuthenticate(attrib, function (e, signin_res) {
                if (!e && signin_res) {
                    cb(null, signin_res);
                } else {
                    cb(true, signin_res);
                }
            })
        },
        function (urid, cb) {
            var USRMDL = new usrmdl(urid);
            USRMDL.createUserSession(function (e, stkn) {
                if (!e && stkn) {
                    cb(null, {urid: urid, stkn: stkn});
                } else {
                    cb(true, stkn);
                }
            })
        }
    ], function (e, r) {
        var succ = _.clone(strings.SUCCESS.SUCCESS);
        console.log(r)
        if (e) {
            reply(strings.ERRORS.INVALID_SIGNIN);
        } else {
            succ.urid = r.urid;
            succ.authtoken = r.stkn;
            reply(succ);
        }
    })

}
user.signin = function (req, reply) {
    var urid = req.auth.credentials;
    var succ = _.clone(strings.SUCCESS.SUCCESS);
    succ.urid = urid+"";
    reply(succ);
}

user.setFavGenres = function (req, reply) {
    var urid = req.auth.credentials;
    var attrib = req.payload;
    var User = new usrmdl(urid);
    User.setFavGenres(attrib.genres,function(e,r){
        if(!e){
            var succ = _.clone(strings.SUCCESS.SUCCESS);
            reply(succ);
        }else{
            reply(strings.ERRORS.ADDING_GENRE_FAILED);
        }
    })


};
user.getRecomendations = function (req, reply) {
    var urid = req.auth.credentials;
    var User = new usrmdl(urid);
    var Movmdl = new movmdl();
    async.waterfall([
        function (cb) {
            User.getFavGenres(function(e,fav){
                if(e){
                  return  cb(true)
                }
               return cb(null,fav)
            })
        },
        function(fav,cb){
            console.log("fav", fav);
            Movmdl.getRecomendation(fav,cb);
        }
    ],function(e,r){
        if(!e){
            var succ = _.clone(strings.SUCCESS.SUCCESS);
            if(r){
                succ.movies = r;
            }else{
                succ.movies = [];
            }
            reply(succ);
        }else{
            reply(strings.ERRORS.ADDING_GENRE_FAILED);
        }
    })
};
module.exports = user;