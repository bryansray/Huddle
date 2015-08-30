var Ractive = require('ractive'),
		_ = require('lodash'),
		superagent = require('superagent');

var RoomUserComponent = require('components/roomUser');

var RoomUsersComponent = Ractive.extend({
	template: '#room-users-template',

	oninit: function() {
		this.root.socket.on('joined', _.bind(this.onJoined, this));
		this.root.socket.on('part', this.onPart.bind(this));
		this.root.socket.on('quit', this.onPart.bind(this));

		var room = this.get('chat');

		if (room) {
			// Get a list of active users in the channel.
			superagent.get('/rooms/' + room.id + '/users');
		}
	},

	components: { 
		RoomUser: RoomUserComponent 
	},

	data: function() {
		return { 
			users: []
		};
	},

	onJoined: function(data) {
		// TODO : This seems wrong ...
		// if (data.roomId === this.get('chat.id'))
		this.set('users', data.users);
	},

	onPart: function(data) {		
		var index = _.findIndex(this.get('users'), 'id', data.userId);
		this.splice('users', index, 1);
	}
});

module.exports = RoomUsersComponent;