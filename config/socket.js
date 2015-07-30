var User = require('../app/models/user'),
		Room = require('../app/models/room'),
		Tag = require('../app/models/tag'),
		Tags = require('../app/models/tags'),
		Message = require('../app/models/message');

var Promise = require('bluebird'),
		_ = require('lodash');

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
			var regexHashtags = /(^|\s)(#[a-z\d-]+)/ig,
					regexMentions = /(^|\s)(@[a-z\d_-]+)/ig;

			var regexHashtagsReplace = "$1<span class=\"hash-tag\">$2</span>",
					regexMentionsReplace = "$1<span class=\"mention\">$2</span>";

			var message = data.message,
					userId = data.userId,
					roomId = data.roomId,
					timestamp = new Date();

			var tagNames = message.match(regexHashtags),
					html = markdown.toHTML(message, 'Gruber')
						.replace(regexHashtags, regexHashtagsReplace)
						.replace(regexMentions, regexMentionsReplace);

			if (tagNames) tagNames = tagNames.map(function(tag) { return tag.replace(/ /g, '').replace( /#/, ''); })

			// Find tags
			Tag.query(function(qb) { qb.whereIn('name', tagNames); })
				.fetchAll()
				.then(function(results) {
					if (!results) results = [];

					var names = results.pluck('name');
					var newTags = _.reject(tagNames, function(t) { return _.contains(names, t); });

					var forgedTags = Tags.forge(_.map(newTags, function(t) { return { name: t }; }));
					forgedTags.invokeThen('save', null, {});
					
					results.add(forgedTags.models)

					return results;
				}).then(function(tags) {
					// Find user
					User.where({ id: userId })
						.fetch()
						.then(function(user) {
							var message = { user_id: user.id, room_id: roomId, original: message, html: html };

							Message.forge(message)
								.save()
								.then(function(message) {
									message.tags().attach(tags.models);

									return message;
								})
								.then(function(message) {
									message.set('user', user);
									message.set('tags', tags.models);
									io.sockets.in(roomId).emit('message', message.toJSON());
								})
								.catch(function(err) { console.log(err); });
						});
					});
				});
	});
};