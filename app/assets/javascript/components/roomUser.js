var Ractive = require('ractive');

var RoomUserComponent = Ractive.extend({
	template: '#room-user-template',

	oninit: function() { },

	computed: { displayName: '${firstName} + " " + ${lastName}' }
});

module.exports = RoomUserComponent;