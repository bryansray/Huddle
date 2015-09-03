var Room = require('../models/room');

exports.index = function(req, res) {
	Room.fetchAll().then(function(rooms) {
		return res.json(rooms);
	});
};

exports.show = function(req, res) {
	var roomId = req.params.id;

	new Room({ id: roomId }).fetch().then(function(room) {
		return req.xhr ? res.json(room) : res.render('home/index', { room: room, title: room.get('name') });
	});
};

exports.create = function(req, res) {
	Room.forge(req.body).save().then(function(room) {
		return res.json(room);
	}).catch(function(err) {
		return res.json(err);
	});
};