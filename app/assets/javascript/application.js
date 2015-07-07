var Ractive = require('ractive'),
		helpers = require('./helpers');

var ChannelsComponent = require('./components/channels');

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

var ChannelUserComponent = Ractive.extend({
	template: '#channel-user-template',

	oninit: function() { },

	computed: { displayName: '${firstName} + " " + ${lastName}' }
});

var ChannelUsersComponent = Ractive.extend({
	template: '#channel-users-template',
	oninit: function() {
		console.log("Initializing Channel Users ...");
	},

	components: { ChannelUser: ChannelUserComponent },

	data: function() {
		return { 
			users: [
				{ userId: 1, firstName: "Bryan", lastName: "Ray", status: "active" },
				{ userId: 2, firstName: "Curtis", lastName: "Schlak", status: "active" },
				{ userId: 3, firstName: "Heather", lastName: "Wood", status: "active" },
				{ userId: 4, firstName: "Lindsey", lastName: "Ray", status: "idle" },
				{ userId: 4, firstName: "Kylie", lastName: "Ray", status: "offline" },
			]
		}
	}
});

var huddle = new Ractive({
 el: '#huddle-app',
 template: '#huddle-template',

 components: { 
 	ChannelsList: ChannelsComponent,
 	ChannelMessages: ChannelMessagesComponent,
 	ChannelUsers: ChannelUsersComponent
 }
});

// var io = require('socket.io-client');
// var socket = io('http://localhost:3000');

// socket.connect('http://localhost:3000');

// socket.on('connect', function() {
// 	console.log("connected");
// });

// socket.on('error', function(data) {
// 	console.log('error: ', data);
// });