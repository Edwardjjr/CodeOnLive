var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apSchema = new Schema(
{
	ap_id: String,
	org_id: String,
	venue_id:String,
	active: Boolean
});



// the schema is useless so far
// we need to create a model using it

var Ap = mongoose.model('Aps',apSchema);

// make this available to our users in our Node applications

module.exports = Ap;