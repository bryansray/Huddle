
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.raw(
			"CREATE TABLE \"session\" (" +
  		"\"sid\" varchar NOT NULL COLLATE \"default\"," +
			"\"sess\" json NOT NULL," +
			"\"expire\" timestamp(6) NOT NULL" +
			") " +
			"WITH (OIDS=FALSE); " +
			"ALTER TABLE \"session\" ADD CONSTRAINT \"session_pkey\" PRIMARY KEY (\"sid\") NOT DEFERRABLE INITIALLY IMMEDIATE;"
		)
	]);  
};

exports.down = function(knex, Promise) {
  return knex.schema.raw("DROP TABLE IF EXISTS session CASCADE;")
};