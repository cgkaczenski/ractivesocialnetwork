var http = require('http');
var port = 9000;

var Assets = require('./backend/Assets');
var API = require('./backend/API');
var Default = require('./backend/Default');

var Router = require('./frontend/js/lib/Router')();

Router
.add('static', Assets)
.add('api', API)
.add(Default)

var session = require('cookie-session');
var checkSession = function(req, res) {
  session({
    keys: ['nodejs-by-example']
  })(req, res, function() {
    processes(req, res);
  });
}

var processes = function(req, res) {
  Router.check(req.url, [req, res]);
}

var env = process.env.NODE_ENV || 'development';
var port = (env === 'production') ? process.env.PORT : 9000;

var app = http.createServer(checkSession).listen(port);
console.log("Listening on Port: " + port);

