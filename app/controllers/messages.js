var mongoose = require('mongoose'),
		Room = mongoose.model('room');

exports.index = function(req, res) {
	var roomId = req.params.roomId;

	Room.findOne({ _id: roomId }, function(err, room) {
		return res.json(room);
	});
};