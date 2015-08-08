var User = require('../../models/user');

var _channels = {};

module.exports = function(io, socket) {
		socket.on('join', function(data) {
			var currentUserId = socket.handshake.query.userId;

			if (!_channels[data.roomId]) 
				_channels[data.roomId] = { userIds: [] };
			
			if (!_channels[data.roomId].userIds.includes(currentUserId))
				_channels[data.roomId].userIds.push(currentUserId);

			var userIds = _channels[data.roomId].userIds;

			console.log(_channels);

			User.where({ id: currentUserId })
				.fetch()
				.then(function(user) {
					var room = { id: data.roomId };
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
}