var User = require('../models/user');

exports.show = function(req, res) {
	res.json(req.user);
};

exports.new = function(req, res) {
	res.render('sessions/new')
};

exports.delete = function(req, res) {
	req.logout();
	res.redirect('/login');
};