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

knex.schema.dropTableIfExists('users').catch(function() {});
knex.schema.dropTableIfExists('messages').catch(function(){});
knex.schema.dropTableIfExists('rooms').catch(function(err) { console.log("error: ", err); });

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
}).catch(function(err) {
	console.log(err);
})

knex.schema.createTable('rooms', function(table) {
	console.log("Creating table ...");
	table.increments().primary();
	table.string('name');
	table.string('description');
	table.timestamps();
}).then(function() {
	// Insert a Row ...
	knex.insert({ name: "General Discussion", description: "A channel for general discussion." }).into('rooms').catch(function(err) { console.log("error: ", err); });
}).catch(function(err) {
	console.log("ERROR: ", err);
});

knex.schema.createTable('messages', function(table) {
	table.increments().primary();
	table.integer('user_id').references('users.id');
	table.integer('room_id').references('rooms.id');
	table.text('original');
	table.text('html');
	table.timestamps();
}).catch(function(err) { console.log("error: ", err); });