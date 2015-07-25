var User = require('../app/models/user'),
		Room = require('../app/models/room'),
		Message = require('../app/models/message');

module.exports = function(server) {
	var io = require('socket.io')(server),
			markdown = require('markdown').markdown;

	io.use(function(socket, next) {
		var handshakeData = socket.request;

		next();
	});

	io.on('connection', function(socket) {
		// JOIN EVENT
		socket.on('join', function(data) {
			var userIds = io.sockets.sockets.map(function(x) { return x.handshake.query.userId });
			var currentUserId = socket.handshake.query.userId;

			console.log('users, currentUserId: ', userIds, currentUserId);
			// TODO : This user already exists ... do we need to do anything else?

			User.where({ id: currentUserId })
				.fetch()
				.then(function(user) {
					var room = { id: data.roomId };
					// var message = "*** " + user.get('displayName') + " joined the Room.";

					var joinedEventData = { users: [] };
					
					User
						.query(function(qb) {
							qb.whereIn('id', userIds);
						}).fetchAll()
						.then(function(results) {
							joinedEventData.users = results.toJSON();
						}).then(function(results) {
							joinedEventData.from_user = { displayName: "Huddle" };
							joinedEventData.user = { firstName: user.get('firstName'), lastName: user.get('lastName'), displayName: user.get('displayName'), status: 'active', id: user.id };
							joinedEventData.room = room;
							// joinedEventData.message = message;
							// joinedEventData.html = markdown.toHTML(message);
							joinedEventData.timestamp = new Date();
						}).done(function() {
							socket.join(data.roomId);
							io.sockets.in(data.roomId).emit('joined', joinedEventData);
						});

				})
				.catch(function(err) {
					console.log("Error finding user: ", err);
				});
		});

		// MESSAGE (RECEIVED) EVENT
		socket.on('message', function(data) {
			console.log(data);

			var regexHashtags = /(^|\s)(#[a-z\d-]+)/ig;

			var message = data.message,
					userId = data.userId,
					roomId = data.roomId,
					timestamp = new Date();

			var tags = message.match(regexHashtags),
					html = markdown.toHTML(message, 'Gruber').replace(regexHashtags, "$1<span class=\"hash-tag\">$2</span>");

			if (tags) tags = tags.map(function(tag) { return tag.replace(/ /g, '').replace( /#/, ''); })

			User.where({ id: userId })
				.fetch()
				.then(function(user) {
					var message = { user_id: user.id, room_id: roomId, original: message, html: html /* , tags: tags */ };

					Message.forge(message)
						.save()
						.then(function(model) {
							model.set('user', user);
							console.log(model.toJSON());
							io.sockets.in(roomId).emit('message', model.toJSON());
						}).catch(function(err) { console.log(err); });
				});
		});
	});
};