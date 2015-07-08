var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash');

var RoomsComponent = Ractive.extend({
	template: '#rooms-template',

	onconstruct: function() {
		superagent.get('/rooms', _.bind(function(data, response) {
			this.set('rooms', response.body);
		}, this));
	},

	oninit: function() { 
		this.on('load-room', this.loadChannel);
		this.on('newRoom', this.newRoom);
	},

	loadRoom: function(event, room) {
		this.set('activeRoom', room);
	},

	newRoom: function(event) {
		console.log("Create a new room ...");
	}
});

module.exports = RoomsComponent;