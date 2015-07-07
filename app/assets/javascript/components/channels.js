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
		var activeChannel = this.get('activeChannel');
		if (activeChannel !== channel) {
			var url = '/channels/' + channel.channelId;
			superagent.get(url, function(data, response) {
				console.log(response.body);
			});

			this.set('activeChannel', channel);
		}
	}
});

module.exports = ChannelsComponent;