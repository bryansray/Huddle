var Ractive = require('ractive'),
		superagent = require('superagent'),
		_ = require('lodash');

var NewRoomComponent = Ractive.extend({
	template: '#new-room-template',

	oninit: function() {
		console.log("Initializing NewRoomComponent ...");
	}
});

var RoomsComponent = Ractive.extend({
	template: '#rooms-template',

	onconstruct: function() {
		superagent.get('/rooms', _.bind(function(data, response) {
			this.set('rooms', response.body);
			this.set('activeRoom', response.body[0]);
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
		var newRoom = NewRoomComponent({
			el: '#huddle-app',
			append: true
		});
	}
});

module.exports = RoomsComponent;