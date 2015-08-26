var Ractive = require('ractive');

var ChatInputComponent = require('components/chatInput');
var LobbyComponent = require('components/lobby');
var MessagesComponent = require('components/roomMessages');
var UsersComponent = require('components/roomUsers');

var ChatComponent = Ractive.extend({
	template: "#chat-template",

	data: function() {
		return { chat: null };
	},

	components: {
		Lobby: LobbyComponent,
		Messages: MessagesComponent,
		Users: UsersComponent,
		ChatInput: ChatInputComponent
	},

	partials: {
		Room: document.getElementById('room-template').text,
		Message: document.getElementById('message-template').text,
	},

	oninit: function() {
		var rooms = this.parent.findComponent('Rooms');
		var conversations = this.parent.findComponent('Conversations');

		rooms.observe('activeRoom', this.loadChat.bind(this));
		conversations.observe('active', this.loadChat.bind(this));

		// this.parent.on('*.loadChat', this.loadChat.bind(this));
	},

	loadChat: function(chat, previousChat, keypath) {
		var currentChat = this.get('chat');
		if (currentChat === chat) return;

		this.set('chat', chat);
	}
});

module.exports = ChatComponent;