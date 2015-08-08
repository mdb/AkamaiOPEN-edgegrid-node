var assert = require('assert'),
    helpers = require('../../src/helpers');

describe('helpers', function() {
  describe('#canonicalizeHeaders', function() {
    assert.equal(helpers.canonicalizeHeaders({
      headers: {
        Foo: 'bar',
        Baz: '  baz\t zoo   '
      }
    }), 'foo:bar\tbaz:baz zoo\t');
  });
});
