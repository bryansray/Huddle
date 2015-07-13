var Room = require('../app/models/room');

module.exports = function(server) {
	var io = require('socket.io')(server),
			markdown = require('markdown').markdown;

	io.on('connection', function(socket) {
		// JOIN EVENT
		socket.on('join', function(data) {
			var user = { id: 1, firstName: "Bryan", lastName: "Ray", displayName: "Bryan Ray", status: "active" };
			var room = { id: data.roomId };

			var joinedEventData = { 
				from_user: { displayName: "Huddle" },
				user: user, 
				room: room, 
				message: `*** ${user.firstName} ${user.lastName} joined the Room.`,
				html: `*** ${user.firstName} ${user.lastName} joined the Room.`,
				timestamp: new Date()
			};
			socket.join(data.roomId);
			socket.to(data.roomId).emit('joined', joinedEventData);
		});

		// MESSAGE (RECEIVED) EVENT
		socket.on('message', function(data) {
			var message = data.message,
					userId = data.userId,
					roomId = data.roomId,
					html = markdown.toHTML(message, 'Maruku'),
					timestamp = new Date();

			var user = { firstName: "Bryan", lastName: "Ray", displayName: "Bryan Ray" };
			var message = { user: user, message: message, html: html, timestamp: timestamp };

			Room.Model.findById(roomId, function(err, room) {
				room.messages.push(message)
				room.save();
			});

			io.sockets.in(roomId).emit('message', message);
		});
	});
};