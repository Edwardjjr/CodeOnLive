var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var loginSchema = new Schema({
	id:{type: Number},
	ap_id:String,
	ip_address:String,
	client_mac:String,
	created_at:String,
	user_agent:String,
	provider:String,
	registration: Boolean,
	splash_page_label:String,
	splash_page_url:String,
	org_id_OnLive:String,
	venue_id_OnLive:String,
	ap_id_OnLive:String,
	client:
	{
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
		last_time_seen:String
	}
});

// the schema is useless so far
// we need to create a model using it
var Login = mongoose.model('Logins', loginSchema);

// make this available to our users in our Node applications
module.exports = Login;