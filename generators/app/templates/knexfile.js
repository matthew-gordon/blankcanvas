'use strict';

const databaseName = '<%- database %>';

module.exports = {
  development: {
    client: 'pg',
    connection: `postgresql://localhost/${databaseName}`,
    migrations: {
      directory: __dirname + '//src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds/development'
    }
  },

  test: {
    client: 'pg',
    connection: `postgresql://localhost/${databaseName}_test`,
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds/test'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds/production'
    }
  }
}
