var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nconf = require ('nconf');
nconf.argv()
.env().file({ file: './config.json' });

app.use(bodyParser.urlencoded());

var mongoose = require('mongoose');

var Login = require('./model/login');



var url = nconf.get('database:localUrl');
// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    /*url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;*/
    url = process.env.OPENSHIFT_MONGODB_DB_URL + nconf.get('database:OPENSHIFT_APP_NAME_SCALABLE');
}

console.log(url);
// Connect to mongodb
var connect = function () {
    mongoose.connect(url);
};
connect();

app.use('/api', require('./api'));

app.get('/logins', function(req, res) {
    
    Login.find().exec(function(err, results) {
            res.json(results);
    });



});




var ipaddress = process.env.OPENSHIFT_NODEJS_IP || nconf.get('database:host');
var port = process.env.OPENSHIFT_NODEJS_PORT || nconf.get('database:port');
app.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});
