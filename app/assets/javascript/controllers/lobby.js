let Lobby = require('components/lobby')

exports.index = function(context, next) {
	return next(null, Lobby, { rooms: [] });
};