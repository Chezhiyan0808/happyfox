/**
 * Created by zoram on 10/11/16.
 */
var joi = require('joi');
var requiredirectory = require('require-directory');
var userschema = require('../schema/user')
var movieschema = require('../schema/movie')
var basicschema = require('../schema/basic')
module.exports = function (server) {
    var controller = requiredirectory(module, '../controller');
    var routeTable = [
        {
            method: 'GET',
            path: '/test',
            config: {
                tags: ['api'],
                handler: function test(req, res) {
                    res({"msg": "working"})
                }
            }
        },
    /**
     * USER ROUTES
     *
     */
        {
            method: 'POST',
            path: '/user/signup',
            config: {

                handler: controller.user.signup,
                validate: {

                    payload: userschema.signup
                },
                response: {
                    schema: userschema.signup_response
                }
            }
        },
        {
            method: 'GET',
            path: '/user/signin',
            config: {
                auth:'authHeader',
                handler: controller.user.signin,
                validate: {
                    headers: joi.object({
                        authorization: joi.string().required()
                    }).unknown()
                },
                response: {
                    schema: userschema.signup_response
                }
            }
        },
        {
            method: 'POST',
            path: '/user/genacctkn',
            config: {
                auth:'authHeader',
                handler: controller.user.signin,
                validate: {
                    headers: joi.object({
                        authorization: joi.string().required()
                    }).unknown(),
                    payload: userschema.signin

                },
                response: {
                    schema: userschema.signup_response
                }
            }
        },
        {
            method: 'POST',
            path: '/user/setfavgenres',
            config: {
                auth:'authHeader',
                handler: controller.user.setFavGenres,
                validate: {
                    payload: userschema.setFav
                },
                response: {
                    schema: basicschema.status
                }
            }
        },
        {
            method: 'GET',
            path: '/user/getrecomm',
            config: {
                auth:'authHeader',
                handler: controller.user.getRecomendations,
                validate: {
                    headers: joi.object({
                        authorization: joi.string().required()
                    }).unknown()
                }
            }
        },
    /**
     * Movie Routes
     */
        {
            method: 'POST',
            path: '/movie/addMovie',
            config: {
                auth:'authHeader',
                handler: controller.movies.addMovie,
                validate: {
                    headers: joi.object({
                        authorization: joi.string().required()
                    }).unknown(),
                    payload: movieschema.create
                }
            }
        },
        {
            method: 'POST',
            path: '/movie/addReview',
            config: {
                auth:'authHeader',
                handler: controller.movies.addReview,
                validate: {
                    headers: joi.object({
                        authorization: joi.string().required()
                    }).unknown(),
                    payload: movieschema.add_review
                }
            }
        },
        {
            method: 'POST',
            path: '/movie/addvote',
            config: {
                auth:'authHeader',
                handler: controller.movies.vote,
                validate: {
                    headers: joi.object({
                        authorization: joi.string().required()
                    }).unknown(),
                    payload: movieschema.vote
                }
            }
        },
        {
            method: 'GET',
            path: '/movie/getmoviedetails',
            config: {
                auth:'authHeader',
                handler: controller.movies.getMovieByID,
                validate: {
                    headers: joi.object({
                        authorization: joi.string().required()
                    }).unknown(),
                    query:{
                        "mvid":joi.string().required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/movie/gettrendingmovies',
            config: {
                handler: controller.movies.getTrendingMovies

            }
        }
    ];
    return routeTable;
};
