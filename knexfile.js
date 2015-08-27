// Update with your config settings.
var config = require('./config/config');

module.exports = {
  development: {
    client: config.db.client,
    connection: config.db.connection,
    debug: true,
    migrations: {
      directory: "db/migrations",
      tableName: "knex_migrations"
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "db/migrations",
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'huddle',
      user:     'bryanray',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "db/migrations",
      tableName: 'knex_migrations'
    }
  }
};