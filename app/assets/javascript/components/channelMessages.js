var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash');

var ChannelMessagesComponent = Ractive.extend({
	template: '#channel-messages-template',

	data: function() {
		return { 
			messages: [],
			messageInput: "" 
		};
	},

	oninit: function() {
		this.on('typing', this.handleTyping);
		this.on('messageSubmit', this.messageSubmit);

		this.root.on('ChannelsList.load-channel', _.bind(this.getChannelMessages, this));
	},

	getChannelMessages: function(event, channel) {
		var url = "/channels/" + channel._id + "/messages";

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

module.exports = ChannelMessagesComponent;