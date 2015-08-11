var config = require('./config'),
		knex = require('knex')(config.db);

var Bookshelf = require('bookshelf')(knex);

Bookshelf.plugin('registry');
Bookshelf.plugin('visibility');

module.exports = Bookshelf;