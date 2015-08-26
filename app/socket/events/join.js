var User = require('../../models/user');
var Participants = require('../../models/participants');

module.exports = function(io, socket) {
		socket.on('join', function(data) {
			var currentUserId = socket.handshake.query.userId,
					roomId = data.roomId;

			var hotel = socket.hotel;

			if (!hotel.has(roomId))
				hotel.set(roomId, { participants: new Participants() });

			User.where({ id: currentUserId })
				.fetch()
				.then(function(user) {
					var participant = user.toJSON()
					hotel.checkin(currentUserId, roomId);

					

					return user;
				})
				.then(function(user) {
					var joinedEventData = { users: [] };
					
					var userIds = hotel.get(roomId).participants.toArray();

					User
						.query(function(qb) {
							qb.whereIn('id', userIds);
						}).fetchAll()
						.then(function(results) {
							joinedEventData.users = results.toJSON();
						}).then(function(results) {
							joinedEventData.user = user.toJSON();
							joinedEventData.timestamp = new Date();
						}).done(function() {
							socket.join(roomId);
							io.sockets.in(roomId).emit('joined', joinedEventData);
						});

				})
				.catch(function(err) {
					console.log("Error finding user: ", err);
				});
		});
}