var express = require('express');
var app = module.exports = express();

var Venue = require('../../../model/venue');


module.exports = {
	venuesByOrg: function(Org_id,res)
	{
		Venue.find({org_id:Org_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	}
};