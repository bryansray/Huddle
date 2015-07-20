var helper = require('../spec_helper');
var	User = require('../../app/models/user');

describe("User", function() {
	it('should generate a random salt', function () {
		var user = new User.Model({ firstName: "Bryan", lastName: "Ray", password: "testing" });

		console.log(user);
	});
});