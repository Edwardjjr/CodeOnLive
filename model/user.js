var mongoose = require('mongoose');
var Schema = mongoose.Schema;


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
		org_id_OnLive: String
});


userSchema.methods.UpdateUser = function UpdateUser(pUser)
{
	this.email=pUser['email'];
	this.first_name = pUser['first_name'];
	this.last_name=pUser['last_name'];
	this.location=pUser['location'];
	this.location_latitude=pUser['location_latitude'];
	this.location_longitude=pUser['location_longitude'];
	this.created_at=new Date(pUser['created_at']);
	this.gender=pUser['gender'];
	this.city=pUser['city'];
	this.country=pUser['country'];
	this.country_code=pUser['country_code'];
	this.picture=pUser['picture'];
	this.logins_count=pUser['logins_count'];
	this.provider=getTanazaLoginProviderName(pUser['provider']);
	this.birthday=new Date(pUser['birthday']);
	this.phone=pUser['phone'];
	this.client_mac=pUser['client_mac'];
	this.last_time_seen=new Date(pUser['last_time_seen']);
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
var User = mongoose.model('usersVs', userSchema);

// make this available to our users in our Node applications
module.exports = User;

