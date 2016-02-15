var express = require('express');
var app = module.exports = express();

var User = require('../../../model/user');


module.exports = {
	userByOrg: function(Org_id,User_id,res)
	{
		User.findOne({org_id:Org_id}&&{_id:User_id}).exec(function (err,results){	
			res.status(200).jsonp(results);
		});
	}
};

