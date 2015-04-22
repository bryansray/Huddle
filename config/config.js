var _ = require('lodash'),
		glob = require('globule');

module.exports = _.extend(
	require('./env/all'),
	require('./env/development') || {}
);