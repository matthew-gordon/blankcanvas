'use strict';

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const knex = require('../../src/server/db/knex');
const server = require('../../app');

chai.use(chaiHttp);

describe('routes : users', () => {

  beforeEach(() => {
    return knex.migrate.rollback()
    .then(() => { return knex.migrate.latest(); })
    .then(() => { return knex.seed.run(); });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /users', () => {
    it('should return all users', (done) => {
      chai.request(server)
      .get('/users')
      .end((err, res) => {
        should.not.exist(err);
        res.type.should.eql('application/json');
        res.status.should.eql(200);
        res.body.status.should.eql('success');
        res.body.data.length.should.eql(5);
        res.body.data[0].should.have.property('username');
        res.body.data[0].username.should.eql('chris');
        res.body.data[0].should.have.property('is_admin');
        res.body.data[0].is_admin.should.eql(true);
        done();
      });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a single user by id', (done) => {
      chai.request(server)
      .get('/users/2')
      .end((err, res) => {
        should.not.exist(err);
        res.type.should.eql('application/json');
        res.status.should.eql(200);
        res.body.status.should.eql('success');
        res.body.data.should.have.property('username');
        res.body.data.username.should.eql('ari');
        res.body.data.should.have.property('is_admin');
        res.body.data.is_admin.should.eql(false);
        done();
      });
    });
  });

  describe('POST /users', () => {
    it('should create a new user', (done) => {
      chai.request(server)
      .post('/users')
      .send({
        username: 'Mateo Gordo',
        password: 'hash'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.type.should.eql('application/json');
        res.status.should.eql(200);
        res.body.should.have.property('username');
        res.body.username.should.eql('Mateo Gordo');
        res.body.is_admin.should.eql(false);
        done();
      });
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user by id', (done) => {
      chai.request(server)
      .put('/users/3')
      .send({
        username: 'harry',
        password: 'notthebird'
      })
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.type.should.eql('application/json');
        res.body.should.have.property('username');
        res.body.username.should.eql('harry');
        res.body.should.have.property('password');
        res.body.password.should.eql('notthebird');
        done();
      });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a single user by id', (done) => {
      chai.request(server)
      .delete('/users/2')
      .end((error, response) => {
        should.not.exist(error);
        response.should.have.status(200);
        response.type.should.eql('application/json');
        chai.request(server)
        .get('/users')
        .end((err, res) => {
          should.not.exist(err);
          res.type.should.eql('application/json');
          res.body.data.length.should.eql(4);
          done();
        });
      });
    });
  });

});
