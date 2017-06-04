'use strict';

const knex = require('./knex');

// *** query helper *** //

function users() {
  return knex('users');
}

// *** queries *** //

function getAll() {
  return users().select();
}

function getSingleUser(userID) {
  return users().where('id', parseInt(userID)).first();
}

function addUser(user) {
  return users().insert(user, 'id');
}

function updateUser(userID, updates) {
  return users().where('id', parseInt(userID)).update(updates);
}

function deleteUser(userID) {
  return users().where('id', parseInt(userID)).del();
}

module.exports = {
  getAll: getAll,
  getSingleUser: getSingleUser,
  addUser: addUser,
  updateUser: updateUser,
  deleteUser: deleteUser
}
