var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
	
		id:Number,
		first_name:String,
		last_name:String,
		picture:String,
		gender:String,
		email:String,
		phone:String,
		birthday:Date,
		logins_count:Number,
		location:
        {
	        name:String,
	        city:String,
	        country: String,
	        country_code: String,
	        latitude: Number,
	        longitude: Number
        }, 
		org_id_OnLive: String
});

userSchema.methods.UpdateUser = function UpdateUser(pUser)
{
	this.first_name = pUser['first_name'];
	this.last_name=pUser['last_name'];
	this.picture=pUser['picture'];
	this.gender=pUser['gender'];
	this.email=pUser['email'];
	this.phone=pUser['phone'];
	this.birthday=pUser['birthday'];
	this.logins_count=pUser['logins_count'];
	this.location.name=pUser['location']['name'];
	this.location.city=pUser['location']['city'];
	this.location.country=pUser['location']['country'];
	this.location.latitude=pUser['location']['latitude'];
	this.location.longitude=pUser['location']['longitude'];
	this.save();
}


// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('usersV', userSchema);

// make this available to our users in our Node applications
module.exports = User;