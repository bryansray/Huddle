var Map = require('collections/map');

class Concierge {
	constructor(hotel) {
		this.hotel = hotel;
	}

	checkin(user, room) {
		var r = this.hotel.get(room);
		r.participants.add(user);

		return this;
	}

	checkout(user, room) {
		var r = this.hotel.get(room);
		r.participants.remove(user);

		return this;
	}
}

class Hotel extends Map {
	constructor(options) {
		super();

		this.concierge = new Concierge(this);
	}

	checkin(user, room) {
		this.concierge.checkin(user, room);

		return this;
	}

	checkout(user, room) {
		this.concierge.checkout(user, room);
		return this;
	}
}

module.exports = Hotel;