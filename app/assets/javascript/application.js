var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash'),
		io = require('socket.io-client'),
		// socket = io('http://localhost:3000', { query: "userId=1234" }),
		helpers = require('./helpers');

var RoomsComponent = require('./components/rooms'),
		RoomMessagesComponent = require('./components/roomMessages'),
		RoomUsersComponent = require('./components/roomUsers');

var RoomComponent = Ractive.extend({
	template: "#room-template",

	components: {
		RoomMessages: RoomMessagesComponent,
		RoomUsers: RoomUsersComponent
	},

	oninit: function() {
	}
});

var huddle = new Ractive({
	el: '#huddle-app',
	template: '#huddle-template',

	components: { 
		Room: RoomComponent,
		RoomList: RoomsComponent,
	},

	oninit: function() {
		console.log("Initializing Huddle ...");
		this.set('current_user', { id: window._currentUserId });

		this.socket = io.connect('http://localhost:3000', { query: "userId=" + window._currentUserId });


		this.socket.on('connect', _.bind(this.onConnect, this.socket, this));
		this.socket.on('error', _.bind(this.onError, this.socket, this));
	},

	oncomplete: function() {
		console.log("Huddle Complete ...");
		var component = this.findComponent('RoomList');
		component.observe('activeRoom', this.activateRoom, { context: this });
	},

	// CONNECT : Should we request the current_user?
	onConnect: function(ractive) { 
		console.log("OnConnect: ");
		superagent.get('/session').end(function(err, response) {
			if (err) console.log("error: ", err);
			else ractive.set('current_user', response.body);
		});
	},

	onError: function() { console.log("OnError: ", arguments); },

	activateRoom: function(room, oldRoom, keypath) {
		var currentRoom = this.get('activeRoom');
		
		if (currentRoom !== room) {
			this.set('activeRoom', room);
			this.socket.emit('join', { roomId: room.id });
		}
	},
});

window.onpopstate = function(event) {
	console.log("popstate: ", event.state);
}