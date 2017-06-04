'use strict';

const bcrypt = require('bcryptjs');
const queries = require('../queries');
const knex = require('../knex');
const localAuth = require('./local');

function loginUser(username) {
  return knex('users').where({username}).first();
}

function createUser(req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);

  return queries.addUser({ username: req.body.username, password: hash })
  .returning('*');
}

function comparePass(userPassword, databasePassword) {
  const bool = bcrypt.compareSync(userPassword, databasePassword);

  if (!bool) return false;
  else return true;
}


function ensureAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({
      status: 'Please log in'
    });
  }
  // decode the token
  var header = req.headers.authorization.split(' ');
  var token = header[1];
  localAuth.decodeToken(token, (err, payload) => {
    if (err) {
      return res.status(401).json({
        status: 'Token has expired'
      });
    } else {
      // check if the user still exists in the db
      return queries.getSingleUser(payload.sub.id).first()
      .then((user) => {
        next();
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error'
        });
      });
    }
  });
}

module.exports = {
  comparePass: comparePass,
  createUser: createUser,
  loginUser: loginUser,
  ensureAuthenticated: ensureAuthenticated
}
