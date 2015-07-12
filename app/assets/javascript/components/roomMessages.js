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

		this.root.on('RoomList.loadRoom', _.bind(this.getRoomMessages, this));

		this.root.socket.on('joined', _.bind(this.joinedEvent, this));
	},

	getRoomMessages: function(event, room) {
		var url = "/rooms/" + room._id + "/messages";

		superagent.get(url).end(_.bind(function(status, response) {
			this.set('messages', response.body[0].messages);
		}, this));
	},

	messageSubmit: function() {
		console.log("Submit message ...");
	},

	handleTyping: function(event) {
		if (event.original.keyCode === 13 && event.original.shiftKey === false) {
			event.original.preventDefault();
			var message = this.get('messageInput');
			console.log("send: ", message);

			this.clearMessage();
		}
	},

	clearMessage: function() {
		this.set('messageInput', '');
	},

	joinedEvent: function(data) {
		console.log("Joined Event: ", this, data);
		var messages = this.get('messages');
		messages.push(data);
	}
});

module.exports = RoomMessagesComponent;