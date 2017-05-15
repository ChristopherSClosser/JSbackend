'use strict';

const server = require('../server');
const chai = require('chai');
const http = require('chai-http');
const expect = chai.expect;
const User = require('../model/user');
const Dev = require('../model/dev');
const mockUser = new User({username: 'jimmy', email: 'jimmy@jimmy.com', password: 'secret', isDev: true});
const mockDev = new Dev({username: mockUser.username});

chai.use(http);

describe('server module', function() {
  let app;
  before(done => {
    app = server.listen(5000);
    done();
  });
  after(done => {
    app.close();
    done();
  });
  describe('an unregistered route', function() {
    it('should return a 404 status code', done => {
      chai.request(server)
      .post('/api/badRoute')
      .end((err, res) => {
        if(err) console.error(err);
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
});
