var helper = require('../spec_helper');
var	User = require('../../app/models/user');

describe("User", function() {
	describe("validations", function() {
		it("should not be valid if you don't provide a password", function() {
			var bryan = User.forge({ firstName: "Bryan" });

			var isValid = bryan.isValid();

			isValid.should.be.false;
		});
	});
});