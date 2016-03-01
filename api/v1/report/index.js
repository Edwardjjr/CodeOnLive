var express = require('express');
var app = module.exports = express();

app.use('/users-by-gender-and-age',require('./users-by-gender-and-age'));