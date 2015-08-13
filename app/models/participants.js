var FastSet = require('collections/fast-set');

class Participants extends FastSet {
	constructor() {
		var compareEquals = function(a, b) { return a.id === b.id };
		var compareHash = function(object) { return object.id.toString() };

		super();
	}
}

module.exports = Participants;