var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash');

var RoomMessagesComponent = Ractive.extend({
	template: '#room-messages-template',

	data: function() {
		return { 
			messages: [],
			messageInput: "",

			previousMessageFromCurrentUser: function(previousUserId, currentUserId) { return previousUserId === currentUserId; }
		};
	},

	oninit: function() {
		this.on('typing', this.handleTyping);
		this.on('messageSubmit', this.messageSubmit);

		this.root.observe('activeRoom', this.getRoomMessages, { context: this });

		this.root.socket.on('joined', _.bind(this.joinedEvent, this));
		this.root.socket.on('message', _.bind(this.messageEvent, this));
	},

	oncomplete: function() {
		var messagesContainer = this.find('#chat-messages');
		messagesContainer.addEventListener('scroll', this.handleScrolling.bind(this));
	},

	getRoomMessages: function(room, oldRoom, keypath) {
		if (!room) return;

		var url = "/rooms/" + room.id + "/messages";

		superagent.get(url).end(_.bind(function(status, response) {
			var messages = this.get('messages');
			this.set('messages', response.body);
			this.scrollToTop();
		}, this));
	},

	messageSubmit: function() {
		var message = this.get('messageInput'),
				room = this.parent.get('activeRoom');
		this.root.socket.emit('message', { userId: this.root.get('current_user.id'), roomId: room.id, message: message });
		this.scrollToTop();
	},

	handleTyping: function(event) {
		if (event.original.keyCode === 13 && event.original.shiftKey === false) {
			event.original.preventDefault();
			this.messageSubmit();
			this.clearMessage();
		}
	},

	clearMessage: function() {
		this.set('messageInput', '');
	},

	joinedEvent: function(data) {
		// var messages = this.get('messages');
		// messages.push(data);
	},

	scrollToTop: function() {
		var messagesElement = this.find('#chat-messages');
		messagesElement.scrollTop = messagesElement.scrollHeight;
	},

	handleScrolling: function(event) {
		var percentage = this._scrollPercentage(event.target);
		// TODO : When we get to a certain percentage we should load more.
		if (percentage < 20) {
			console.log("Start loading more historical messages ...");
		}
	},

	messageEvent: function(data) {
		var messages = this.get('messages');
		messages.push(data);

		if (this._scrollPercentage() >= 98)
			this.scrollToTop();
	},

	_scrollPercentage: function(element) {
		if (!element) element = this.find('#chat-messages');

		return 100 * element.scrollTop / ( element.scrollHeight  - element.clientHeight );
	}
});

module.exports = RoomMessagesComponent;