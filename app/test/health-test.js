const supertest = require('supertest');
const app = require('../../server');

var assert = require('assert');

describe('Testing our application', function(){
    it('GET /healthz end point of the application to test sequelize', (done) => {
        supertest(app)
        .get('/healthz')
        .expect(200)
        .end((err, response) => {
            if (err) return done(err)
            return done()
        })
    })
});
