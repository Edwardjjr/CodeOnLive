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
		logins_count:Number
});



// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('usersV', userSchema);

// make this available to our users in our Node applications
module.exports = User;

