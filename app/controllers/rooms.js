var Room = require('../models/room');

exports.index = function(req, res) {
	Room.Model.find(function(err, rooms) {
		return res.json(rooms);
	});
};

exports.show = function(req, res) {
	var roomId = req.params.id;

	Room.Model.findOne({ _id: roomId }, function(err, room) {
		return res.json(room);
	});
};

exports.create = function(req, res) {
	Room.Model.create(req.body, function(err, room) {
		return res.json(room);
	});
	// var room = new Room.Model({ name: name, description: description });

	// room.save(function(err) {
	// 	if (err) { console.log(err); }

	// 	return res.json(room);
	// });
};