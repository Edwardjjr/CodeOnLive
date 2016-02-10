var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nconf = require ('nconf');
nconf.argv()
.env().file({ file: './config.json' });
var mongoose = require('mongoose');
var Binnacle = require('./api/v1_1/binnacle/index.js');
var Papertrail = require('./api/v1_1/papertrail/index.js');
app.use(bodyParser.urlencoded());

app.get('/', function(req, res) {
	req.on('data', function (chunk) {		
	});
	req.on('end', function () {
		res.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		res.end();
	});
});

/*app.use('/api/v1_1',function(req,res,next){
	req.on('data', function (chunk) {
		var jsonBody = JSON.parse(chunk);
		Binnacle.RegisterLogin(jsonBody);
	});
	next();

});*/

var url = nconf.get('database:localUrl');
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}

// Connect to mongodb
var connect = function () {
    mongoose.connect(url);
};
connect();

app.use('/api', require('./api'));





var ipaddress = process.env.OPENSHIFT_NODEJS_IP || nconf.get('database:host');
var port = process.env.OPENSHIFT_NODEJS_PORT || nconf.get('database:port');
app.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port '+port +'host'+ ipaddress);
});



