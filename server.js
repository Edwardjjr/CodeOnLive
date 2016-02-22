var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nconf = require ('nconf');
nconf.argv()
.env().file({ file: './config.json' });
var mongoose = require('mongoose');
var CronJob = require('cron').CronJob;
var I_Cron = require('./cron/index.js');


var job = new CronJob({
  cronTime: "00 30 00 * * *",
  onTick: function() {
    I_Cron.processQueuePending();
  },
  start: false
});
job.start();


app.use(bodyParser.urlencoded());

app.get('/', function(req, res) {
	req.on('data', function (chunk) {		
	});
	req.on('end', function () {
		res.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		res.end();
	});
});




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


app.use('/tanaza-connector', require('./tanaza-connector'));




var ipaddress = process.env.OPENSHIFT_NODEJS_IP || nconf.get('host');
var port = process.env.OPENSHIFT_NODEJS_PORT || nconf.get('port');
app.listen( port, ipaddress, function() {
    console.log((new Date()) + ' Server is listening on port '+port);
});



