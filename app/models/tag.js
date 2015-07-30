var Bookshelf = require('../../config/bookshelf');

var Tag = Bookshelf.Model.extend({
	tableName: 'tags',

	hasTimestamps: true,

	messages: function() {
		return this.belongsToMany('Message'); //.through('MessageTag');
	}
});

module.exports = Bookshelf.model('Tag', Tag);