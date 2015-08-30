var Ractive = require('ractive'),
		superagent = require('superagent');

var LobbyComponent = Ractive.extend({
	template: "#lobby-template",

	data: function() {
		return { 
			rooms: [],
			users: []
		};
	},

	oninit: function() {
		this.observe('req', (req) => {
		});
		
		// Register Events
		this.on('participateRoom', this.participateRoom);

		// Load observables
		superagent.get('/rooms', function(data, response) {
			this.set('rooms', response.body);
		}.bind(this));

		superagent.get('/users', function(data, response) {
			this.set('users', response.body);
		}.bind(this));
	},

	participateRoom: function(event, room) {
		event.original.preventDefault();

		superagent.post(event.node.href).send(room).end(function(err, response) {
		}.bind(this));
	}
});

LobbyComponent._name = 'Lobby';

module.exports = LobbyComponent;