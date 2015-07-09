var mongoose = require('mongoose');

var schema = mongoose.Schema({
});

var Message = mongoose.model('message', schema);

module.exports = {
	Schema: schema,
	Model: Message,
};