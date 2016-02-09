var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrganizationSchema = new Schema(
{
	name: String,
	active: Boolean
});



// the schema is useless so far
// we need to create a model using it

var Organization = mongoose.model('Organizations',OrganizationSchema);

// make this available to our users in our Node applications

module.exports = Organization;

