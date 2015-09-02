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
		return {
			missedMessages: 0
		};
	},

	oninit: function() {
		this.root.socket.on('message', this.messageReceived.bind(this));

		this.on('activateRoom', this.activateRoom);
		this.on('closeRoom', this.closeRoom);
	},

	activateRoom: function(event, room) {
		event.original.preventDefault();

		this.set('missedMessages', 0);
	},

	closeRoom: function(event, room) {
		this.root.socket.emit('part', room);
	},

	messageReceived: function(data) {
		var roomId = this.get('room.id'),
				activeRoom = this.get('activeRoom');

		if (roomId === undefined || activeRoom.id === data.room_id || data.room_id !== roomId) return;

		this.add('missedMessages');
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

	oninit: function() {
		superagent.get('/user/participating', function(data, response) {
			this.set('rooms', response.body);
		}.bind(this));

		this.root.on("Lobby.participateRoom", this.getParticipatingRooms.bind(this));
		this.root.on("Lobby.participateRoom", this.loadRoom.bind(this));

		this.on('Room.activateRoom', this.loadRoom);
		this.on('Room.closeRoom', this.removeRoom);

		this.on('newRoom', this.newRoom);
		this.on('loadLobby', this.loadLobby);

		this.observe('activeRoom', this.activateRoom);
	},

	getParticipatingRooms: function() {
		superagent.get('/user/participating').end(function(err, response) {
			this.merge('rooms', response.body);
		}.bind(this));
	},

	activateRoom: function(room, previousRoom, keypath) {
		if (room === null || room === undefined || room === previousRoom) return;

		
	},

	loadLobby: function(event, room) {
		event.original.preventDefault();
		var url = "/chat/lobby";
		this.root.router.navigateTo(url);

		this.set('activeRoom', null);
	},

	loadRoom: function(event, room) {
		event.original.preventDefault();

		var currentRoom = this.get('activeRoom');
		if (currentRoom === room) return;

		var url = event.node.getAttribute("href");
		this.root.router.navigateTo(url);

		this.set('activeRoom', room);
	},

	removeRoom: function(event, room) {
		event.original.preventDefault();

		this.getParticipatingRooms();

		if (this.get('activeRoom') === room)
			this.set('activeRoom', null);
	},

	messageReceived: function(data) {
		let activeRoom = this.get('activeRoom');
		if (data.room_id === activeRoom.id) return;

		let rooms = this.get('rooms');
		let room = _.find(rooms, function(r) { return r.id === data.room_id });
	},

	newRoom: function(event) {
		var newRoom = new NewRoomComponent({});
		newRoom.parent = this;
	}
});

module.exports = RoomsComponent;