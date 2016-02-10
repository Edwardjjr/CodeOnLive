var express = require('express');
var app = module.exports = express();

app.use('/registers',require('./registers'));
app.use('/binnacle',require('./binnacle'));
app.use('/papertrail',require('./papertrail'));