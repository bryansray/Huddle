var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash'),
		io = require('socket.io-client'),
		socket = io('http://localhost:3000'),
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
		this.root.on('RoomList.load-room', _.bind(this.activateRoom, this));
	},

	activateRoom: function(event, room) {
		var currentRoom = this.get('room');
		
		if (currentRoom !== room) {
			this.set('room', room);
			socket.emit('join', { userId: 1, roomId: room._id });
		}
	}
});

var huddle = new Ractive({
	el: '#huddle-app',
	template: '#huddle-template',

	components: { 
		Room: RoomComponent,
		RoomList: RoomsComponent,
	}
});

socket.on('connect', function() {
	console.log("connected");
});

socket.on('joined', function(user) {
	console.log("joined: ", user);
});

socket.on('error', function(data) {
	console.log('error: ', data);
});