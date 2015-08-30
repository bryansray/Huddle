var superagent = require('superagent'),
		Promise = require('bluebird');

class Room {
	constructor(attributes) {

	}

	static findById(id) {
		let url = "/rooms/" + id;

		return new Promise((resolve) => {
			superagent.get(url).set('X-Requested-With', 'XMLHttpRequest')
				.end(function(err, response) {
					resolve(response.body);
				});
		});
	}
}

module.exports = Room;