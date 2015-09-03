var helper = require('../spec_helper');
var	User = require('../../app/models/user');

describe("User", function() {
	describe("validations", function() {
		it("should not be valid if you don't provide a password", function() {
			var bryan = User.forge({ firstName: "Bryan", lastName: "Ray" });

			var isValid = bryan.isValid();

			isValid.should.be.false;
		});

		it("should not be valid if you don't provide a first name", function() {
			var bryan = User.forge({ lastName: "Ray", password: "testing" });

			var result = bryan.isValid();

			result.should.be.false;
		});

		it("should not be valid if you don't provide a last name", function() {
			var bryan = User.forge({ firstName: "Bryan", password: "testing" });

			var result = bryan.isValid();

			result.should.be.false;
		});

		it("should not be valid if you don't provide a display name", function() {
			var bryan = User.forge({ firstName: "Bryan", lastName: "Ray", password: "testing" });

			var result = bryan.isValid();

			result.should.be.false;
		});
	});
});