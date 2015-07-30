var Bookshelf = require('../../config/bookshelf');

var Message = Bookshelf.Model.extend({
	tableName: 'messages',

	hasTimestamps: true,

	initialize: function() { 
	},

	user: function() {
		return this.belongsTo('User');
	},

	room: function() {
		return this.belongTo('Room');
	},

	tags: function() {
		return this.belongsToMany('Tag'); //.through('MessageTag');
	}
});

module.exports = Bookshelf.model('Message', Message);