var Ractive = require('ractive'),
		_ = require('lodash'),
		superagent = require('superagent');

var RoomUserComponent = require('components/roomUser');

var RoomUsersComponent = Ractive.extend({
	template: '#room-users-template',

	oninit: function() {
		this.root.socket.on('joined', _.bind(this.onJoined, this));

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

	onJoined: function(data) {
		this.set('users', data.users);
	}
});

module.exports = RoomUsersComponent;