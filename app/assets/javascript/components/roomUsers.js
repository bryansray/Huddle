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
			users: [
				// { userId: 1, firstName: "Bryan", lastName: "Ray", status: "active" },
				// { userId: 2, firstName: "Curtis", lastName: "Schlak", status: "active" },
				// { userId: 3, firstName: "Heather", lastName: "Wood", status: "active" },
				// { userId: 4, firstName: "Lindsey", lastName: "Ray", status: "idle" },
				// { userId: 4, firstName: "Kylie", lastName: "Ray", status: "offline" },
			]
		};
	},

	joined: function(data) {
		console.log("Someone joined the Room. :: ", data);
		var users = this.get('users');

		users.push(data.user);
	}
});

module.exports = RoomUsersComponent;