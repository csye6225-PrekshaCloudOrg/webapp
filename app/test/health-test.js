const request = require('supertest');
const assert = require('assert');

describe('Basic Addition Test', function() {
  it('Should return the result of 4 + 4', function(done) {
    const result = 4 + 4;
    assert.strictEqual(result, 10);
    done();
  });
});
