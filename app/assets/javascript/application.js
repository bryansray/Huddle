var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash'),
		io = require('socket.io-client'),
		// socket = io('http://localhost:3000', { query: "userId=1234" }),
		helpers = require('./helpers');

var RoomsComponent = require('./components/rooms'),
		MessagesComponent = require('./components/roomMessages'),
		UsersComponent = require('./components/roomUsers');

var ChatInputComponent = Ractive.extend({
	template: "#chat-input-template",

	data: function() {
		return {
			input: ""
		};
	},

	oninit: function() {
		console.log("Initializing ChatInputComponent.");

		this.on('typing', this.handleTyping);
		this.on('messageSubmit', this.messageSubmit);
	},

	messageSubmit: function() {
		var message = this.get('input'),
				room = this.parent.get('activeRoom');
		this.root.socket.emit('message', { userId: this.root.get('current_user.id'), roomId: room.id, message: message });
		// this.scrollToTop();
	},

	handleTyping: function(event) {
		if (event.original.keyCode === 13 && event.original.shiftKey === false) {
			event.original.preventDefault();
			this.messageSubmit();
			this.clearMessage();
		}
	},

	clearMessage: function() {
		this.set('input', '');
	}
});

var ConversationsComponent = Ractive.extend({
	template: "#conversations-template",

	data: function() {
		return { conversations: [] };
	},

	oninit: function() {
		console.log("Initializing ConversationsComponent.");

		this.root.on('RoomUser.privateMessage', this.loadChat.bind(this));
		this.on('loadChat', this.loadChat.bind(this));
	},

	loadChat: function(event, user) {
		var conversations = this.get('conversations');
		var exists = _.contains(_.pluck(conversations, 'id'), user.id);

		if (!exists)
			conversations.push({ user: user, messages: [] });

		event.original.preventDefault();
	}
});

var ChatComponent = Ractive.extend({
	template: "#chat-template",

	data: function() {
		return { chat: null };
	},

	components: {
		Messages: MessagesComponent,
		Users: UsersComponent,
		ChatInput: ChatInputComponent
	},

	partials: {
		Room: document.getElementById('room-template').text,
		Message: document.getElementById('message-template').text,
	},

	oninit: function() {
		this.parent.on('*.loadChat', this.loadChat.bind(this));
	},

	loadChat: function(event, chat) {
		console.log("Load chat: ", chat);
		this.set('chat', chat);
	}
});

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
		console.log("Initializing Huddle.");
		
		this.set('current_user', { id: window._currentUserId });

		this.socket = io.connect('http://localhost:3000', { query: "userId=" + window._currentUserId });
		this.socket.on('connect', _.bind(this.onConnect, this.socket, this));
		this.socket.on('error', _.bind(this.onError, this.socket, this));
	},

	oncomplete: function() {
		console.log("Huddle Complete.");
		
		var roomsComponent = this.findComponent('Rooms');
		
		roomsComponent.observe('activeRoom', this.activateRoom, { context: this });
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
		if (!room) return;

		var currentRoom = this.get('activeRoom');

		if (currentRoom !== room) {
			this.set('activeRoom', room);
			this.socket.emit('join', { roomId: room.id });
		}
	},
});