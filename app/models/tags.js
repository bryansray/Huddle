var Bookshelf = require('../../config/bookshelf');

var Tags = Bookshelf.Collection.extend({
	model: Bookshelf.model('Tag')
});

module.exports = Tags;