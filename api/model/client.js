var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = new Schema(
{
	name: String,
	email: String,
	password:String,
	permits:String,
	org_id: String,
	active: Boolean
});



// the schema is useless so far
// we need to create a model using it

var Client = mongoose.model('Clients',clientSchema);

// make this available to our users in our Node applications

module.exports = Client;