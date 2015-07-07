exports.index = function(req, res) {
	var channels = [
		{ channelId: 1, name: "General Discussion" },
		{ channelId: 2, name: "Team Room 1" },
		{ channelId: 3, name: "Team Room 2" }
	];
	
	return res.json(channels);
};

exports.show = function(req, res) {
	var channelId = req.params.id;

	var channel = {
		channelId: channelId, name: "General Discussion"
	};

	return res.json(channel);
};