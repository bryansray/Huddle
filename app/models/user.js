var Bookshelf = require('../../config/bookshelf'),
		crypto = require('crypto-js');

var User = Bookshelf.Model.extend({
	tableName: 'users',

	initialize: function() {
		this.on('saving', function() { 
			var password = this.get('password');
			if (password && password.length > 6) {
				this.set('salt', crypto.lib.WordArray.random(128/8).toString());
				this.set('password', this.hashPassword(password));
			}
		}, this);
	},

	authenticate: function(password) {
		return this.get('password') === this.hashPassword(password);
	},

	hashPassword: function(password) {
		if (this.get('salt') && password) {
			return crypto.PBKDF2(password, this.get('salt'), { keySize: 512/32 }).toString();
		} else { 
			return password;
		}
	}
});

module.exports = Bookshelf.model('User', User);

// var mongoose = require('mongoose'),
// 		Schema = mongoose.Schema,
// 		crypto = require('crypto-js');

// var schema = new Schema({
// 	firstName: String,
// 	lastName: String,
// 	displayName: String,
// 	email: String,
// 	salt: String,
// 	password: String,

// 	roles: {
// 		type: [ { type: String, enum: ['User', 'Administrator'] } ],
// 		default: ['User']
// 	},

// 	resetPasswordToken: String,
// 	resetPasswordExpires: Date,

// 	updated_at: Date,
// 	created_at: { type: Date, default: Date.now }
// });

// schema.pre('save', function(next) {
// 	if (this.password && this.password.length > 6) {
// 		this.salt = crypto.lib.WordArray.random(128/8);
// 		this.password = this.hashPassword(this.password);
// 	}

// 	next();
// });

// schema.methods.authenticate = function(password) {
// 	return this.password === this.hashPassword(password);
// };

// schema.methods.hashPassword = function(password) {
// 	if (this.salt && password) {
// 		return crypto.PBKDF2(password, this.salt, { keySize: 512/32 }).toString();
// 	} else { 
// 		return password;
// 	}
// };

// var User = mongoose.model('user', schema);

// module.exports = {
// 	Schema: schema,
// 	Model: User,
// };