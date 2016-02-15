var express = require('express');
var app = module.exports = express();


var Login = require('../../model/loginV1_1');
var Ap = require('../../model/ap');
var User = require('../../model/userV1_1');
var log = require('./log/index.js');
var OnLiveLogger = require('./onLiveLogger/index.js');

app.get('/', function(req, res) {
	req.on('data', function (chunk) {		
	});
	req.on('end', function () {
		res.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		res.end();
	});
});

app.post('/', function(req, res) {
	req.on('data', function (chunk) {
		var jsonBody = JSON.parse(chunk);
		console.log("V1_1");
		console.log(jsonBody);
		try
		{
			registerUser(jsonBody);
			registerLogin(jsonBody);
		}
		catch (ex) {
		    console.log(ex);
		}	
	});
	req.on('end', function () {
		res.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		res.end();
	});
});


var registerUser = function(jsonBody)
{
	var counterUser;
	var org_id="";
	var venue_id="";
	var ap_id = "";
	for (counterUser in jsonBody) {

		User.findOne({id:jsonBody[counterUser]["client"]["id"]}).exec(function(err,results){
			if(err)
			{
				console.log(err);
			}
			else
			{
				if (results == null)
				{
					Ap.findOne({ap_id:jsonBody[counterUser]["ap_id"]}).exec(function(err, results) {
						if(results != null)
						{
				        	org_id =results.org_id;
				        	venue_id = results.venue_id;
				        	ap_id = results._id;
				        }

						var user = new User({
							id:jsonBody[counterUser]["client"]["id"],
							first_name:jsonBody[counterUser]["client"]["first_name"],
							last_name:jsonBody[counterUser]["client"]["last_name"],
							picture:jsonBody[counterUser]["client"]["picture"],
							gender:jsonBody[counterUser]["client"]["gender"],
							email:jsonBody[counterUser]["client"]["email"],
							phone:jsonBody[counterUser]["client"]["phone"],
							birthday:jsonBody[counterUser]["client"]["birthday"],
							logins_count:jsonBody[counterUser]["client"]["logins_count"]
						});
						user.save(function(err) {
						  if (err) throw err;
						  OnLiveLogger.SendMessage('Create user '+jsonBody[counterUser]["client"]["id"]);
						  log.CreateUser(user,"success");
						  console.log('user saved successfully!');
						});
					});
				}
			}
		});	
		
			
		}
}

var registerLogin = function(jsonBody)
{
	var counterLogin;
	var org_id="";
	var venue_id="";
	var ap_id = "";
	for (counterLogin in jsonBody) {
		Ap.findOne({ap_id:jsonBody[counterLogin]["ap_id"]}).exec(function(err, results) {
			if(err)
			{
				console.log(err);
			}
			else
			{
				if(results != null)
				{
		        	org_id =results.org_id;
		        	venue_id = results.venue_id;
		        	ap_id = results._id;
		        }
			
				var login = new Login({
				id:jsonBody[counterLogin]["id"],
				ap_id:jsonBody[counterLogin]["ap_id"],
				ssid: jsonBody[counterLogin]["ssid"],
				ip_address:jsonBody[counterLogin]["ip_address"],
				mac_address:jsonBody[counterLogin]["mac_address"],
				auth_method: jsonBody[counterLogin]["auth_method"],
				roaming: jsonBody[counterLogin]["roaming"],
				created_at:jsonBody[counterLogin]["created_at"],
				org_id_OnLive:org_id,
				venue_id_OnLive:venue_id,
				ap_id_OnLive:ap_id,
					client:
					{
						id:jsonBody[counterLogin]["client"]["id"],
						first_name:jsonBody[counterLogin]["client"]["first_name"],
						last_name:jsonBody[counterLogin]["client"]["last_name"],
						picture:jsonBody[counterLogin]["client"]["picture"],
						gender:jsonBody[counterLogin]["client"]["gender"],
						email:jsonBody[counterLogin]["client"]["email"],
						phone:jsonBody[counterLogin]["client"]["phone"],
						birthday:jsonBody[counterLogin]["client"]["birthday"],
						logins_count:jsonBody[counterLogin]["client"]["logins_count"]
					}
				});
				login.save(function(err) {
				  if (err) throw err;
				  log.UpdateLogin(jsonBody[counterLogin]["id"],"success");
				  OnLiveLogger.SendMessage('Process Login '+jsonBody[counterLogin]["id"]);
				  console.log('Login saved successfully!');
				});
			}
		});
	}
}