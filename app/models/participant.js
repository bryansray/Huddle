var Bookshelf = require('../../config/bookshelf');

var Participant = Bookshelf.Model.extend({
	tableName: "participants",

	hasTimestamps: true,

	initialize: function() {
		console.log("Loading Participant.");
	},

	rooms: function() {
		return this.hasMany('User');
	}
});

module.exports = Bookshelf.model('Participant', Participant);