var express = require('express');
var app = module.exports = express();

var Login = require('../../../model/login');


module.exports = {
	findLoginsByOrg: function(Org_id,res)
	{
		Login.find({org_id_OnLive:Org_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	},
	findLoginsByVenue: function(Venue_id,res)
	{
		Login.find({venue_id_OnLive:Venue_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	},
	findLoginsByAp: function(Org_id,Venue_id,Ap_id,res)
	{
		Login.find({org_id_OnLive:Org_id}&&{venue_id_OnLive:Venue_id}&&{ap_id_OnLive:Ap_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	} 
};