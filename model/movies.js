/**
 * Created by zoram on 10/11/16.
 */

var keyprefix = require('../config/keyprefix');
var rclient = require('../config/redisclient');
var strings = require('../config/strings');
var async = require('async');
var _id;
var Movie = module.exports = function Movie(option) {
    if (option) {
        _id = option;
    }
}

Movie.prototype.create = function (prdattrb, cb) {
    var self = this;
    if (prdattrb === null) {
        return cb(true, null);
    }
    if (!prdattrb.id) {
        var _x;
        _x = (prdattrb.name).split('&').join('and');
        _x = _x.split(' ').join('-');
        _x = _x.toLowerCase();
        _x = _x + prdattrb.year;
        prdattrb.id = _x;
    }
    var _s = prdattrb.id;

    var multi = rclient.multi();
    multi.hmset(keyprefix.MOVIE + _s, prdattrb);
    multi.zadd(keyprefix.TRENDING, prdattrb.votes, _s);
    multi.SADD(keyprefix.MOVIE_COL, _s);
    var bn = prdattrb.genre;
    multi.HSET(keyprefix.MOVIE + _s, "genre", bn);
    multi.SADD(keyprefix.GENRE_MOVIE + bn, _s);
    multi.SADD(keyprefix.GENRE_COL, bn);
    multi.exec(function (err, replies) {
        if (err) {
            console.log("unable to create movie");
            return cb(true, {"msg": "error in creating movie"});
        }
        else {
            console.log("movie created", _s);
            return cb(null, _s);
        }
    });
};

Movie.prototype.vote = function (type, cb) {
    var self = this;
    async.waterfall([
        function (cb) {
            rclient.hget(keyprefix.MOVIE + _id, "votes", function (e, r) {
                if (e) {
                    return cb(true);
                } else {
                    cb(null, Number(r));
                }
            })
        },
        function (votes, cb) {

            type = type.toUpperCase();

            if (type == "UP") {
                votes = Number(votes) + 1;
            } else {
                votes = Number(votes) - 1;
            }
            var multi = rclient.multi();
            multi.zadd(keyprefix.TRENDING, votes, _id);
            multi.hset(keyprefix.MOVIE + _id, "votes", votes);
            multi.exec(cb);
        }
    ], function (e, r) {
        if (e) {
            return cb(strings.ERRORS.RATING_FAILED);
        } else {
            return cb();
        }
    })
};

Movie.prototype.addReview = function (msg, cb) {
    rclient.SISMEMBER(keyprefix.MOVIE_COL,_id,function(e,r){
        if(!e &&  r == 1){
          return  rclient.LPUSH(keyprefix.MOVIE_REV + _id, msg, cb);
        }else{
            return cb(strings.ERRORS.MOVIE_DET_FAILED)
        }
    })
}
Movie.prototype.getReviews = function (cb) {
    var key = keyprefix.MOVIE_REV + _id;
    console.log(key)
    rclient.LRANGE(key, 0, -1, cb);
}
Movie.prototype.getMovieDetails = function (cb) {
    rclient.hgetall(keyprefix.MOVIE+_id,function(e,mov_det){
        if(e){
            cb(true)
        }else{
            cb(null,mov_det)
        }
    })
}
Movie.prototype.getRecomendation = function (fav_arr, cb) {
    var self = this;
    if (fav_arr && fav_arr.length > 0) {
       fav_arr =  fav_arr.map(function(el) {
            return keyprefix.GENRE_MOVIE + el;
        })
        var cmd = ["$movies"];
        async.waterfall([
            function (cb) {
                rclient.SUNIONSTORE(cmd.concat(fav_arr), function (e, r) {
                    console.log(e,r)
                    cb();
                });
            },
            function (cb) {
                rclient.SMEMBERS("$movies", cb);
            }
        ], function (e, r) {
            if (e) {
                return cb(strings.ERRORS.GET_RECOM_FAILED)
            }
            return cb(null,r);
        })
    }
}