var Ractive = require('ractive');

var ChannelUserComponent = Ractive.extend({
	template: '#channel-user-template',

	oninit: function() { },

	computed: { displayName: '${firstName} + " " + ${lastName}' }
});

module.exports = ChannelUserComponent;