var express = require('express');
var app = module.exports = express();

var Login = require('../../../model/login');
var Ap = require('../../../model/ap');
var User = require('../../../model/user');

app.post('/', function(req, res) {
	req.on('data', function (chunk) {
		var jsonBody = JSON.parse(chunk);
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
							email:jsonBody[counterUser]["client"]["email"],
							first_name:jsonBody[counterUser]["client"]["first_name"],
							last_name:jsonBody[counterUser]["client"]["last_name"],
							location:jsonBody[counterUser]["client"]["location"],
							location_latitude:jsonBody[counterUser]["client"]["location_latitude"],
							location_longitude:jsonBody[counterUser]["client"]["location_longitude"],
							created_at:jsonBody[counterUser]["client"]["created_at"],
							gender:jsonBody[counterUser]["client"]["gender"],
							city:jsonBody[counterUser]["client"]["city"],
							country:jsonBody[counterUser]["client"]["country"],
							country_code:jsonBody[counterUser]["client"]["country_code"],
							picture:jsonBody[counterUser]["client"]["picture"],
							logins_count:jsonBody[counterUser]["client"]["logins_count"],
							provider:getTanazaLoginProviderName(jsonBody[counterUser]["client"]["provider"]),
							birthday:jsonBody[counterUser]["client"]["birthday"],
							phone:jsonBody[counterUser]["client"]["phone"],
							client_mac:jsonBody[counterUser]["client"]["client_mac"],
							last_time_seen:jsonBody[counterUser]["client"]["last_time_seen"],
							org_id:org_id,
							venue_id: venue_id,
							ap_id: ap_id
						});
						user.save(function(err) {
						  if (err) throw err;

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
				ip_address:jsonBody[counterLogin]["ip_address"],
				client_mac:jsonBody[counterLogin]["client_mac"],
				created_at:jsonBody[counterLogin]["created_at"],
				user_agent:jsonBody[counterLogin]["user_agent"],
				provider:getTanazaLoginProviderName(jsonBody[counterLogin]["provider"]),
				registration: jsonBody[counterLogin]["registration"],
				splash_page_label:jsonBody[counterLogin]["splash_page_label"],
				splash_page_url:jsonBody[counterLogin]["splash_page_url"],
				org_id_OnLive:org_id,
				venue_id_OnLive:venue_id,
				ap_id_OnLive:ap_id,
				client:
					{
					id:jsonBody[counterLogin]["client"]["id"],
					email:jsonBody[counterLogin]["client"]["email"],
					first_name:jsonBody[counterLogin]["client"]["first_name"],
					last_name:jsonBody[counterLogin]["client"]["last_name"],
					location:jsonBody[counterLogin]["client"]["location"],
					location_latitude:jsonBody[counterLogin]["client"]["location_latitude"],
					location_longitude:jsonBody[counterLogin]["client"]["location_longitude"],
					created_at:jsonBody[counterLogin]["client"]["created_at"],
					gender:jsonBody[counterLogin]["client"]["gender"],
					city:jsonBody[counterLogin]["client"]["city"],
					country:jsonBody[counterLogin]["client"]["country"],
					country_code:jsonBody[counterLogin]["client"]["country_code"],
					picture:jsonBody[counterLogin]["client"]["picture"],
					logins_count:jsonBody[counterLogin]["client"]["logins_count"],
					provider:getTanazaLoginProviderName(jsonBody[counterLogin]["client"]["provider"]),
					birthday:jsonBody[counterLogin]["client"]["birthday"],
					phone:jsonBody[counterLogin]["client"]["phone"],
					client_mac:jsonBody[counterLogin]["client"]["client_mac"],
					last_time_seen:jsonBody[counterLogin]["client"]["last_time_seen"]
					}
				});
				login.save(function(err) {
				  if (err) throw err;

				  console.log('Login saved successfully!');
				});
			}
		});
	}
}


var getTanazaLoginProviderName = function (providerId) {
	switch(providerId)
	{
		case 1:
			return "google";
		case 2:
			return "linkedin";
		case 3:
			return "facebook";
		case 4:
			return "twitter";
		case 5:
			return "instagram";
		case 6:
			return "live";
		case 7:
			return "tanaza-click";
		case 8:
			return "tanaza-email";
		case 9:
			return "tanaza-phone";
		case 10:
			return "tanaza-emailphone";
		case 11:
			return "tanaza-code";
		default:
			return "unknown";
	}
}


