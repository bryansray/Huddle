var mongoose = require('mongoose'),
		Room = mongoose.model('room');

exports.index = function(req, res) {
	var roomId = req.params.roomId;

	Room.Model.findOne({ _id: roomId }, function(err, room) {
		return res.json(room);
	});
};

exports.create = function(req, res) {
	Room.Model.findOne({ id: req.params.roomId }, function(err, room) {
		// Found the room ... push the message in.
	});
};