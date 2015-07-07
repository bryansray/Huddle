var Ractive = require('ractive');

var ChannelMessagesComponent = Ractive.extend({
	template: '#channel-messages-template',

	data: function() {
		return { 
			messages: [
				{ messageId: 1, user: "Bryan Ray", text: "This is a message.", timestamp: new Date(2015, 6, 6, 10, 12, 28) },
				{ messageId: 2, user: "Curtis Schlak", text: "This is another message for the channel.", timestamp: new Date(2015, 6, 6, 10, 22, 28, 0) },
				{ messageId: 3, user: "Heather Wood", text: "I'm going to type something very long to make sure that it wraps across the screen. I want to make sure that I didn't break anything by putting it in to a javascript template.", timestamp: new Date(2015, 6, 6, 10, 32, 28, 0) },
			],
			messageInput: "" 
		};
	},

	oninit: function() { 
		this.on('typing', this.handleTyping);
		this.on('messageSubmit', this.messageSubmit);
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