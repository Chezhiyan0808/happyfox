/**
 * Created by zoram on 12/11/16.
 */
var crypto = require('crypto');
var shortId = require('shortid');
shortId.seed(2014);

exports.getRandToken = function() {
    return crypto.randomBytes(12).toString('hex');
}

exports.bigToken = function() {
    return crypto.randomBytes(18).toString('hex');
}

exports.shortId = function() {
    return shortId.generate();
}