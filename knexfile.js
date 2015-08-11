// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    debug: true,
    connection: {
      host: '127.0.0.1',
      user: 'bryanray',
      password: '',
      database: 'huddle_development'
    },
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