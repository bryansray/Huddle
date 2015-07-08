module.exports = function(server) {
	var io = require('socket.io')(server);
	var channels = {};

	io.on('connection', function(socket) {
		console.log("connected.");

		// JOIN EVENT
		socket.on('join', function(data) {
			console.log("joined: ", data);

			var channel = channels[data.channelId];

			// TODO : This needs to be much more robust (consider redis)
			if (!channel) {
				channel = { users: [] };
				channels[data.channelId] = channel;
			}

			if (!channel.users.includes(data.userId)) {
				channel.users.push(data.userId);
				io.emit("joined", { user: data.userId });
			}

			console.log(channels);
		});
	});
};