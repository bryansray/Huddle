var Ractive = require('ractive'),
		_ = require('lodash'),
		superagent = require('superagent');

var RoomUserComponent = require('components/roomUser');

var RoomUsersComponent = Ractive.extend({
	template: '#room-users-template',
	components: { 
		RoomUser: RoomUserComponent 
	},

	data: function() {
		return { 
			users: []
		};
	},

	onconfig: function() {
		this.root.socket.on('joined', this.onJoined.bind(this));
		this.root.socket.on('part', this.onPart.bind(this));
		this.root.socket.on('quit', this.onPart.bind(this));
	},

	oninit: function() {
		console.log("Initializing RoomUsers Component.");
	},

	onJoined: function(data) {
		console.log("joined: ", data);
		this.set('users', data.users);
	},

	onPart: function(data) {		
		var index = _.findIndex(this.get('users'), 'id', data.userId);
		this.splice('users', index, 1);
	}
});

module.exports = RoomUsersComponent;