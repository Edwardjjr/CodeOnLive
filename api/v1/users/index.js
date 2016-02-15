var express = require('express');
var app = module.exports = express();

var User = require('../../../model/user');


module.exports = {
	usersByOrg: function(Org_id,res)
	{
		User.find({org_id:Org_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	},
	usersByVenue: function(Org_id,Venue_id,res)
	{
		User.find({org_id:Org_id}&&{venue_id:Venue_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	},
	usersByAp: function(Org_id,Venue_id,Ap_id,res)
	{
		User.find({org_id:Org_id}&&{venue_id:Venue_id}&&{ap_id:Ap_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	}
};