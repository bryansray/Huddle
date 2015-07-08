var mongoose = require('mongoose'),
		Channel = mongoose.model('Channel');

exports.index = function(req, res) {
	var channelId = req.params.channelId;

	Channel.findOne({ _id: channelId }, function(err, channel) {
		return res.json(channel);
	});
}