
exports.up = function(knex, Promise) {
  return Promise.all([ 
  	knex.schema.createTable('rooms', function(table) {
			table.increments().primary();

			table.string('name');
			table.string('description');

			table.timestamps();
		}),
		knex.insert({ name: "General Discussion", description: "General Discussion Room for the Team."}).into('rooms'),
		knex.insert({ name: "Team Room 1", description: "Team Rooom for Team 1."}).into('rooms'),

		knex.schema.createTable('participants', function(table) {
			table.increments().primary();

			table.integer('user_id').notNullable().references('users.id');
			table.integer('room_id').notNullable().references('rooms.id');

			table.timestamps();
		})
	]);
};

exports.down = function(knex, Promise) {
  return knex.schema.raw("DROP TABLE IF EXISTS rooms, participants CASCADE;");  
};