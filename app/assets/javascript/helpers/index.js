var Ractive = require('ractive'),
		moment = require('moment');

var helpers = Ractive.defaults.data;

helpers.timeAgoInWords = function(timestamp) {
	return moment(timestamp).fromNow();
};

helpers.formatTime = function(timestamp) {
	return moment(timestamp).format("hh:mm A")
};

helpers.humanizeTime = function(timestamp) {
	return moment.duration(timestamp).humanize();
};
