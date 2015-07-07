var Channel = require('../models/channel');

exports.index = function(req, res) {
	Channel.find(function(err, channels) {
		return res.json(channels);
	});
};

exports.show = function(req, res) {
	var channelId = req.params.id;

	Channel.findOne({ _id: channelId }, function(err, channel) {
		return res.json(channel);
	});
};