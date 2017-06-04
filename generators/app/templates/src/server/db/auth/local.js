'use strict';

const jwt = require('jsonwebtoken');
const moment = require('moment');

function encodeToken(user) {
  const secret = process.env.TOKEN_SECRET;
  const payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: {
      id: user.id,
      username: user.username,
      is_admin: user.is_admin
    }
  };
  return jwt.sign(payload, secret, {});
}

function decodeToken(token, callback) {
  const payload = jwt.decode(token, process.env.TOKEN_SECRET);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
}

module.exports = {
  encodeToken: encodeToken,
  decodeToken: decodeToken
}
