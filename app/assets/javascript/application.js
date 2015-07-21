var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash'),
		io = require('socket.io-client'),
		// socket = io('http://localhost:3000', { query: "userId=1234" }),
		helpers = require('./helpers');

var socket = io.connect('http://localhost:3000', { query: "userId=34567" });

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
		this.root.on('RoomList.loadRoom', _.bind(this.activateRoom, this));
	},

	activateRoom: function(event, room) {
		var currentRoom = this.get('room');
		
		if (currentRoom !== room) {
			this.set('room', room);
			socket.emit('join', { roomId: room.id });
		}
	}
});

var huddle = new Ractive({
	el: '#huddle-app',
	template: '#huddle-template',
	socket: socket,
	
	components: { 
		Room: RoomComponent,
		RoomList: RoomsComponent,
	}
});

socket.on('connect', function() {
	console.log("connected");
});

socket.on('error', function(data) {
	console.log('error: ', data);
});