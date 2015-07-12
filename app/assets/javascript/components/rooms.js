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
		this.on('loadRoom', this.loadRoom);
		this.on('newRoom', this.newRoom);
	},

	loadRoom: function(event, room) {
		this.set('activeRoom', room);
	},

	newRoom: function(event) {
		superagent.post('/rooms')
			.send({ name: "General Discussion", description: "This is a room for General Discussion." })
			.end(function(res) {
				console.log(arguments);
			});
	}
});

module.exports = RoomsComponent;