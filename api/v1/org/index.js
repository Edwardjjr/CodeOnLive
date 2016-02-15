var express = require('express');
var app = module.exports = express();

var Organization = require('../../../model/organization');
var Login = require('../../../model/login');
var venue = require('../venue/index.js');
var venues = require('../venues/index.js');
var logins = require('../logins/index.js');
var ap = require('../ap/index.js');
var aps = require('../aps/index.js');
var users = require('../users/index.js')
var user = require('../user/index.js')



/*-----------------------------------------------------------
-                                                          	-
-                   Metodos post                            -
-                                                           -
-------------------------------------------------------------*/


app.post('/', function(req, res) {
	req.on('data', function (chunk) {
		var jsonbody = JSON.parse(chunk);
		registerOrganization(jsonbody["NameOrganization"]);
	});
	req.on('end', function () {
		res.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		res.end();
	});
});

app.post('/:org_id/venue', function(req, res) {
	req.on('data', function (chunk) {
		var jsonbody = JSON.parse(chunk);
		venue.registerVenue(jsonbody["NameVenue"],req.params.org_id);
	});
	req.on('end', function () {
		res.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		res.end();
	});
});

app.post('/:org_id/venue/:venue_id/ap', function(req, res) {
	
	req.on('data', function (chunk) {
		var jsonbody = JSON.parse(chunk);
		ap.registerAp(req.params.org_id,req.params.venue_id,jsonbody["Mac"]);
	});
	req.on('end', function () {
		res.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
		res.end();
	});
});


/*-----------------------------------------------------------
-                                                          	-
-                   Metodos get                            -
-                                                           -
-------------------------------------------------------------*/

app.get('/:org_id', function(req, res) {
	Organization.findOne({_id:req.params.org_id}).exec(function(err, results) {
        res.status(200).jsonp(results);
	});
});

app.get('/:org_id/logins', function(req, res) {
	logins.findLoginsByOrg(req.params.org_id,res);
});
app.get('/:org_id/venue/:venue_id/logins', function(req, res) {
	logins.findLoginsByVenue(req.params.venue_id,res);
});
app.get('/:org_id/venue/:venue_id/ap/:ap_id/logins', function(req, res) {
	logins.findLoginsByAp(req.params.org_id, req.params.venue_id,req.params.ap_id,res);
});

app.get('/:org_id/users', function(req, res) {
	users.usersByOrg(req.params.org_id,res);
});

app.get('/:org_id/user/:user_id', function(req, res) {
	user.userByOrg(req.params.org_id,req.params.user_id,res);
});
app.get('/:org_id/venues', function(req, res) {
	venues.venuesByOrg(req.params.org_id,res);
});

app.get('/:org_id/venue/:venue_id', function(req, res) {
	venue.venueByOrg(req.params.org_id,req.params.venue_id,res);
});

app.get('/:org_id/venue/:venue_id/aps', function(req, res) {
	aps.ApsByVenue(req.params.org_id,req.params.venue_id,res);
});
app.get('/:org_id/venue/:venue_id/ap', function(req, res) {
	ap.apInfo(req.query.ap_id,res);
});

app.get('/:org_id/aps', function(req, res) {
	aps.ApsByOrg(req.params.org_id,res);
});






app.delete('/', function(req, res) {
	Organization.update({"_id":req.query.org_id},{ $set: { active: false }},{ multi: true },function  (err, numAffected) {
	 	req.on('data', function (chunk) {
			});
			req.on('end', function () {
				res.writeHead(200, "OK", {'Content-Type': 'text/hmtl'});
				res.end();
			});
	});
});


function registerOrganization(Name)
{
	var organization = new Organization({
		name: Name,
		active: true
	});

	organization.save(function(err) {
		  if (err) throw err;

		  console.log('organization saved successfully!');
		});
}