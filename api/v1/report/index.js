var express = require('express');
var app = module.exports = express();

app.use('/users-by-gender-and-age',require('./users-by-gender-and-age'));
app.use('/new-users-vrs-Known-users',require('./new-users-vrs-Known-users'));
app.use('/user-by-four-week',require('./user-by-four-week'));
app.use('/user-by-hours',require('./user-by-hours'));

