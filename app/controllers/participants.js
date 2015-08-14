var User = require('../models/user'),
		Participant = require('../models/participant');

exports.index = function(req, res) {
	var userId = req.params.userId;

	User.where({ id: req.user.id }).fetch( { withRelated: ['rooms'] } ).then(function(user) {
		return res.json(user.related('rooms').toJSON());
	});
};

exports.create = function(req, res) {
	console.log(req.body);

	var userId = req.user.id,
			roomId = req.body.id;

	var query = { user_id: userId, room_id: roomId };

	Participant.where(query).fetch().then(function(participant) {
		if (participant) return res.json(participant);

		Participant.forge(query).save().then(function(participant) {
			return res.json(participant);
		});
	});
}