var Bookshelf = require('../../config/bookshelf');

var Room = Bookshelf.Model.extend({
	tableName: 'rooms',
	
	initialize: function() {
		// console.log("Initializing Room ...");
	},

	messages: function() {
		return this.hasMany('Message');
	}
});

module.exports = Bookshelf.model('Room', Room);