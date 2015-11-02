var assert = require('assert'),
    helpers = require('../src/helpers.js'),
    auth = require('../src/auth.js'),
    baseUrl = 'https://akaa-baseurl-xxxxxxxxxxx-xxxxxxxxxxxxx.luna.akamaiapis.net/',
    accessToken = 'akab-access-token-xxx-xxxxxxxxxxxxxxxx',
    clientToken = 'akab-client-token-xxx-xxxxxxxxxxxxxxxx',
    clientSecret = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=',
    nonce = 'nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    timestamp = '20140321T19:34:21+0000',
    testAuth = null,
    expected = function(signature) {
      return 'EG1-HMAC-SHA256 client_token=akab-client-token-xxx-xxxxxxxxxxxxxxxx;access_token=akab-access-token-xxx-xxxxxxxxxxxxxxxx;timestamp=20140321T19:34:21+0000;nonce=nonce-xx-xxxx-xxxx-xxxx-xxxxxxxxxxxx;signature=' + signature;
    },
    buildReq = function(config) {
      return helpers.extend(config, {
        path: 'testapi/v1/t3',
        method: 'GET'
      });
    };

describe('#generateAuth', function() {
  describe('a simple GET', function() {
    it('returns the expected authorization header string', function() {
      testAuth = auth.generateAuth(buildReq({
        path: ''
      }), clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);

      assert.equal(testAuth.headers.Authorization, expected('tL+y4hxyHxgWVD30X3pWnGKHcPzmrIF+LThiAOhMxYU='));
    });
  });

  describe('a GET with a querystring', function() {
    it('returns the expected authorization header string', function() {
      testAuth = auth.generateAuth(buildReq({
        path: 'testapi/v1/t1?p1=1&p2=2',
      }), clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);

      assert.equal(testAuth.headers.Authorization, expected('hKDH1UlnQySSHjvIcZpDMbQHihTQ0XyVAKZaApabdeA='));
    });
  });

  describe('a POST inside the body length limit', function() {
    it('returns the expected authorization header string', function() {
      testAuth = auth.generateAuth(buildReq({
        method: 'POST',
        body: 'datadatadatadatadatadatadatadata'
      }), clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);

      assert.equal(testAuth.headers.Authorization, expected('hXm4iCxtpN22m4cbZb4lVLW5rhX8Ca82vCFqXzSTPe4='));
    });
  });

  describe('a POST whose body is too large', function() {
    it('returns the expected authorization header string', function() {
      testAuth = auth.generateAuth(buildReq({
        method: 'POST',
        body: 'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'
      }), clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);

      assert.equal(testAuth.headers.Authorization, expected('6Q6PiTipLae6n4GsSIDTCJ54bEbHUBp+4MUXrbQCBoY='));
    });
  });

  describe('a POST whose length equals the maximum permitted body length', function() {
    it('returns the expected authorization header string', function() {
      testAuth = auth.generateAuth(buildReq({
        method: 'POST',
        body: 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'
      }), clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);

      assert.equal(testAuth.headers.Authorization, expected('6Q6PiTipLae6n4GsSIDTCJ54bEbHUBp+4MUXrbQCBoY='));
    });
  });

  describe('a POST with an empty body', function() {
    it('returns the expected authorization header string', function() {
      testAuth = auth.generateAuth(buildReq({
        path: 'testapi/v1/t6',
        method: 'POST',
        body: ''
      }), clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);

      assert.equal(testAuth.headers.Authorization, expected('1gEDxeQGD5GovIkJJGcBaKnZ+VaPtrc4qBUHixjsPCQ='));
    });
  });

  describe('a simple GET with an explicit header', function() {
    it('returns the expected authorization header string', function() {
      testAuth = auth.generateAuth(buildReq({
        path: 'testapi/v1/t4',
        headers: {
          'X-Test1': 'test-simple-header'
        }
      }), clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);

      assert.equal(testAuth.headers.Authorization, expected('8F9AybcRw+PLxnvT+H0JRkjROrrUgsxJTnRXMzqvcwY='));
    });
  });

  describe('a request with headers containing spaces', function() {
    it('returns the expected authorization header string', function() {
     testAuth = auth.generateAuth(buildReq({
        path: 'testapi/v1/t4',
        headers: {
          'X-Test1': '"     test-header-with-spaces     "'
        }
      }), clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);

      assert.equal(testAuth.headers.Authorization, expected('ucq2AbjCNtobHfCTuS38fdkl5UDdWHZhQX46fYR8CqI='));
    });
  });

  describe('a request with headers containing leading and interior spaces', function() {
    it('returns the expected authorization header string', function() {
      testAuth = auth.generateAuth(buildReq({
        path: 'testapi/v1/t4',
        headers: {
          'X-Test1': '     first-thing      second-thing'
        }
      }), clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);

      assert.equal(testAuth.headers.Authorization, expected('WtnneL539UadAAOJwnsXvPqT4Kt6z7HMgBEwAFpt3+c='));
    });
  });

  describe('a PUT', function() {
    it('returns the expected authorization header string', function() {
      testAuth = auth.generateAuth(buildReq({
        path: 'testapi/v1/t6',
        method: 'PUT',
        body: 'PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP'
      }), clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);

      assert.equal(testAuth.headers.Authorization, expected('GNBWEYSEWOLtu+7dD52da2C39aX/Jchpon3K/AmBqBU='));
    });
  });
});
