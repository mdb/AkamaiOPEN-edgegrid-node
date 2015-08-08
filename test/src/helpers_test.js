var assert = require('assert'),
    helpers = require('../../src/helpers');

describe('helpers', function() {
  describe('#canonicalizeHeaders', function() {
    it('canonicalizes the request headers', function () {
      assert.equal(helpers.canonicalizeHeaders({
        headers: {
          Foo: 'bar',
          Baz: '  baz\t zoo   '
        }
      }), 'foo:bar\tbaz:baz zoo\t');
    });
  });

  describe('#base64HmacSha256', function() {
    it('returns a base 64 encoded Hmac Sha256 of the message and key it is passed', function () {
	    assert.equal(helpers.base64HmacSha256('message', 'secret'), 'i19IcCmVwVmMVz2x4hhmqbgl1KeU0WnXBgoDYFeWNgs=');
    });
  });
});
