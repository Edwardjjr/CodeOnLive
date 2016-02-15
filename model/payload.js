var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var payloadSchema = new Schema(
{
	id_login: String,
	body: String,
	state: String
});



// the schema is useless so far
// we need to create a model using it

var Payload = mongoose.model('Payloads',payloadSchema);

// make this available to our users in our Node applications

module.exports = Payload;