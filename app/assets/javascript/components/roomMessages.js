var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash');

var RoomMessagesComponent = Ractive.extend({
	template: '#chat-messages-template',

	data: function() {
		return { 
			messages: [],

			previousMessageFromCurrentUser: function(previousUserId, currentUserId) { return previousUserId === currentUserId; }
		};
	},

	oninit: function() {
		this.root.observe('activeRoom', this.getRoomMessages, { context: this });

		this.root.socket.on('joined', this.joinedEvent.bind(this));
		this.root.socket.on('message', this.messageEvent.bind(this));
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
			this.scrollToBottom();
		}, this));
	},

	joinedEvent: function(data) {
		// var messages = this.get('messages');
		// messages.push(data);
	},

	scrollToBottom: function() {
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

		if (this._scrollPercentage() >= 98) this.scrollToBottom();
	},

	_scrollPercentage: function(element) {
		if (!element) element = this.find('#chat-messages');

		return 100 * element.scrollTop / ( element.scrollHeight  - element.clientHeight );
	}
});

module.exports = RoomMessagesComponent;