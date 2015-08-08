var User = require('../models/user');

exports.index = function(req, res) {
	var userId = req.params.userId;

	User.where({ id: req.user.id }).fetch( { withRelated: ['rooms'] } ).then(function(user) {
		return res.json(user.related('rooms').toJSON());
	});
};