var express = require('express');
var app = module.exports = express();

app.use('/org',require('./org'));
app.use('/orgs',require('./orgs'));
app.use('/report',require('./report'));