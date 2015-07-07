var Ractive = require('ractive');

var ChannelUserComponent = require('components/channelUser');

var ChannelUsersComponent = Ractive.extend({
	template: '#channel-users-template',
	oninit: function() {
	},

	components: { ChannelUser: ChannelUserComponent },

	data: function() {
		return { 
			users: [
				{ userId: 1, firstName: "Bryan", lastName: "Ray", status: "active" },
				{ userId: 2, firstName: "Curtis", lastName: "Schlak", status: "active" },
				{ userId: 3, firstName: "Heather", lastName: "Wood", status: "active" },
				{ userId: 4, firstName: "Lindsey", lastName: "Ray", status: "idle" },
				{ userId: 4, firstName: "Kylie", lastName: "Ray", status: "offline" },
			]
		}
	}
});

module.exports = ChannelUsersComponent;