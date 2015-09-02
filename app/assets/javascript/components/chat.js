var Ractive = require('ractive');

var ChatInputComponent = require('components/chatInput');
var MessagesComponent = require('components/roomMessages');
var UsersComponent = require('components/roomUsers');

var ChatComponent = Ractive.extend({
	template: "#chat-template",

	data: function() {
		return { chat: null };
	},

	components: {
		Messages: MessagesComponent,
		Users: UsersComponent,
		ChatInput: ChatInputComponent
	},

	partials: {
		Room: document.getElementById('room-template').text,
		Message: document.getElementById('message-template').text,
	},

	oninit: function() {
		this.observe('req', (req) => {
			this.set('chat', req.body.room);
			
			if (req.body.room)
				this.root.socket.emit('join', { roomId: req.body.room.id });
		});

		var rooms = this.root.findComponent('Rooms');

		rooms.observe('activeRoom', this.loadChat);
	},

	loadChat: function(chat, previousChat, keypath) {
		this.set('chat', chat);
	}
});

ChatComponent._name = 'Chat';

module.exports = ChatComponent;