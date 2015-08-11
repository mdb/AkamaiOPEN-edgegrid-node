var assert = require('assert'),
    helpers = require('../../src/helpers');

describe('helpers', function() {
  describe('#arrayIncludes', function() {
    it('returns true if a provided item appears in the provided array', function () {
      assert.equal(helpers.arrayIncludes(1, [2, 1, 3]), true);
    });

    it('returns false if a provided item does not appear in the provided array', function () {
      assert.equal(helpers.arrayIncludes(8, [2, 1, 3]), false);
    });
  });

  describe('#arrayIncludesString', function() {
    it('returns true if a provided item appears in the provided array', function () {
      assert.equal(helpers.arrayIncludesString('foo', ['foo', 'bar']), true);
    });

    it('returns true if a provided item appears in the provided array, independent of case', function () {
      assert.equal(helpers.arrayIncludesString('Foo', ['foo', 'bar']), true);
      assert.equal(helpers.arrayIncludesString('Foo', ['FOO', 'bar']), true);
    });

    it('returns false if a provided item does not appear in the provided array', function () {
      assert.equal(helpers.arrayIncludesString('foo', ['bar', 'baz']), false);
    });
  });

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
    describe('when there are no headers to sign', function() {
      it('returns an empty string', function () {
        assert.equal(helpers.canonicalizeHeaders({
          headers: {
            Foo: 'bar',
            Baz: '  baz\t zoo   '
          }
        }), '');
      });
    });

    describe('when there are no headers to sign', function() {
      it('returns an empty string', function () {
        assert.equal(helpers.canonicalizeHeaders({
          headers: {
            Foo: 'bar',
            Baz: '  baz\t zoo   '
          }
        }), '');
      });
    });

    describe('when the request headers are present in the headers to sign', function() {
      it('canonicalizes the request headers', function () {
        assert.equal(helpers.canonicalizeHeaders({
          headers: {
            Foo: 'bar',
            Baz: '  baz\t zoo   '
          }
        }, ['foo', 'baz']), 'foo:bar\tbaz:baz zoo\t');
      });
    });

    describe('when one of request headers are present in the headers to sign', function() {
      it('canonicalizes the request headers', function () {
        assert.equal(helpers.canonicalizeHeaders({
          headers: {
            Foo: 'bar',
            Baz: '  baz\t zoo   '
          }
        }, ['foo']), 'foo:bar\t');
      });
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

  describe('#dataToSign', function() {
    it('properly formats the request data to sign', function() {
      assert.equal(helpers.dataToSign({
        method: 'get',
        url: 'http://example.com/foo'
      }, 'authHeader'), 'GET\thttp\texample.com\t/foo\t\t\tauthHeader');
    });
  });

  describe('#signingKey', function() {
    it('returns the proper signing key', function() {
      assert.equal(helpers.signingKey('timestamp', 'secret'), 'ydMIxJIPPypuUya3KZGJ0qCRwkYcKrFn68Nyvpkf1WY=')
    });
  });

  describe('#signRequest', function() {
    it('returns the proper request signature', function() {
      assert.equal(helpers.signRequest({
        method: 'GET',
        url: 'http://example.com/foo'
      }, 'timestamp', 'secret', 'auth'), 'signature=JYgCcBLZV63pALRV/zsufws39UPzIJHjPRUa0Uayi/k=');
    });
  });
});
