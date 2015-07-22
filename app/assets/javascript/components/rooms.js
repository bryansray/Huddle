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
		console.log("Constructing RoomsComponent.");
		superagent.get('/rooms', _.bind(function(data, response) {
			this.set('rooms', response.body);
			if (typeof _preloadedRoomId !== 'undefined') {
				var room = _.find(response.body, function(room) { return room.id === _preloadedRoomId; });
				this.set('activeRoom', room);
			}
		}, this));
	},

	oninit: function() { 
		console.log("Initializing RoomsComponent.");
		this.on('loadRoom', this.loadRoom);
		this.on('newRoom', this.newRoom);
	},

	oncomplete: function() {
		console.log("Completing RoomsComponent.");
	},

	loadRoom: function(event, room) {
		history.pushState(room, room.name, event.node.href);
		this.set('activeRoom', room);
		return false;
	},

	newRoom: function(event) {
		var newRoom = NewRoomComponent({
			el: '#huddle-app',
			append: true
		});
	}
});

module.exports = RoomsComponent;