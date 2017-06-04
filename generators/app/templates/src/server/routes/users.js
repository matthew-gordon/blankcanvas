'use stirct';

const express = require('express');
const router = express.Router();
const queries = require('../db/queries');

// *** GET all users *** //

router.get('/', (req, res, next) => {
  queries.getAll()
  .then((users) => {
    res.status(200).json({
      status: 'success',
      data: users
    });
  })
  .catch((err) => {
    next(err);
  });
});

// *** GET single user by id *** //
router.get('/:id', (req, res, next) => {
  queries.getSingleUser(req.params.id)
  .then((user) => {
    res.status(200).json({
      status: 'success',
      data: user
    })
  })
  .catch((err) => {
    next(err);
  });
});

// *** POST create new user *** //
router.post('/', (req, res, next) => {
  queries.addUser(req.body)
  .then((userID) => {
    return queries.getSingleUser(userID);
  })
  .then((user) => {
    res.status(200).json(user);
  })
  .catch((err) => {
    next(err);
  });
});

// *** PUT update a user by id *** //
router.put('/:id', (req, res, next) => {
  queries.updateUser(req.params.id, req.body)
  .then((userID) => {
    return queries.getSingleUser(req.params.id);
  })
  .then((user) => {
    res.status(200).json(user);
  })
  .catch((err) => {
    next(err);
  });
});

// *** DELETE user by id *** //
router.delete('/:id', (req, res, next) => {
  queries.getSingleUser(req.params.id)
  .then((user) => {
    queries.deleteUser(req.params.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    });
  })
  .catch((err) => {
    next(err);
  })
});

module.exports = router;
