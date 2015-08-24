var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash');

var Modal = require('components/modal');

var NewRoomComponent = Modal.extend(Modal, {
	partials: { 
		content: Ractive.parse( document.getElementById('new-room-template').innerHTML ) 
	},

	data: function() {
		return { 
			title: "Create a New Room"
		};
	},

	oninit: function() {
		this.on('close', this.close);
		this.on('typing', this.typing);
		// this.on("create", this.createRoom);
		this.on("submit", this.createRoom);
	},

	typing: function(event) {
		if (event.original.keyCode === 27) this.close();
	},

	create: function() {
		this.find('form').submit();
	},

	createRoom: function(event) {
		event.original.preventDefault();

		var data = { name: this.get('name'), description: this.get('description') };

		superagent.post('/rooms').send(data).end(function(status, response) {
			this.parent.push('rooms', response.body);
			this.close();
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

	},

	oninit: function() { 

		superagent.get('/user/participating', function(data, response) {
			this.set('rooms', response.body);

			if (typeof _preloadedRoomId !== 'undefined') {
				var room = _.find(response.body, function(room) { return room.id === _preloadedRoomId; });
				this.set('activeRoom', room);
			}
		}.bind(this));

		this.root.on("Lobby.participateRoom", this.getParticipatingRooms.bind(this));
		this.root.on("Lobby.participateRoom", this.loadRoom.bind(this));

		this.on('Room.activateRoom', this.loadRoom);
		this.on('Room.closeRoom', this.removeRoom);

		this.on('newRoom', this.newRoom);
		this.on('loadLobby', this.loadLobby);

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

	getParticipatingRooms: function() {
		superagent.get('/user/participating').end(function(err, response) {
			this.merge('rooms', response.body);
		}.bind(this));
	},

	activateRoom: function(room, previousRoom, keypath) {
		if (room === null || room === undefined || room === previousRoom) return;

		this.root.socket.emit('join', { roomId: room.id });


		var title = "Huddle .:. " + room.name;
		document.title = title;
		history.pushState({ room: room, title: title }, room.name, "/rooms/" + room.id);
	},

	loadLobby: function(event, room) {
		event.original.preventDefault();
		var title = "Huddle .:. Lobby";
		document.title = title;
		history.pushState({ room: null, title: title }, "Huddle Lobby", "/chat/lobby");

		this.set('activeRoom', null);
	},

	loadRoom: function(event, room) {
		event.original.preventDefault();

		var currentRoom = this.get('activeRoom');
		if (currentRoom === room) return;

		this.set('activeRoom', room);
	},

	removeRoom: function(event, room) {
		event.original.preventDefault();

		// var index = _.findIndex(this.get('rooms'), 'id', room.id);
		// this.splice('rooms', index, 1);
		this.getParticipatingRooms();

		if (this.get('activeRoom') === room)
			this.set('activeRoom', null);
	},

	newRoom: function(event) {
		var newRoom = new NewRoomComponent({});
		newRoom.parent = this;
	}
});

module.exports = RoomsComponent;