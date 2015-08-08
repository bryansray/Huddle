var Participant = require('../../models/participant');

module.exports = function(io, socket) {
	// PART EVENT
	socket.on('part', function(data) {
		var currentUserId = socket.handshake.query.userId,
				roomId = data.id;

		// _channels[roomId].userIds.findIndex(function(element, index, array) {
		// 	console.log(element, index, array);
		// });

		Participant.where( { user_id: currentUserId, room_id: roomId }).destroy();

		io.sockets.in(roomId).emit('part', { userId: currentUserId });
		socket.leave(data.id);
	});
};