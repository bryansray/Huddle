var mongoose = require('mongoose');

var schema = mongoose.Schema({
	name: String,
	description: String
});

var Channel = mongoose.model('Channel', schema);

module.exports = Channel;