var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var venueSchema = new Schema(
{
	name: String,
	org_id: String,
	active: Boolean
});



// the schema is useless so far
// we need to create a model using it

var Venue = mongoose.model('Venues',venueSchema);

// make this available to our users in our Node applications

module.exports = Venue;