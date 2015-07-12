module.exports = function(server) {
	var io = require('socket.io')(server);
	var channels = {};

	io.on('connection', function(socket) {
		console.log("connected.");

		// JOIN EVENT
		socket.on('join', function(data) {
			var user = { id: 1, firstName: "Bryan", lastName: "Ray", displayName: "Bryan Ray", status: "active" };
			var room = { id: data.roomId };

			var joinedEventData = { 
				user: user, 
				room: room, 
				text: 'Someone joined the Room.',
				timestamp: new Date()
			};
			socket.join(data.roomId);
			socket.to(data.roomId).emit('joined', joinedEventData);
		});
	});
};