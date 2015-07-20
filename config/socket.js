var Room = require('../app/models/room');



module.exports = function(server) {
	var io = require('socket.io')(server),
			markdown = require('markdown').markdown;

	io.on('connection', function(socket) {
		// JOIN EVENT
		socket.on('join', function(data) {
			var userIds = io.sockets.sockets.map(function(x) { return x.handshake.query.userId });
			var currentUserId = socket.handshake.query.userId;

			// TODO : This user already exists ... do we need to do anything else?

			var user = { id: 1, firstName: "Bryan", lastName: "Ray", displayName: "Bryan Ray", status: "active" };
			var room = { id: data.roomId };

			var message = `*** ${user.firstName} ${user.lastName} joined the Room.`;

			var joinedEventData = { 
				from_user: { displayName: "Huddle" },
				user: user, 
				room: room, 
				message: message,
				html: markdown.toHTML(message),
				timestamp: new Date()
			};

			socket.join(data.roomId);
			socket.to(data.roomId).emit('joined', joinedEventData);
		});

		// MESSAGE (RECEIVED) EVENT
		socket.on('message', function(data) {
			var regexHashtags = /(^|\s)(#[a-z\d-]+)/ig;

			var message = data.message,
					userId = data.userId,
					roomId = data.roomId,
					timestamp = new Date();

			var tags = message.match(regexHashtags),
					html = markdown.toHTML(message, 'Maruku').replace(regexHashtags, "$1<span class=\"hash-tag\">$2</span>");

			if (tags) tags = tags.map(function(tag) { return tag.replace(/ /g, '').replace( /#/, ''); })

			var user = { firstName: "Bryan", lastName: "Ray", displayName: "Bryan Ray" };
			var message = { user: user, message: message, html: html, tags: tags, timestamp: timestamp };

			Room.Model.findById(roomId, function(err, room) {
				room.messages.push(message)
				room.save();
			});

			io.sockets.in(roomId).emit('message', message);
		});
	});
};