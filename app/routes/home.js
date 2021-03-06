var home = require('../controllers/home'),
		rooms = require('../controllers/rooms'),
		users = require('../controllers/users'),
		messages = require('../controllers/messages'),
		sessions = require('../controllers/sessions'),
		participants = require('../controllers/participants');

module.exports = function(app, passport) {
	var ensureAuthenticated = function(req, res, next) {
		if (req.isAuthenticated()) return next();

		req.session.message = "You must be logged in to join the Huddle.";
		res.redirect('/login');
	};

	app.use(function(req, res, next) {
		if (req.user)
			res.locals.current_user = req.user.toJSON();
		
		next();
	});

	app.route('/')
		.get(ensureAuthenticated, home.index);

	app.route('/login')
		.get(sessions.new)
		.post(passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

	app.route('/logout').get(sessions.delete);
	app.route('/session').get(sessions.show);

	// Users
	app.route('/users')
		.get(users.index)
		.post(users.create);
	app.route('/users/new').get(users.new);

	app.route('/rooms/:roomId/users').get(users.show);

	// Rooms
	app.route('/rooms')
		.get(rooms.index)
		.post(rooms.create);

	app.route('/rooms/:id').get(rooms.show);
	app.route('/chat/users/:id').get(rooms.show);
	
	app.route('/chat/lobby').get(home.index);

	// Participants
	app.route('/user/participating')
		.get(participants.index)
		.post(participants.create);

	// Messages
	app.route('/rooms/:roomId/messages').get(messages.index);
	app.route('/chat/users/:userId/messages').get(messages.index)
};