/**
 * Created by zoram on 13/11/16.
 */
var joi = require('joi');
var movie = {};
var basic = require ('./basic')
movie.create  = joi.object({
    name: joi.string().required(),
    year: joi.string().required(),
    votes:joi.number().required(),
    genre:joi.string().required()
});
movie.movie_response  = joi.object({
    name: joi.string().required(),
    year: joi.string().required(),
    votes:joi.number().required(),
    genre:joi.string().required(),
    review:joi.array()

});
movie.add_review = joi.object({
    "msg":joi.string().required(),
    "mvid":joi.string().required()
})
movie.vote = joi.object({
    "type":joi.string().valid("up", "down").required(),
    "mvid":joi.string().required()
})

module.exports = movie;