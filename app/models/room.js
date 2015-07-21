var Bookshelf = require('../../config/bookshelf');
console.log("Room.JS ...");

var Room = Bookshelf.Model.extend({
	tableName: 'rooms',
	
	initialize: function() {
		// console.log("Initializing Room ...");
	},

	messages: function() {
		return this.hasMany('Message');
	}
});

module.exports = Bookshelf.model('Room', Room);
// // var mongoose = require('mongoose');

// var schema = mongoose.Schema({
// 	name: String,
// 	description: String,
// 	users: [mongoose.Schema.Types.ObjectId],
// 	messages: []
// });

// schema.methods.addUser = function(user) {
// 	var index = this.users.indexOf(user.id);
// 	if (index === -1)
// 		this.users.push(user.id);

// 	return this;
// };

// schema.methods.removeUser = function(user) {
// 	var index = this.users.indexOf(user.id);
// 	if (index > -1) 
// 		this.users.splice(index, 1);
	
// 	return this;
// };

// schema.methods.addMessage = function(user, message) {
// 	this.messages[message.id] = { user: user, message: message };
// };

// var Room = mongoose.model('room', schema);

// module.exports = {
// 	Schema: schema,
// 	Model: Room
// };