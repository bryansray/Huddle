var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash');

var NewRoomComponent = Ractive.extend({
	el: '#huddle-app',
	append: true,
	template: '#new-room-template',

	data: function() {
		return { name: "", description: "" };
	},

	oninit: function() {
		console.log("Initializing NewRoomComponent ...");

		this.on("createRoom", this.createRoom);
	},

	createRoom: function(event) {
		console.log("Creating Room: ", this.get());

		var data = this.get();

		superagent.post('/rooms').send(data).end(function(status, response) {
			console.log("response: ", response);

			this.parent.push('rooms', response.body);
		}.bind(this));

		return false;
	}
});

var RoomComponent = Ractive.extend({
	template: "#sidebar-room-template",

	data: function() {
		return {};
	},

	oninit: function() {
		console.log("Initializing RoomComponent");

		this.on('activateRoom', this.activateRoom);
		this.on('closeRoom', this.closeRoom);
	},

	activateRoom: function(event, room) {
		event.original.preventDefault();
	},

	closeRoom: function(event, room) {
		this.root.socket.emit('part', room);
	}
});

var RoomsComponent = Ractive.extend({
	template: '#rooms-template',

	data: function() {
		return {
			rooms: [],
			activeRoom: null
		};
	},

	components: { 
		NewRoom: NewRoomComponent,
		Room: RoomComponent
	},

	onconstruct: function() {
		console.log("Constructing RoomsComponent.");
		
		superagent.get('/user/participating', _.bind(function(data, response) {
			this.set('rooms', response.body);

			if (typeof _preloadedRoomId !== 'undefined') {
				var room = _.find(response.body, function(room) { return room.id === _preloadedRoomId; });
				this.set('activeRoom', room);
			}
		}, this));
	},

	oninit: function() { 
		console.log("Initializing RoomsComponent.");
		
		this.on('Room.activateRoom', this.loadRoom);
		this.on('Room.closeRoom', this.removeRoom);
		// this.on('loadChat', this.loadRoom);
		this.on('newRoom', this.newRoom);

		this.observe('activeRoom', this.activateRoom);

		window.onpopstate = _.bind(function(event) {
			console.log("popstate: ", event.state);

			if (event.state === null) return;
			if (event.state.room === null) return;

			var rooms = this.get('rooms'),
					room = _.find(rooms, function(room) { return room.id === event.state.room.id });

			document.title = event.state.title;

			this.set('activeRoom', room);
		}, this);
	},

	oncomplete: function() {
		console.log("Completing RoomsComponent.");
	},

	activateRoom: function(room, previousRoom, keypath) {
		if (room === null || room === undefined || room === previousRoom) return;

		this.root.socket.emit('join', { roomId: room.id });


		var title = "Huddle .:. " + room.name;
		document.title = title;
		history.pushState({ room: room, title: title }, room.name, "/rooms/" + room.id);
	},

	loadRoom: function(event, room) {
		event.original.preventDefault();

		var currentRoom = this.get('activeRoom');
		if (currentRoom === room) return;

		this.set('activeRoom', room);
	},

	removeRoom: function(event, room) {
		event.original.preventDefault();

		var index = _.findIndex(this.get('rooms'), 'id', room.id);
		this.splice('rooms', index, 1);
	},

	newRoom: function(event) {
		// var foo = this.findComponent('NewRoom');
		var newRoom = new NewRoomComponent(); //this.findComponent('NewRoom');
		// console.log("newRoom: ", foo);
		// newRoom.render();
		newRoom.parent = this;
	}
});

module.exports = RoomsComponent;