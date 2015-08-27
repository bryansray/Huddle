module.exports = {
	db: {
		client: 'pg',
		connection: {
			host: '127.0.0.1',
			user: 'bryanray',
			password: '',
			database: 'huddle',
			charset: 'utf8'
		},
		pool: {
	    min: 0,
	    max: 10
	  }
	}
};