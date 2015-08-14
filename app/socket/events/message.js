var _ = require('lodash'),
		markdown = require('markdown').markdown;

var User = require('../../models/user'),
		Tag = require('../../models/tag'),
		Message = require('../../models/message'),
		Tags = require('../../models/tags');

module.exports = function(io, socket) {

	// MESSAGE (RECEIVED) EVENT
	// 1. Check and add for new tags that need to be added
	// 2. Check and add for any mentions that need to be added
	// 3. Save message with all related data
	// 4. Broadcast response back to all the connected clients
	socket.on('message', function(data) {
		var regexHashtags = /(^|\s)(#[a-z\d-]+)/ig,
				regexMentions = /(^|\s)(@[a-z\d_-]+)/ig,
				regexUrls = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})/ig;

		var regexHashtagsReplace = "$1<span class=\"hash-tag\">$2</span>",
				regexMentionsReplace = "$1<span class=\"mention\">$2</span>",
				regexUrlReplace = "[$&]($&)";;

		var message = data.message.replace(regexUrls, regexUrlReplace),
				userId = data.currentUserId,
				type = data.type,
				toChatId = data.toChatId,
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
						var message = { user_id: user.id, room_id: toChatId, original: data.message, html: html };

						Message.forge(message)
							.save()
							.then(function(message) {
								message.tags().attach(tags.models);

								return message;
							})
							.then(function(message) {
								message.set('user', user);
								message.set('tags', tags.models);
								
								io.sockets.in(toChatId).emit('message', message.toJSON());
							})
							.catch(function(err) { console.log(err); });
					});
				});
			});
}