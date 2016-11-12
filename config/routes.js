/**
 * Created by zoram on 10/11/16.
 */
var joi = require('joi');
var requiredirectory = require('require-directory');
var userschema = require('../schema/user')
module.exports = function (server) {
    var controller = requiredirectory(module, '../controller');
    var routeTable = [
        {
            method: 'GET',
            path: '/test',
            config: {
                tags:['api'],
                handler: function test(req, res) {
                    res({"msg": "working"})
                }
            }
        },
        {
            method: 'POST',
            path: '/user/signup',
            config: {
                handler: controller.user.signup,
                validate: {
                    //headers: joi.object({
                    //    authorization: joi.string().required()
                    //}).unknown(),
                    payload:userschema.signup
                },
                response: {
                    schema: userschema.signup_response
                }
            }
        },
        {
            method: 'POST',
            path: '/user/signin',
            config: {
                handler: controller.user.signin,
                validate: {
                    payload:userschema.signin
                },
                response: {
                    schema: userschema.signup_response
                }
            }
        }
    ];
    return routeTable;
};
