'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const knex = require('../../src/server/db/knex');
const server = require('../../app');

chai.use(chaiHttp);

describe('routes : auth', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', (done) => {
      chai.request(server)
      .post('/auth/register')
      .send({
        username:'matthew',
        password: 'password123'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('status', 'token');
        res.body.status.should.eql('success');
        done();
      });
    });
    it('should throw an error if username exists', (done) => {
      chai.request(server)
      .post('/auth/register')
      .send({
        username: 'matt',
        password: 'password123'
      })
      .end((err, res) => {
        should.exist(err);
        err.should.have.status(500);
        done();
      });
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user', (done) => {
      chai.request(server)
      .post('/auth/login')
      .send({
        username: 'matt',
        password: 'password123'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('status', 'token');
        res.body.status.should.eql('success');
        done();
      });
    });
    it('should throw an error if password incorrect', (done) => {
      chai.request(server)
      .post('/auth/login')
      .send({
        username: 'matt',
        password: 'password1234'
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(500);
        res.body.should.have.keys('status', 'message');
        res.body.status.should.eql('error');
        res.body.message.should.eql('Invalid username/password');
        done();
      });
    });
  });

  describe('GET /auth/user', () => {
    it('should return a success', (done) => {
      chai.request(server)
      .post('/auth/login')
      .send({
        username: 'matt',
        password: 'password123'
      })
      .end((error, response) => {
        should.not.exist(error);
        chai.request(server)
        .get('/auth/user')
        .set('authorization', 'Bearer ' + response.body.token)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          done();
        });
      });
    });
    it('should throw an error if a user is not logged in', (done) => {
      chai.request(server)
      .get('/auth/user')
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(400);
        res.type.should.eql('application/json');
        res.body.status.should.eql('Please log in');
        done();
      });
    });
  });

});
