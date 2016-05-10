var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var loginSchema = new Schema({
	id:{type: Number},
	ap_id:String,
	ssid: String,
	ip_address:String,
	mac_address:String,
	auth_method: String,
	roaming: Boolean,
	created_at:String,
	org_id_OnLive:String,
	venue_id_OnLive:String,
	ap_id_OnLive:String,
	client:
	{
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
        }
	}
});



// the schema is useless so far
// we need to create a model using it
var Login = mongoose.model('LoginsV', loginSchema);

// make this available to our users in our Node applications
module.exports = Login;

