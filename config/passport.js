var LocalStrategy = require('passport-local').Strategy,
		User = require('../app/models/user');

module.exports = function(app, config, passport) {
	// Configure Passport
	passport.use(new LocalStrategy({ usernameField: 'email' },
		function(email, password, done) {
			User.Model.findOne({ email: email}, function(err, user) {
				if (err) return done(err);
				if (!user) return done(null, false, { message: "Incorrect Email or Password provided." });
				if (!user.authenticate(password)) return done(null, false, { message: "Incorrect Email or Password provied."});

				return done(null, user);
			});
		}
	));

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  User.Model.findById(id, function(err, user) {
	    done(err, user);
	  });
	});

	return passport;
};