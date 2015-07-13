var LocalStrategy = require('passport-local').Strategy,
		User = require('../app/models/user');

module.exports = function(app, config, passport) {
	console.log("Configuring Passport ...");

	// Configure Passport
	passport.use(new LocalStrategy({ usernameField: 'email' },
		function(email, password, done) {
			console.log("Executing verification callback: ", arguments);
			User.Model.findOne({ email: email}, function(err, user) {
				console.log(err, user);
				if (err) return done(err);
				if (!user) return done(null, false, { message: "Incorrect Email or Password provided." });
				if (!user.validatePassword(password)) return done(null, false, { message: "Incorrect Email or Password provied."});

				return done(null, user);
			});
		}
	));

	passport.serializeUser(function(user, done) {
		console.log("Serializing user: ", arguments);
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		console.log("Deserializing user: ", arguments);
	  User.Model.findById(id, function(err, user) {
	    done(err, user);
	  });
	});

	return passport;
};