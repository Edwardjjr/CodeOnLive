var express = require('express');
var app = module.exports = express();

app.use('/push-notification',require('./push-notification'));
app.use('/log',require('./log'));
app.use('/papertrail',require('./papertrail'));