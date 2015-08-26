var Ractive = require('ractive');

var ChatInputComponent = Ractive.extend({
	template: "#chat-input-template",

	data: function() {
		return {
			input: ""
		};
	},

	oninit: function() {
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

		this.set('currentHistoryIndex', undefined);

		// TODO : Store separate history for specific room?
		// TODO : possibly limit local storage to the last N messages?
		if (!sessionStorage.getItem('messages')) sessionStorage.setItem('messages', JSON.stringify([]));

		var history = JSON.parse(sessionStorage.getItem('messages'));
		history.push(message);

		sessionStorage.setItem('messages', JSON.stringify(history));

		this.root.socket.emit('message', { currentUserId: currentUserId, type: type, toChatId: toChatId, message: message });
	},

	handleTyping: function(event) {
		if (event.original.keyCode === 13 && event.original.shiftKey === false) {
			event.original.preventDefault();
			
			this.messageSubmit();
			this.clearMessage();
		} else if (event.original.keyCode === 38 && (event.original.metaKey === true || event.original.ctrlKey === true)) {
			var history = JSON.parse(sessionStorage.getItem('messages'));
			if (!history) return;

			var currentHistoryIndex = this.get('currentHistoryIndex')
			
			if (currentHistoryIndex === undefined || currentHistoryIndex < 0) {
				currentHistoryIndex = history.length - 1;
			} else {
				currentHistoryIndex = currentHistoryIndex - 1;
			}

			var message = history[currentHistoryIndex];
			
			this.set('currentHistoryIndex', currentHistoryIndex);
			this.clearMessage();
			this.set('input', message);
		} else if (event.original.keyCode === 40 && (event.original.metaKey === true || event.original.ctrlKey === true)) {
			var history = JSON.parse(sessionStorage.getItem('messages'));
			if (!history) return;

			var currentHistoryIndex = this.get('currentHistoryIndex');
			
			if (currentHistoryIndex === undefined || currentHistoryIndex >= history.length) {
				currentHistoryIndex = 0;
			} else {
				currentHistoryIndex = currentHistoryIndex + 1;
			}

			var message = history[currentHistoryIndex];

			this.set('currentHistoryIndex', currentHistoryIndex);
			this.clearMessage();
			this.set('input', message);
		}
	},

	clearMessage: function() {
		this.set('input', '');
	}
});

module.exports = ChatInputComponent;