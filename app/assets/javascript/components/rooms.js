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
	},

	loadRoom: function(event, room) {
		this.set('activeRoom', room);
	}
});

module.exports = RoomsComponent;