/**
 * Created by zoram on 12/11/16.
 */
var joi = require('joi');
var user = {};
var basic = require ('./basic')
user.signup  = joi.object({
    email: joi.string().required(),
    name: joi.string().required(),
    password:joi.string().required()
});

user.signup_response  = basic.status.concat(joi.object({
    authtoken: joi.string(),
    urid: joi.string(),
}));
user.signin  = joi.object({
    email: joi.string().required(),
    password:joi.string().required()
});
user.setFav  = joi.object({
    genres: joi.array().required()
});

module.exports = user;