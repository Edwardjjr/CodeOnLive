var express = require('express');
var app = module.exports = express();

var Venue = require('../../../model/venue');


module.exports = {


	
	registerVenue:function (Name,Org_id)
	{
		var venue = new Venue({
			name: Name,
			org_id : Org_id,
			active: true
		});

		venue.save(function(err) {
			  if (err) throw err;

			  console.log('venue saved successfully!');
			});
	},
	venueByOrg: function(Org_id,venue_id,res)
	{
		Venue.findOne({org_id:Org_id}&&{_id:venue_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	}
};

