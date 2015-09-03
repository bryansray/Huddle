var Bookshelf = require('../../config/bookshelf'),
		validate = require('validate.js');

var Room = Bookshelf.Model.extend({
	tableName: 'rooms',
	hasTimestamps: true,
		
	initialize: function() {
		this.on('saving', this.validateSave);
	},

	validations: {
		name: { presence: true }
	},

	messages: function() {
		return this.hasMany('Message');
	},

	users: function() {
		return this.belongsToMany('User').through('Participant');
	},

	isValid: function() {
		return validate(this.attributes, this.validations) === undefined;
	},

	validateSave: function(model, attrs, options) {
		return validate.async(attrs, this.validations);
	}
});

module.exports = Bookshelf.model('Room', Room);