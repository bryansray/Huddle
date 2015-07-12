var Ractive = require('ractive'),
		_ = require('lodash'),
		superagent = require('superagent');

var RoomUserComponent = require('components/roomUser');

var RoomUsersComponent = Ractive.extend({
	template: '#room-users-template',

	oninit: function() {
		this.root.socket.on('joined', _.bind(this.joined, this));

		var room = this.parent.get('room');

		if (room) {
			// Get a list of active users in the channel.
			superagent.get('/rooms/' + room.id + '/users');
		}
	},

	components: { RoomUser: RoomUserComponent },

	data: function() {
		return { 
			users: []
		};
	},

	joined: function(data) {
		var users = this.get('users');
		users.push(data.user);
	}
});

module.exports = RoomUsersComponent;