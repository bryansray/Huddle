var handleError = function(err) {

};

exports.up = function(knex, Promise) {
	// Create the [users] table
	return Promise.all([
		knex.schema.createTable('users', function(table) {
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
		})
	]);
};

exports.down = function(knex, Promise) {
	return knex.schema.raw("DROP TABLE IF EXISTS users CASCADE;");  
};
