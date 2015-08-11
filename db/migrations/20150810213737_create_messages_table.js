
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('messages', function(table) {
			table.increments().primary();
			
			table.integer('user_id').references('users.id');
			table.integer('room_id').references('rooms.id');
			
			table.text('original');
			table.text('html');

			// table.specificType('tags', 'text[]');

			table.timestamps();
		}),

		knex.schema.createTable('tags', function(table) {
			table.increments().primary();

			table.string('name');

			table.timestamps();
		}),

		knex.schema.createTable('messages_tags', function(table) {
			table.increments().primary();

			table.integer('message_id').references('messages.id');
			table.integer('tag_id').references('tags.id');

			table.timestamps();
		})
	]); 
};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.raw("DROP TABLE IF EXISTS messages, tags, messages_tags CASCADE;")
  ]);
};