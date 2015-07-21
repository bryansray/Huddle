var LocalStrategy = require('passport-local').Strategy,
		User = require('../app/models/user');

module.exports = function(app, config, passport) {
	// Configure Passport
	passport.use(new LocalStrategy({ usernameField: 'email' },
		function(email, password, done) {
			new User({ email: email}).fetch().then(function(user) {
				if (!user) return done(null, false, { message: "Incorrect Email or Password provided." });
				if (!user.authenticate(password)) return done(null, false); //, { message: "Incorrect Email or Password provied."});

				done(null, user);
			}).catch(function(err) { return done("ERROR: ", err); });
		}
	));

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	  new User({ id: id }).fetch().then(function(user) {
	    done(null, user);
	  });
	});

	return passport;
};