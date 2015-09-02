var User = require('../models/user'),
		Hotel = require('../models/hotel');

// GET /rooms/:roomId/users
// TODO : Should there be a way to get all the data for a specific room via the API?
exports.show = function(req, res) {
}

exports.index = function(req, res) {
	User.fetchAll().then(function(users) {
		res.json(users);
	})
}

exports.new = function(req, res) {
	res.render('users/new');
};

exports.create = function(req, res) {
	User.forge(req.body).save().then(function(user) {
		if (user === null) res.render('users/new');
		res.redirect('/login');
	});
};