var express = require('express');
var app = module.exports = express();

app.use('/registers',require('./registers'));
app.use('/log',require('./log'));
app.use('/papertrail',require('./papertrail'));