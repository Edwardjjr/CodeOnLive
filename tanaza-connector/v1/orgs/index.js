var express = require('express');
var app = module.exports = express();

var Organization = require('../../../model/organization');

app.get('/', function(req, res) {
	Organization.find({"active":true}).exec(function(err, results) {
        res.json(results);
	});
});