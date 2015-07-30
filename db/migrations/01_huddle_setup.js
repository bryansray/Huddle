var config = {
	client: 'pg',
	debug: true,
	connection: {
		host: '127.0.0.1',
		user: 'bryanray',
		password: '',
		database: 'huddle'
	},

	migrations: {
		tableName: 'migrations'
	}
};

var knex = require('knex')(config);

var handleError = function(err) {
	console.log("error: ", err);
};

knex.schema.raw("DROP TABLE IF EXISTS users, messages, tags, rooms, messages_tags CASCADE;").catch(handleError);

knex.schema.createTable('users', function(table){
	table.increments().primary();
	
	table.string('firstName');
	table.string('lastName');
	table.string('displayName');
	table.string('email');
	table.string('salt');
	table.string('password');

	table.string('resetPasswordToken');
	table.dateTime('resetPasswordExpirationDate');

	table.timestamps();
}).catch(handleError);

knex.schema.createTable('rooms', function(table) {
	table.increments().primary();

	table.string('name');
	table.string('description');

	table.timestamps();
}).catch(handleError);

knex.schema.createTable('messages', function(table) {
	table.increments().primary();
	
	table.integer('user_id').references('users.id');
	table.integer('room_id').references('rooms.id');
	
	table.text('original');
	table.text('html');

	// table.specificType('tags', 'text[]');

	table.timestamps();
})
.then(function(table) {
	knex('rooms').insert({ name: "General Discussion", description: "General Discussion Room for the Team."}).catch(handleError);
})
.then(function() {
	knex.schema.createTable('tags', function(table) {
		table.increments().primary();

		table.string('name');

		table.timestamps();
	}).catch(handleError);

	knex.schema.createTable('messages_tags', function(table) {
		table.increments().primary();

		table.integer('message_id').references('messages.id');
		table.integer('tag_id').references('tags.id');

		table.timestamps();
	}).catch(handleError);

}).catch(handleError);