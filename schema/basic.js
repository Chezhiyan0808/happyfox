/**
 * Created by zoram on 12/11/16.
 */
var joi = require('joi');

var basics = {};


basics.status = joi.object({
    statusCode: joi.number().integer().required(),
    message: joi.string().required()
});

module.exports = basics;