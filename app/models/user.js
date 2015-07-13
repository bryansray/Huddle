var mongoose = require('mongoose');

var schema = mongoose.Schema({
	firstName: String,
	lastName: String,
	displayName: String,
	email: String,
	salt: String,
	hash: String
});

schema.methods.validatePassword = function(password) {
	return true;
};

var User = mongoose.model('user', schema);

module.exports = {
	Schema: schema,
	Model: User,
};