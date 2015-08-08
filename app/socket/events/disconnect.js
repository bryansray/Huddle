var _channels = {};

module.exports = function(io, socket) {
	// DISCONNECT EVENT
	socket.on('disconnect', function(data) {
		var currentUserId = socket.handshake.query.userId;

		for (var roomId in _channels)
		{
			var users = _channels[roomId].userIds;
			_channels[roomId].userIds = _.remove(users, function(x) { return x === currentUserId });
		}

		io.sockets.emit('quit', { userId: currentUserId });
	});
}