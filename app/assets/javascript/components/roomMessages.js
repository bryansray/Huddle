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

		this.root.on('RoomList.load-room', _.bind(this.getRoomMessages, this));
	},

	getRoomMessages: function(event, room) {
		var url = "/rooms/" + room._id + "/messages";

		superagent.get(url).end(_.bind(function(status, response) {
			this.set('messages', response.body.messages);
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
	}
});

module.exports = RoomMessagesComponent;