var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash'),
		io = require('socket.io-client'),
		helpers = require('./helpers');

var RoomsComponent = require('./components/rooms'),
		ConversationsComponent = require('./components/conversations'),
		ChatComponent = require('./components/chat');

var huddle = new Ractive({
	el: '#huddle-app',
	template: '#huddle-template',

	components: { 
		Chat: ChatComponent,
		Rooms: RoomsComponent,
		Conversations: ConversationsComponent
	},

	data: {
		_: _
	},

	oninit: function() {
		this.set('current_user', { id: window._currentUserId });

		this.socket = io.connect('', { query: "userId=" + window._currentUserId });
		this.socket.on('connect', _.bind(this.onConnect, this.socket, this));
		this.socket.on('error', _.bind(this.onError, this.socket, this));
		this.socket.on('disconnect', this.onDisconnect);
		this.socket.on('quit', this.onQuit);
	},

	// CONNECT : Should we request the current_user?
	onConnect: function(ractive) { 
		superagent.get('/session').end(function(err, response) {
			if (err) console.log("error: ", err);
			else ractive.set('current_user', response.body);
		});
	},

	onError: function() { console.log("OnError: ", arguments); },

	onDisconnect: function() { console.log("Disconnect: ", arguments); },
	onQuit: function() { console.log("Quit: ", arguments); }
});