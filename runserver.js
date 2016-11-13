/**
 * Created by zoram on 10/11/16.
 */
var Hapi = require('hapi');
var Inert = require('inert');
var Vision = require('vision');
var appConfig = require('./config/appConfig')();
var auth = require('./model/Auth');
var Auth = new auth();
var authlib = require('./lib/auth/authHeader');
var server = new Hapi.Server();
server.connection(appConfig.server);

var apiplugin = {

    register : function (server, options, next) {

        server.auth.strategy('authHeader', 'header-auth', {
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

        next();
    }

}

apiplugin.register.attributes = {
    name: 'AUTH',
    version: '1.0.0'
}


server.register([
    Inert,
    Vision,

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
var routes = require('./config/routes')(server);
server.route(routes);

