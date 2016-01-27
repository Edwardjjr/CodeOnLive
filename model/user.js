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
		created_at:String,
		gender:String,
		city:String,
		country:String,
		country_code:String,
		picture:String,
		logins_count:{type: Number},
		provider:String,
		birthday:String,
		phone:String,
		client_mac:String,
		last_time_seen:String,
		org_id:String,
		venue_id:String,
		ap_id:String
});



// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('users', userSchema);

// make this available to our users in our Node applications
module.exports = User;

