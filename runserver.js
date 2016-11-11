/**
 * Created by zoram on 10/11/16.
 */
var Hapi = require('hapi');
var Inert = require('inert');
var Vision = require('vision');
var appConfig = require('./config/appConfig')();
var auth = require('./model/auth');
var Auth = new auth();
var fs = require('fs');
var authlib = require('./lib/auth/authHeader');
const HapiSwagger = require('hapi-swagger');

var server = new Hapi.Server();
server.connection(appConfig.server);

var apiplugin = function (server, options, next) {

    server.auth.strategy('authheader', 'header-auth', {
        allowQueryToken: true,              // optional, true by default
        allowMultipleHeaders: true,        // optional, true by default
        accessTokenName: 'authToken',    // optional, 'access_token' by default
        validateFunc: function (authToken, callback) {
            Auth.getSessionUser(authToken, function (err, res) {
                console.log("done validation", err, res);
                if (err) {
                    return callback(true, null);
                } else {
                    return callback(null, res);
                }

            })

        }
    });

    var routes = require('./config/routes')(server);
    server.route(routes);
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views'

    });

    next();
};


server.register([
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: appConfig.swaggerOptions
    },
    {
        register: authlib
    }, apiplugin], {select: ['api']}, function (err) {

    if (err) {

        log.error(err);
        process.exit(1);
    }

    // Start the Server Command
    server.start(function () {


        console.log("Server (2.1) started");

    });
});


