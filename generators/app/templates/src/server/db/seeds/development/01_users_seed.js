'use strict';

const bcrypt = require('bcryptjs');

exports.seed = function(knex, Promise) {
  return knex('users').del() // Deletes ALL existing entries
    .then(function() { // Inserts seed entries one by one in series
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('password123', salt);
      return knex('users').insert({
        id: 1,
        username: 'chris',
        password: hash,
        is_admin: true
      });
    }).then(function () {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('password123', salt);
      return knex('users').insert({
        id: 2,
        username: 'ari',
        password: hash,
        is_admin: false
      });
    }).then(function () {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('password123', salt);
      return knex('users').insert({
        id: 3,
        username: 'matt',
        password: hash,
        is_admin: false
      });
    }).then(function () {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('password123', salt);
      return knex('users').insert({
        id: 4,
        username: 'liz',
        password: hash,
        is_admin: false
      });
    }).then(function () {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('password123', salt);
      return knex('users').insert({
        id: 5,
        username: 'laura',
        password: hash,
        is_admin: false
      });
    }).then(() => {
      return knex.raw("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");
    });
};
