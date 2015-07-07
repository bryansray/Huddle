var globule = require('globule'),
		chalk = require('chalk');

module.exports = function() {
	globule.find('./config/env/' + process.env.NODE_ENV);
};