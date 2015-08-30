var Room = require('models/room');
let Chat = require('components/chat');

exports.show = function(context, next) {
	Room.findById(context.params.id)
		.then(room => {
			context.pushState({ room: room, title: context.title }, context.title, context.path);
			next(null, Chat, { room: room });
		});
};