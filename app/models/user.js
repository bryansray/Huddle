var mongoose = require('mongoose');

var schema = mongoose.Schema({
	firstName: String,
	lastName: String
});

var User = mongoose.model('user', schema);

module.exports = {
	Schema: schema,
	Model: User,
};