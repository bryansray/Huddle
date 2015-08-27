var _ = require('lodash'),
		glob = require('globule');

var environment = process.env.NODE_ENV || 'development';

module.exports = _.extend(
	require('./env/all'),
	require('./env/' + environment) || {}
);