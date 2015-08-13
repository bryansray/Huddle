var	globule = require('globule'),
		path = require('path');

var Hotel = require('../app/models/hotel');

module.exports = function(server) {
	var io = require('socket.io')(server),
			markdown = require('markdown').markdown;

	var hotel = new Hotel();

	io.use(function(socket, next) {
		var handshakeData = socket.request;
		next();
	});

	io.on('connection', function(socket) {
		socket.hotel = hotel;

		// Load up socket events ...
		globule.find('./app/socket/events/*.js').forEach(function(event) {
			require(path.resolve(event))(io, socket);
		});

	});
};