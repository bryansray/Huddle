var Room = require('../models/room');
var Message = require('../models/message');

exports.index = function(req, res) {
	var roomId = req.params.roomId,
			userId = req.params.userId;

	if (roomId)
	{
			Message.where({ room_id: roomId }).query(function(qb) {
			// qb.limit(25);
			// qb.orderBy('created_at', 'desc');
		}).fetchAll({ withRelated: ['user', 'tags'] }).then(function(messages) {
			return res.json(messages.toJSON());
		});
	} else {
		return res.json([]);
	}
};

exports.create = function(req, res) {
	Room.Model.findOne({ id: req.params.roomId }, function(err, room) {
		// Found the room ... push the message in.
	});
};