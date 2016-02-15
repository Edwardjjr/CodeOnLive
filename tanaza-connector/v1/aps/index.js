var express = require('express');
var app = module.exports = express();

var Ap = require('../../../model/ap');


module.exports = {
	ApsByVenue: function(Org_id,Venue_id,res)
	{
		Ap.find({org_id:Org_id}&&{venue_id:Venue_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	},
	ApsByOrg: function(Org_id,res)
	{
		Ap.find({org_id:Org_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	}
};