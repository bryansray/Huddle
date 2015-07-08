var Room = require('../models/room');

exports.index = function(req, res) {
	Room.find(function(err, rooms) {
		return res.json(rooms);
	});
};

exports.show = function(req, res) {
	var roomId = req.params.id;

	Room.findOne({ _id: roomId }, function(err, room) {
		return res.json(room);
	});
};