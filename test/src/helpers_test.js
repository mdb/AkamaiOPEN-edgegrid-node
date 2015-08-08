var assert = require('assert'),
    helpers = require('../../src/helpers');

describe('helpers', function() {
  describe('#base64HmacSha256', function() {
    it('returns a base 64 encoded Hmac Sha256 of the message and key it is passed', function () {
	    assert.equal(helpers.base64HmacSha256('message', 'secret'), 'i19IcCmVwVmMVz2x4hhmqbgl1KeU0WnXBgoDYFeWNgs=');
    });
  });

  describe('#base64Sha256', function() {
    it('returns a base 64 encoded Sha256 of the string it is passed', function () {
	    assert.equal(helpers.base64Sha256('foo'), 'LCa0a2j/xo/5m0U8HTBBNBNCLXBkg7+g+YpeiGJm564=');
    });
  });

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

  describe('#contentHash', function() {
    describe('when the request is not a POST', function() {
      it('returns an empty string', function () {
        assert.equal(helpers.contentHash({
          method: 'GET'
        }), '');

        assert.equal(helpers.contentHash({
          method: 'PUT'
        }), '');
      });
    });

    describe('when the request is a POST', function() {
      it('returns a base64 encoded sha256 of the body', function () {
        assert.equal(helpers.contentHash({
          body: 'foo',
          method: 'POST'
        }), 'LCa0a2j/xo/5m0U8HTBBNBNCLXBkg7+g+YpeiGJm564=');
      });
    });
  });
});
