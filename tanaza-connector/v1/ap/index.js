var express = require('express');
var app = module.exports = express();

var Ap = require('../../../model/ap');


module.exports = {
	registerAp:function (Org_id,Venue_id,Mac)
	{
		var ap = new Ap({
			org_id: Org_id,
			venue_id:Venue_id,
			ap_id:Mac,
			active:true
		});

		ap.save(function(err) {
			  if (err) throw err;

			  console.log('Ap saved successfully!');
			});
	},
	apInfo:function(ap_id,res)
	{
		Ap.findOne({_id:ap_id}).exec(function(err,results){
			res.status(200).jsonp(results);
		});
	}
};