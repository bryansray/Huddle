var Bookshelf = require('../../config/bookshelf'),
		crypto = require('crypto-js');

var User = Bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true,
	hidden: ['password', 'salt', 'resetPasswordToken', 'resetPasswordExpirationDate'],

	initialize: function() {
		this.on('saving', function() { 
			var password = this.get('password');
			if (password) {
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
	},

	rooms: function() {
		return this.belongsToMany('Room').through('Participant');
	}
});

module.exports = Bookshelf.model('User', User);