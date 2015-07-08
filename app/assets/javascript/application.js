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
	},

	oninit: function() {
		this.root.on('ChannelsList.load-channel', _.bind(this.activateChannel, this));
	},

	activateChannel: function(event, channel) {
		this.set('channel', channel);
	}
});

var huddle = new Ractive({
	el: '#huddle-app',
	template: '#huddle-template',

	components: { 
		Channel: ChannelComponent,
		ChannelsList: ChannelsComponent,
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