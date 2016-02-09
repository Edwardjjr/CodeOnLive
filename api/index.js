var express = require('express');
var app = module.exports = express();

app.use('/v1',require('./v1'));
app.use('/v1_1',require('./v1_1'));