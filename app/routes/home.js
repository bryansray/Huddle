var home = require('../controllers/home'),
		rooms = require('../controllers/rooms'),
		messages = require('../controllers/messages');

module.exports = function(app) {
	app.route('/').get(home.index);

	// Rooms
	app.route('/rooms')
		.get(rooms.index)
		.post(rooms.create);
	app.route('/rooms/:id').get(rooms.show);

	// Messages
	app.route('/rooms/:roomId/messages').get(rooms.index);
};