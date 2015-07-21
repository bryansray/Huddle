var Bookshelf = require('../../config/bookshelf');

var Message = Bookshelf.Model.extend({
	tableName: 'messages',

	initialize: function() { 
		console.log("Initializing Message ...");
	},

	user: function() {
		return this.belongsTo('User');
	},

	room: function() {
		return this.belongTo('Room');
	}
});

module.exports = Bookshelf.model('Message', Message);