var Room = require('../models/room');
var Message = require('../models/message');

exports.index = function(req, res) {
	var roomId = req.params.roomId;

	Message.where({ room_id: roomId }).fetchAll({ withRelated: ['user', 'tags'] }).then(function(messages) {
		return res.json(messages.toJSON());
	});
};

exports.create = function(req, res) {
	Room.Model.findOne({ id: req.params.roomId }, function(err, room) {
		// Found the room ... push the message in.
	});
};