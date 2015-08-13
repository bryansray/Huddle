var helper = require('../spec_helper');

var Bookshelf = require('../../config/bookshelf');

var Room = require('../../app/models/room'),
		Participant = require('../../app/models/participant'),
		User = require('../../app/models/user'),
		Message = require('../../app/models/message');

describe.skip("Room", function() {
	describe("user management", function() {
		it("should be able to add users to a room.", function() {
			var user = new User();
			var room = Room.forge({ name: "Room 1", description: "This is the room." }).related('users').attach(user);

			// room.addUsers({ name: "Bryan" });

			// var users = room.users().attach({ id: 1, name: "Bryan" });
			//users.add({ name: "Bryan" });

			console.log(room.users.length);

			// room.users.push(user);
			// var count = room.users.length;
			// count.should.equal(1);
		});

		it("should be able to remove users from a room", function() {
			var user1 = new User( { id: 1 }),
					user2 = new User();

			var room = new Room().related('users').attach([user1.id]);

			var count = room.get('users').length;

			count.should.equal(1);
		});

		it("should not error out if you remove a user that isn't in the room", function() {
			var room = new Room();
			var user1 = new User(),
					user2 = new User();

			room.addUser(user1);
			room.removeUser(user2);

			var count = room.users.length;

			count.should.equal(1);
		});

		it("should not add the same user to the room", function() {
			var room = new Room();
			var user1 = new User();

			room.addUser(user1).addUser(user1);

			var count = room.users.length;

			count.should.equal(1);
		});
	});

	describe("message management", function() {
		it.skip("should be able to add a message to the channel", function() {
			var room = new Room(),
					user = new User(),
					message = new Message();

			room.addMessage(user, message);

			var count = room.messages.length;

			count.should.equal(1);
		});
	});
});