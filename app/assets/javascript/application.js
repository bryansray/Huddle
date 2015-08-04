var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash'),
		io = require('socket.io-client'),
		helpers = require('./helpers');

var RoomsComponent = require('./components/rooms'),
		MessagesComponent = require('./components/roomMessages'),
		UsersComponent = require('./components/roomUsers');

var ChatInputComponent = Ractive.extend({
	template: "#chat-input-template",

	data: function() {
		return {
			currentHistoryIndex: undefined,
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
				currentUserId = this.root.get('current_user.id'),
				chat = this.parent.get('chat'),
				type,
				toChatId;

		if (chat.id) { toChatId = chat.id; type = "room" }
		else { toChatId = chat.user.id; type = "user" }

		// TODO : store what they typed in local storage!
		if (!sessionStorage.getItem('messages')) sessionStorage.setItem('messages', JSON.stringify([]));

		var history = JSON.parse(sessionStorage.getItem('messages'));
		history.push(message);

		sessionStorage.setItem('messages', JSON.stringify(history));

		this.root.socket.emit('message', { currentUserId: currentUserId, type: type, toChatId: toChatId, message: message });
	},

	handleTyping: function(event) {
		if (event.original.keyCode === 13 && event.original.shiftKey === false) {
			event.original.preventDefault();
			
			this.set('currentHistoryIndex', undefined);
			this.messageSubmit();
			this.clearMessage();
		} else if (event.original.keyCode === 38 && event.original.metaKey === true) {
			var currentHistoryIndex = this.get('currentHistoryIndex')
			var history = JSON.parse(sessionStorage.getItem('messages'));

			if (currentHistoryIndex === undefined || currentHistoryIndex < 0) {
				currentHistoryIndex = history.length - 1;
				this.set('currentHistoryIndex', currentHistoryIndex);
			}

			var message = history[currentHistoryIndex];
			
			this.subtract('currentHistoryIndex')
			this.clearMessage();
			this.set('input', message);
		}
	},

	clearMessage: function() {
		this.set('input', '');
	}
});

var ConversationsComponent = Ractive.extend({
	template: "#conversations-template",

	data: function() {
		return { conversations: [], active: null };
	},

	oninit: function() {
		console.log("Initializing ConversationsComponent.");

		this.root.on('RoomUser.privateMessage', this.loadChat.bind(this));
		this.on('loadChat', this.loadChat.bind(this));
	},

	loadChat: function(event, user) {
		var conversations = this.get('conversations');
		var exists = _.contains(_.pluck(conversations, 'id'), user.id);

		var conversation = { user: user, messages: [] };
		this.set('active', conversation);
		
		if (!exists)
			conversations.push(conversation);

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
		var rooms = this.parent.findComponent('Rooms');
		var conversations = this.parent.findComponent('Conversations');

		rooms.observe('activeRoom', this.loadChat.bind(this));
		conversations.observe('active', this.loadChat.bind(this));

		// this.parent.on('*.loadChat', this.loadChat.bind(this));
	},

	loadChat: function(chat, previousChat, keypath) {
		var currentChat = this.get('chat');
		if (currentChat === chat) return;

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
	},

	// CONNECT : Should we request the current_user?
	onConnect: function(ractive) { 
		superagent.get('/session').end(function(err, response) {
			if (err) console.log("error: ", err);
			else ractive.set('current_user', response.body);
		});
	},

	onError: function() { console.log("OnError: ", arguments); }
});