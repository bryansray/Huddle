module.exports = function(server) {
	var io = require('socket.io')(server);
	var channels = {};

	io.on('connection', function(socket) {
		// JOIN EVENT
		socket.on('join', function(data) {
			var user = { id: 1, firstName: "Bryan", lastName: "Ray", displayName: "Bryan Ray", status: "active" };
			var room = { id: data.roomId };

			var joinedEventData = { 
				from_user: { displayName: "Huddle" },
				user: user, 
				room: room, 
				text: `${user.firstName} ${user.lastName} joined the Room.`,
				timestamp: new Date()
			};
			socket.join(data.roomId);
			socket.to(data.roomId).emit('joined', joinedEventData);
		});

		// MESSAGE EVENT
		socket.on('message', function(data) {
			var message = data.message,
					userId = data.userId,
					roomId = data.roomId;

			var user = { firstName: "Bryan", lastName: "Ray", displayName: "Bryan Ray" },
					channel = {};

			var messageEventData = {
				user: user,
				text: message,
				timestamp: new Date()
			};

			io.sockets.in(roomId).emit('message', messageEventData);
		});
	});
};