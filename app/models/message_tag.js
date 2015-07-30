var Bookshelf = require('../../config/bookshelf');

var MessageTag = Bookshelf.Model.extend({
	tableName: 'message_tags',

	hasTimestamps: true,

	tags: function() {
		this.hasMany('Tag');
	}
});

module.exports = Bookshelf.model('MessageTag', MessageTag);