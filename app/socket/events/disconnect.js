var _channels = {};

module.exports = function(io, socket) {
	// DISCONNECT EVENT
	socket.on('disconnect', function(data) {
		var currentUserId = socket.handshake.query.userId;

		var hotel = socket.hotel;

		hotel.forEach(function(value, key) {
			console.log(key);
			hotel.checkout(currentUserId, key);
		});

		io.sockets.emit('quit', { userId: currentUserId });
	});
}