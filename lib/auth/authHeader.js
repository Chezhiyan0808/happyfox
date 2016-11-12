/**
 * Created by zoram on 11/11/16.
 */
var Boom = require('boom');
var Hoek = require('hoek');
exports.register = function (plugin, options, next) {
    plugin.auth.scheme('header-auth', function (server, options) {

        Hoek.assert(options, 'Missing bearer auth strategy options');
        Hoek.assert(typeof options.validateFunc === 'function', 'options.validateFunc must be a valid function in bearer scheme');


        options.accessTokenName = options.accessTokenName || "authToken";
        var settings = Hoek.clone(options);

        var scheme = {
            authenticate: function (request, reply) {

                var req = request.raw.req;
                var authorizationToken = req.headers.authorization;

                if (!authorizationToken) {
                    authorizationToken = request.query[settings.accessTokenName]
                }
                if (!authorizationToken) {
                    return reply(Boom.unauthorized(null, 'Token Invalid'));
                }

                settings.validateFunc.call(request, authorizationToken, function (err, result) {
                    if (err) {
                        return reply(Boom.unauthorized('Bad token', 'Bearer'), {credentials: result});
                    }

                    if (!result
                        || typeof result !== 'object') {
                        return reply(Boom.badImplementation('Bad token string received for hmauth auth validation'), {log: {tags: 'token'}});
                    }

                    return reply.continue({credentials: result});
                });
            }
        };

        return scheme;
    });
    next();
};

exports.register.attributes = {
    name: 'authHeader',
    version: '1.0.0'
};