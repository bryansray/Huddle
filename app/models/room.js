var Bookshelf = require('../../config/bookshelf');

var Room = Bookshelf.Model.extend({
	tableName: 'rooms',
	
	initialize: function() {
	},

	messages: function() {
		return this.hasMany('Message');
	},

	users: function() {
		return this.belongsToMany('User').through('Participant');
	}
});

module.exports = Bookshelf.model('Room', Room);