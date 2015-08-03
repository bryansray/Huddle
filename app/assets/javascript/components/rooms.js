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

	data: function() {
		return {
			rooms: [],
			activeRoom: null
		};
	},

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
		this.on('loadChat', this.loadRoom);
		this.on('newRoom', this.newRoom);

		window.onpopstate = _.bind(function(event) {
			if (!event.state && !event.state.room) return;
			console.log("popstate: ", event.state);

			var rooms = this.get('rooms'),
					room = _.find(rooms, function(room) { return room.id === event.state.room.id });

			document.title = event.state.title;

			this.set('activeRoom', room);
		}, this);
	},

	oncomplete: function() {
		console.log("Completing RoomsComponent.");
	},

	loadRoom: function(event, room) {
		var title = "Huddle .:. " + room.name;
		document.title = title;
		history.pushState({ room: room, title: title }, room.name, event.node.href);

		this.set('activeRoom', room);
		event.original.preventDefault();
	},

	newRoom: function(event) {
		var newRoom = NewRoomComponent({
			el: '#huddle-app',
			append: true
		});
	}
});

module.exports = RoomsComponent;