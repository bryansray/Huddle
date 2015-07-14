module.exports = {
	app: {
		title: "Huddle",
		description: "A small chat application for small to medium sized teams.",
		keywords: ""
	},

	port: process.env.PORT || 3000,
	
	session: {
		options: {
			secret: "huddle_secret",
			resave: false,
			saveUninitialized: false,
			cookie: { secure: false }
		}
	}
};