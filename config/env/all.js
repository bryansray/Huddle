module.exports = {
	app: {
		title: "Huddle",
		description: "A chat application for small to medium sized teams.",
		keywords: ""
	},

	port: process.env.PORT || 3000,
	environment: process.env.NODE_ENV || 'development',
	
	session: {
		options: {
			secret: "huddle_secret",
			resave: false,
			saveUninitialized: false,
			cookie: { secure: false }
		}
	}
};