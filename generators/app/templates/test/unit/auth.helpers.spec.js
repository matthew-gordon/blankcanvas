'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const knex = require('../../src/server/db/knex');
const bcrypt = require('bcryptjs');
const server = require('../../app');

const authHelpers = require('../../src/server/db/auth/_helpers');

chai.use(chaiHttp);

describe('auth : helpers', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); })
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });
  
  describe('comparePass()', () => {
    it('should return true if the password is correct', (done) => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('test', salt);
      const results = authHelpers.comparePass('test', hash);
      should.exist(results);
      results.should.eql(true);
      done();
    });
    it('should return false if password is incorrect', (done) => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('test', salt);
      const results = authHelpers.comparePass('testing', hash);
      should.exist(results);
      results.should.eql(false);
      done();
    });
    it('should return false if password is empty', (done) => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('test', salt);
      const results = authHelpers.comparePass('', hash);
      should.exist(results);
      results.should.eql(false);
      done();
    });
  });

});
