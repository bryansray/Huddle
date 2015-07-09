var helper = require('../spec_helper');
var Room = require('../../app/models/room'),
		User = require('../../app/models/user');

describe("Room", function() {
	it("should be able to add users to a room.", function() {
		var room = new Room.Model();
		var user = new User.Model();

		room.users.push(user);
		var count = room.users.length;
		count.should.equal(1);
	});

	it("should be able to remove users from a room", function() {
		var room = new Room.Model();
		var user1 = new User.Model(),
				user2 = new User.Model();

		room.addUser(user1).addUser(user2);
		room.removeUser(user1);

		var count = room.users.length;

		count.should.equal(1);
	});

	it("should not error out if you remove a user that isn't in the room", function() {
		var room = new Room.Model();
		var user1 = new User.Model(),
				user2 = new User.Model();

		room.addUser(user1);
		room.removeUser(user2);

		var count = room.users.length;

		count.should.equal(1);
	});

	it("should not add the same user to the room", function() {
		var room = new Room.Model();
		var user1 = new User.Model();

		room.addUser(user1).addUser(user1);

		var count = room.users.length;

		count.should.equal(1);
	});
});