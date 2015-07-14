var User = require('../models/user');

exports.new = function(req, res) {
	res.render('users/new');
};

exports.create = function(req, res) {
	User.Model.create(req.body, function(err, user) {
		if (err) res.render('users/new');
		res.redirect('/login');
	});
};