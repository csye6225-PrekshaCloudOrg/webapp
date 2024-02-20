const request = require('supertest');
const assert = require('assert');
const { app, server } = require('../../server'); 

describe('GET /healthz', () => {
  it('should return status 200 if database connection is successful', (done) => {
    request(app)
      .get('/healthz')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

//Test case for POST - register user
describe('POST /v1/user', () => {
  it('should create a new user', (done) => {
    const userData = {
      "first_name": "Jane",
      "last_name": "Doe",
      "password": "Password123",
      "username": "user12345@gmail.com"
    };

    request(app)
      .post('/v1/user')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /v1/user/self', () => {
  it('should retrieve user information with basic authentication', (done) => {
    const authHeader = 'Basic dXNlcjEyMzQ1QGdtYWlsLmNvbTpQYXNzd29yZDEyMw==';

    request(app)
      .get('/v1/user/self')
      .set('Authorization', authHeader)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.first_name, 'Jane');
        assert.strictEqual(res.body.last_name, 'Doe');
        done();
      });
  });
});

describe('PUT /v1/user/self', () => {
  it('should update user information with basic authentication', (done) => {
    const authHeader = 'Basic dXNlcjEyMzQ1QGdtYWlsLmNvbTpQYXNzd29yZDEyMw==';
    const userData = {
      "first_name": "Preksha",
      "last_name": "Yadav",
      "password": "Password123456"
    };

    request(app)
      .put('/v1/user/self')
      .set('Authorization', authHeader)
      .set('Content-Type', 'application/json')
      .send(userData)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /v1/user/self', () => {
  it('should retrieve user information with basic authentication', (done) => {
    const authHeader = 'Basic dXNlcjEyMzQ1QGdtYWlsLmNvbTpQYXNzd29yZDEyMzQ1Ng==';

    request(app)
      .get('/v1/user/self')
      .set('Authorization', authHeader)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.first_name, 'Preksha');
        assert.strictEqual(res.body.last_name, 'Yadav');
        done();
      });
  });
});

// Close the server after all tests have run
after((done) => {
  server.close(() => {
    console.log('Server closed');
    done();
  });
});
