var knex = require('knex')({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'bryanray',
		password: '',
		database: 'huddle',
		charset: 'utf8'
	}
});

var Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('registry');

module.exports = Bookshelf;