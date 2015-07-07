var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash'),
		helpers = require('./helpers');

var ChannelsComponent = require('./components/channels'),
		ChannelMessagesComponent = require('./components/channelMessages'),
		ChannelUsersComponent = require('./components/channelUsers');

var ChannelComponent = Ractive.extend({
	template: "#channel-template",

	components: {
		ChannelMessages: ChannelMessagesComponent,
		ChannelUsers: ChannelUsersComponent
	}
});

var huddle = new Ractive({
	el: '#huddle-app',
	template: '#huddle-template',

	oninit: function() {
		this.on('ChannelsList.load-channel', this.activateChannel);
	},

	components: { 
		Channel: ChannelComponent,
		ChannelsList: ChannelsComponent,
	},

	activateChannel: function(event, channel) {
		var activeChannel = this.get('activeChannel');

		if (activeChannel !== channel) {
			var url = '/channels/' + channel._id;
			superagent.get(url, _.bind(function(data, response) {
				this.set('activeChannel', channel);
			}, this));
		}
	}
});

// var io = require('socket.io-client');
// var socket = io('http://localhost:3000');

// socket.connect('http://localhost:3000');

// socket.on('connect', function() {
// 	console.log("connected");
// });

// socket.on('error', function(data) {
// 	console.log('error: ', data);
// });