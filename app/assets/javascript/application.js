var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash'),
		io = require('socket.io-client'),
		// socket = io('http://localhost:3000', { query: "userId=1234" }),
		helpers = require('./helpers');

var RoomsComponent = require('./components/rooms'),
		RoomMessagesComponent = require('./components/roomMessages'),
		RoomUsersComponent = require('./components/roomUsers');

var PrivateMessagesComponent = Ractive.extend({
	template: "#private-messages-template",

	data: function() {
		return { chats: [] };
	},

	oninit: function() {
		console.log("Initializing PrivateMessagesComponent.");
	}
});

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
		PrivateMessageList: PrivateMessagesComponent
	},

	data: {
		_: _
	},

	oninit: function() {
		console.log("Initializing Huddle.");
		this.set('current_user', { id: window._currentUserId });

		this.on('RoomUser.privateMessage', this.privateMessage);

		this.socket = io.connect('http://localhost:3000', { query: "userId=" + window._currentUserId });
		this.socket.on('connect', _.bind(this.onConnect, this.socket, this));
		this.socket.on('error', _.bind(this.onError, this.socket, this));
	},

	oncomplete: function() {
		console.log("Huddle Complete.");
		
		var roomListComponent = this.findComponent('RoomList'),
				roomComponent = this.findComponent('Room');
		
		roomListComponent.observe('activeRoom', this.activateRoom, { context: this });
		// roomComponent.observe('privateMessage', this.privateMessage, { context: this });
	},

	privateMessage: function(event, user) {
		console.log("Private Message Send: ", arguments);
		var component = this.findComponent('PrivateMessageList');
		var chats = component.get('chats');
		chats.push(user);
	},

	// CONNECT : Should we request the current_user?
	onConnect: function(ractive) { 
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