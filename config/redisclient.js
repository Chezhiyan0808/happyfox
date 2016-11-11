

var redis = require('redis');

var appConfig = require('./appConfig')();
var client = redis.createClient({port:appConfig.database.redis.port, host:appConfig.database.redis.host, auth_pass:appConfig.database.redis.auth});

client.on("connect", function(){
    console.log("redis connected "+this.connected);
}).on("error", function(e){
    console.log("redis connect error "+e);
}).on("end", function(){
    console.log("redis disconnected"+this.connected);
});

module.exports=client;
