var Ractive = require('ractive');

var RoomUserComponent = Ractive.extend({
	template: '#room-user-template',

	oninit: function() {
		this.on('privateMessage', this.privateMessage);
	},

	privateMessage: function(event, user) {
		var title = "Huddle .:. " + this.get('displayName');
		document.title = title;
		history.pushState({ user: user, title: title }, title, event.node.href);

		event.original.preventDefault();
	},

	computed: { displayName: '${user.firstName} + " " + ${user.lastName}' }
});

module.exports = RoomUserComponent;