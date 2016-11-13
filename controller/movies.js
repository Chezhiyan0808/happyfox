/**
 * Created by zoram on 10/11/16.
 */

var movie = {};
var moviemdl = require('../model/movies');
var strings = require('../config/strings')
var _ = require('underscore');
var async = require('async')
movie.addMovie = function (req, reply) {
    var attrib = req.payload;
    var Movmdl = new moviemdl();
    Movmdl.create(attrib, function (e, r) {
        if (e) {
            reply(strings.ERRORS.ADDING_MOVIE_FAILED);
        } else {
            var succ = _.clone(strings.SUCCESS.SUCCESS);
            succ.mvid = r;
            reply(succ);
        }
    });

}

movie.vote = function (req, reply) {
    var attrib = req.payload;
    var Movmdl = new moviemdl(attrib.mvid);
    Movmdl.vote(attrib.type, function (e, r) {
        if (e) {
            reply(r);
        } else {
            var succ = _.clone(strings.SUCCESS.SUCCESS);
            succ._id = r;
            reply(succ);
        }
    });

};
movie.addReview = function(req,reply){
    var payload = req.payload;
    var Movmdl = new moviemdl(payload.mvid);
    Movmdl.addReview(payload.msg,function(e,r){
        if(e){
            reply(strings.ERRORS.ADDING_REVIEW_FAILED)
        }else{
            var succ = _.clone(strings.SUCCESS.SUCCESS);
            reply(succ);
        }
    })
};

movie.getMovieByID = function(req,reply){
    var id = req.query.mvid;
    var Movmdl = new moviemdl(id);
    async.waterfall([
        function(cb){
            Movmdl.getMovieDetails(function(e,r){
                if(e){
                    cb(true);
                }else{
                    cb(null,r);
                }
            })
        },
        function(mov_det,cb){
            var rev = [];
            Movmdl.getReviews(function(e,r){
                console.log("err ",e)
                console.log("reev ",r)
                if(!e && r){
                    rev = r
                }
                cb(null,{mov_det:mov_det,"reviews":rev});
            })
        }
    ],function(e,r){
        if(e){
            return reply(strings.ERRORS.MOVIE_DET_FAILED);
        }
        var succ = _.clone(strings.SUCCESS.SUCCESS);
        succ.mov_det= r.mov_det;
        succ.reviews= r.reviews;
        reply(succ);

    })

}


module.exports = movie;