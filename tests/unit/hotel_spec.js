var helper = require('../spec_helper'),
		Hotel = require('../../app/models/hotel'),
		Participants = require('../../app/models/participants'),
		User = require('../../app/models/user'),
		Room = require('../../app/models/room');

describe("Hotel", function() {
	var _hotel;

	beforeEach(function() {
		_hotel = new Hotel();
	});

	it('should be able to instantiate a hotel.', function () {
		_hotel.should.not.be.null;
	});

	it('should be able to open a new room', function() {
		var room = new Room({ id: 1 });
		_hotel.set(room, { participants: new Participants() });

		var roomCount = _hotel.length;

		roomCount.should.equal(1);
	});

	it('should not be able to create the same room multiple times', function () {
		var room = new Room({ id: 1 });
		_hotel.set(room, { participants: new Participants() });
		_hotel.set(room, { participants: new Participants() });

		var count = _hotel.length;

		count.should.equal(1);
	});

	it('should be able to open multiple rooms', function() {
		var room1 = new Room({id: 1}),
				room2 = new Room({id: 2});

		_hotel.set(room1);
		_hotel.set(room2);

		var rooms = _hotel.length;

		rooms.should.equal(2);
	});

	it('should default the room to having zero users', function() {
		var room = new Room({id: 1});

		_hotel.set(room, { participants: new Participants() });
		var users = _hotel.get(room).participants;

		users.length.should.equal(0);
	})

	it('should be able to add a user to a room', function() {
		var user = new User({ id: 1, firstName: "Bryan" })
		var room = new Room( { id: 1 });

		_hotel.set(room, { participants: new Participants() });
		_hotel.checkin(user, room);

		var count = _hotel.get(room).participants.length;

		count.should.equal(1);
	});

	it('should be able to check a user out of a room', function() {
		var user = new User({ id: 1, firstName: "Bryan" })
		var room = new Room( { id: 1 });

		_hotel.set(room, { participants: new Participants() });
		_hotel.checkin(user, room);
		_hotel.checkout(user, room);

		var count = _hotel.get(room).participants.length;

		count.should.equal(0);
	});

	it('should be able to add a user to a multiple rooms', function() {
		var room1 = new Room({ id: 1, name: "Room 1" }),
				room2 = new Room({ id: 2, name: "Room 2" }),
				user = new User({ id: 1, firstName: "Bryan" }),
				curtis = new User({ id: 2, firstName: "Curtis" });

		_hotel.set(room1, { participants: new Participants() });
		_hotel.set(room2, { participants: new Participants() });

		_hotel.checkin(user, room1).checkin(user, room2).checkin(curtis, room2);

		var room1Count = _hotel.get(room1).participants.length;
		var room2Count = _hotel.get(room2).participants.length;

		room1Count.should.equal(1);
		room2Count.should.equal(2);
	});
});