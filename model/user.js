var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
var _arrayVenue;

var userSchema = new Schema({
	
		id:{type: Number},
		email:String,
		first_name:String,
		last_name:String,
		location:String,
		location_latitude:String,
		location_longitude:String,
		created_at:Date,
		gender:String,
		city:String,
		country:String,
		country_code:String,
		picture:String,
		logins_count:{type: Number},
		provider:String,
		birthday:Date,
		phone:String,
		client_mac:String,
		last_time_seen:Date,
		org_id_OnLive: String,
		venues_OnLive: { type : Array}
});

userSchema.methods.UpdateUser = function UpdateUser(pUser,pIdVenue)
{
	_arrayVenue = [];
	var _flag = true;
	for (var i = 0, len = this.venues_OnLive.length; i < len; i++) {
		if(this.venues_OnLive[i]["idVenue"] == pIdVenue)
		{
			console.log("repetido");
			this.venues_OnLive[i]["count"]= this.venues_OnLive[i]["count"]+1;
			_arrayVenue.push({"idVenue":this.venues_OnLive[i]["idVenue"],"count":this.venues_OnLive[i]["count"]});
			_flag = false;
		}
		else
		{
			_arrayVenue.push({"idVenue":this.venues_OnLive[i]["idVenue"],"count":this.venues_OnLive[i]["count"]});
		}
	}
	if(_flag)
	{
		console.log("nuevo");
		_arrayVenue.push({"idVenue":pIdVenue,"count":1});	
	}
	this.venues_OnLive = [];
	this.save();
	update(pUser,this);
}

var update = function(pUser,pUserData)
{
	if(pUser["birthday"] == null)
	{
		birthday = null;
	}
	else
	{
		birthday = moment(pUser["birthday"]); 
		
	}
<<<<<<< HEAD
	pUserData.email=pUser['email'];
	pUserData.first_name = pUser['first_name'];
	pUserData.last_name=pUser['last_name'];
	pUserData.location=pUser['location'];
	pUserData.location_latitude=pUser['location_latitude'];
	pUserData.location_longitude=pUser['location_longitude'];
	pUserData.created_at=moment(pUser['created_at']);
	pUserData.gender=pUser['gender'];
	pUserData.city=pUser['city'];
	pUserData.country=pUser['country'];
	pUserData.country_code=pUser['country_code'];
	pUserData.picture=pUser['picture'];
	pUserData.logins_count=pUser['logins_count'];
	pUserData.provider=getTanazaLoginProviderName(pUser['provider']);
	pUserData.birthday=birthday;
	pUserData.phone=pUser['phone'];
	pUserData.client_mac=pUser['client_mac'];
	pUserData.last_time_seen=moment(pUser['last_time_seen']);
	pUserData.venues_OnLive = _arrayVenue;
	pUserData.save();
	
=======
	this.email=pUser['email'];
	this.first_name = pUser['first_name'];
	this.last_name=pUser['last_name'];
	this.location=pUser['location'];
	this.location_latitude=pUser['location_latitude'];
	this.location_longitude=pUser['location_longitude'];
	this.created_at=moment(pUser['created_at']).subtract(6,"hours");
	this.gender=pUser['gender'];
	this.city=pUser['city'];
	this.country=pUser['country'];
	this.country_code=pUser['country_code'];
	this.picture=pUser['picture'];
	this.logins_count=pUser['logins_count'];
	this.provider=getTanazaLoginProviderName(pUser['provider']);
	this.birthday=moment(pUser['birthday']);
	this.phone=pUser['phone'];
	this.client_mac=pUser['client_mac'];
	this.last_time_seen=moment(pUser['last_time_seen']).subtract(6,"hours");
	this.save();
>>>>>>> 3b4fb25a0e063f7f24d34135e090d3b40c9214ef
}
userSchema.methods.UpdateUserCsv = function UpdateUser(pUser)
{
	var birthday;
	var gender;
	if(pUser["birthday"] === '')
	{
		birthday = null;
	}
	else
	{
		birthday = moment(pUser["birthday"]); 
		
	}
	if(pUser["gender"] === '')
	{
		gender = null;
	}
	else
	{
		var gender =pUser["gender"]; 
		
	}
	this.email=pUser['email'];
	this.first_name = pUser['first name'];
	this.last_name=pUser['last name'];
	this.location=pUser['location'];
	this.location_latitude=pUser['location_latitude'];
	this.location_longitude=pUser['location_longitude'];
	this.created_at=moment(pUser['registered_at']).subtract(6,"hours");
	this.gender=gender;
	this.city=pUser['city'];
	this.country=pUser['country'];
	this.country_code=pUser['country_code'];
	this.picture=pUser['picture'];
	this.logins_count=pUser['connections_count'];
	this.provider=getTanazaLoginProviderName(parseInt(pUser['provider']));
	this.birthday=birthday;
	this.phone=pUser['phone'];
	this.client_mac=pUser['client_mac'];
	this.last_time_seen=moment(pUser['last_login']).subtract(6,"hours");
	this.save();
}



var getTanazaLoginProviderName = function (pProviderId) {
	switch(pProviderId)
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

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('usersvs', userSchema);

// make this available to our users in our Node applications
module.exports = User;

