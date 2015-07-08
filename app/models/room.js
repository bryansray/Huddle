var mongoose = require('mongoose');

var schema = mongoose.Schema({
	name: String,
	description: String
});

var Room = mongoose.model('room', schema);

module.exports = Room;