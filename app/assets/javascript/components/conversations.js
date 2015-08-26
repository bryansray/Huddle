var Ractive = require('ractive');

var ConversationsComponent = Ractive.extend({
	template: "#conversations-template",

	data: function() {
		return { conversations: [], active: null };
	},

	oninit: function() {
		this.root.on('RoomUser.privateMessage', this.loadChat.bind(this));
		this.on('loadChat', this.loadChat.bind(this));
	},

	loadChat: function(event, user) {
		var conversations = this.get('conversations');
		var exists = _.contains(_.pluck(conversations, 'id'), user.id);

		var conversation = { user: user, messages: [] };
		this.set('active', conversation);
		
		if (!exists)
			conversations.push(conversation);

		event.original.preventDefault();
	}
});

module.exports = ConversationsComponent;