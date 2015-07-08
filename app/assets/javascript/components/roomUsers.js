var Ractive = require('ractive');

var RoomUserComponent = require('components/roomUser');

var RoomUsersComponent = Ractive.extend({
	template: '#room-users-template',
	oninit: function() {
	},

	components: { RoomUser: RoomUserComponent },

	data: function() {
		return { 
			users: [
				{ userId: 1, firstName: "Bryan", lastName: "Ray", status: "active" },
				{ userId: 2, firstName: "Curtis", lastName: "Schlak", status: "active" },
				{ userId: 3, firstName: "Heather", lastName: "Wood", status: "active" },
				{ userId: 4, firstName: "Lindsey", lastName: "Ray", status: "idle" },
				{ userId: 4, firstName: "Kylie", lastName: "Ray", status: "offline" },
			]
		};
	}
});

module.exports = RoomUsersComponent;