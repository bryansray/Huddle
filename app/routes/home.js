var home = require('../controllers/home'),
		channels = require('../controllers/channels'),
		messages = require('../controllers/messages');

module.exports = function(app) {
	app.route('/').get(home.index);

	// Channels
	app.route('/channels').get(channels.index);
	app.route('/channels/:id').get(channels.show);

	// Messages
	app.route('/channels/:channelId/messages').get(messages.index);
};