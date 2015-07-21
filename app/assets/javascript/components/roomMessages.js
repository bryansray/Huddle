var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash');

var RoomMessagesComponent = Ractive.extend({
	template: '#room-messages-template',

	data: function() {
		return { 
			messages: [],
			messageInput: "" 
		};
	},

	oninit: function() {
		this.on('typing', this.handleTyping);
		this.on('messageSubmit', this.messageSubmit);

		this.root.observe('activeRoom', this.getRoomMessages, { context: this });

		this.root.socket.on('joined', _.bind(this.joinedEvent, this));
		this.root.socket.on('message', _.bind(this.messageEvent, this));
	},

	getRoomMessages: function(room, oldRoom, keypath) {
		if (!room) return;
		if (this.get('messages').length > 0) return;

		var url = "/rooms/" + room.id + "/messages";

		superagent.get(url).end(_.bind(function(status, response) {
			this.set('messages', response.body);
		}, this));
	},

	messageSubmit: function() {
		var message = this.get('messageInput'),
				room = this.parent.get('activeRoom');
		this.root.socket.emit('message', { userId: 1, roomId: room.id, message: message });
	},

	handleTyping: function(event) {
		if (event.original.keyCode === 13 && event.original.shiftKey === false) {
			event.original.preventDefault();
			this.messageSubmit();
			this.clearMessage();
		}
	},

	clearMessage: function() {
		this.set('messageInput', '');
	},

	joinedEvent: function(data) {
		var messages = this.get('messages');
		messages.push(data);
	},

	scrollToTop: function() {
		var messagesElement = document.getElementById('chat-messages');
		messagesElement.scrollTop = messagesElement.scrollHeight;
	},

	messageEvent: function(data) {
		console.log("messageEvent: ", data)
		var messages = this.get('messages');
		messages.push(data);
		this.scrollToTop();
	}
});

module.exports = RoomMessagesComponent;