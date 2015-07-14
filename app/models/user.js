var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		crypto = require('crypto-js');

var schema = new Schema({
	firstName: String,
	lastName: String,
	displayName: String,
	email: String,
	salt: String,
	password: String
});

schema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = crypto.lib.WordArray.random(128/8);
		this.password = this.hashPassword(this.password);
	}

	next();
});

schema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

schema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.PBKDF2(password, this.salt, { keySize: 512/32 }).toString();
	} else { 
		return password;
	}
};

var User = mongoose.model('user', schema);

module.exports = {
	Schema: schema,
	Model: User,
};