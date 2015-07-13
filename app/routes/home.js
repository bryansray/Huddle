var home = require('../controllers/home'),
		rooms = require('../controllers/rooms'),
		messages = require('../controllers/messages'),
		sessions = require('../controllers/sessions');

module.exports = function(app, passport) {
	var isAuthenticated = function(req, res, next) {
		console.log("Checking authentication ...");
		if (!req.isAuthenticated()) {
			req.session.message = "You must be logged in to join the Huddle.";
			res.redirect('/login');
		}
		next();
	};

	app.route('/')
		.get(isAuthenticated, home.index);

	app.route('/login')
		.get(sessions.new)
		.post(passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

	app.route('/logout').get(sessions.delete);

	// Rooms
	app.route('/rooms')
		.get(rooms.index)
		.post(rooms.create);

	app.route('/rooms/:id').get(rooms.show);

	// Messages
	app.route('/rooms/:roomId/messages').get(rooms.index);
};