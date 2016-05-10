var express = require('express');
var app = module.exports = express();

app.use('/v1',require('./v1'));