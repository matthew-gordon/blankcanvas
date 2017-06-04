'use strict';

const knex = require('../db/knex');
const express = require('express');
const router = express.Router();
const authHelpers = require('../db/auth/_helpers');
const localAuth = require('../db/auth/local');

router.post('/register', (req, res, next)  => {
  return authHelpers.createUser(req)
  .then((response) => {
    return localAuth.encodeToken(response[0]);
  })
  .then((token) => {
    res.status(200).json({
      status: 'success',
      token: token
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error',
      message: 'username already exists'
    });
  });
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  return authHelpers.loginUser(username)
  .then((response) => {
    const bool = authHelpers.comparePass(password, response.password);
    if(bool) return response;
    else return next();
  })
  .then((response) => { return localAuth.encodeToken(response); })
  .then((token) => {
    res.status(200).json({
      status: 'success',
      token: token
    });
  })
  .catch((err) => {
    res.status(500).json({
      status: 'error',
      message: 'Invalid username/password'
    });
  });
});

router.get('/user',
  authHelpers.ensureAuthenticated,
  (req, res, next)  => {
  res.status(200).json({
    status: 'success'
  });
});

module.exports = router;
