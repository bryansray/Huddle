var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash');

var ChannelsComponent = Ractive.extend({
	template: '#channels-template',

	onconstruct: function() {
		superagent.get('/channels', _.bind(function(data, response) {
			this.set('channels', response.body);
		}, this));
	},

	oninit: function() { 
		this.on('load-channel', this.loadChannel);
	},

	loadChannel: function(event, channel) {
		this.set('activeChannel', channel);
	}
});

module.exports = ChannelsComponent;