var routes = new Map();

var lobby = require('controllers/lobby'),
		rooms = require('controllers/rooms');

routes.set('/', lobby.index);
routes.set('/chat/lobby', lobby.index);

routes.set('/rooms/:id', rooms.show);

module.exports = routes;