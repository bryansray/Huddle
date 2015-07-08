var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash'),
		io = require('socket.io-client'),
		socket = io('http://localhost:3000'),
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
		var currentChannel = this.get('channel');
		
		if (currentChannel !== channel) {
			this.set('channel', channel);
			socket.emit('join', { userId: 1, channelId: channel._id });
		}
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

socket.on('connect', function() {
	console.log("connected");
});

socket.on('joined', function(user) {
	console.log("joined: ", user);
})

socket.on('error', function(data) {
	console.log('error: ', data);
});