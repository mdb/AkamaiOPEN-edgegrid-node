var assert = require('assert'),
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
    };

describe('#generateAuth', function() {
  describe('a simple GET', function() {
    it('returns the expected authorization header string', function() {
      var request = {
        //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
        "path": "",
        "method": "GET"
      };

      testAuth = auth.generateAuth(request, clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);
      assert.equal(testAuth.headers.Authorization, expected('tL+y4hxyHxgWVD30X3pWnGKHcPzmrIF+LThiAOhMxYU='));
    });
  });

  describe('a GET with a querystring', function() {
    it('returns the expected authorization header string', function() {
      var request = {
        //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
        "path": "testapi/v1/t1?p1=1&p2=2",
        "method": "GET"
      };

      testAuth = auth.generateAuth(request, clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);
      assert.equal(testAuth.headers.Authorization, expected('hKDH1UlnQySSHjvIcZpDMbQHihTQ0XyVAKZaApabdeA='));
    });
  });

  describe('a POST inside the body length limit', function() {
    it('returns the expected authorization header string', function() {
      var request = {
        //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
        "path": "testapi/v1/t3",
        "method": "POST",
        "body": 'datadatadatadatadatadatadatadata'
      };

      testAuth = auth.generateAuth(request, clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);
      assert.equal(testAuth.headers.Authorization, expected('hXm4iCxtpN22m4cbZb4lVLW5rhX8Ca82vCFqXzSTPe4='));
    });
  });

  describe('a POST whose body is too large', function() {
    it('returns the expected authorization header string', function() {
      var request = {
        //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
        "path": "testapi/v1/t3",
        "method": "POST",
        "body": "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
      };

      testAuth = auth.generateAuth(request, clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);
      assert.equal(testAuth.headers.Authorization, expected('6Q6PiTipLae6n4GsSIDTCJ54bEbHUBp+4MUXrbQCBoY='));
    });
  });

  describe('a POST whose length equals the maximum permitted body length', function() {
    it('returns the expected authorization header string', function() {
      var request = {
        //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
        "path": "testapi/v1/t3",
        "method": "POST",
        "body": "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
      };

      testAuth = auth.generateAuth(request, clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);
      assert.equal(testAuth.headers.Authorization, expected('6Q6PiTipLae6n4GsSIDTCJ54bEbHUBp+4MUXrbQCBoY='));
    });
  });

  describe('a POST with an empty body', function() {
    it('returns the expected authorization header string', function() {
      var request = {
        //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
        "path": "testapi/v1/t6",
        "method": "POST",
        "body": ""
      };

      testAuth = auth.generateAuth(request, clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);
      assert.equal(testAuth.headers.Authorization, expected('1gEDxeQGD5GovIkJJGcBaKnZ+VaPtrc4qBUHixjsPCQ='));
    });
  });

  describe('a simple GET with an explicit header', function() {
    it('returns the expected authorization header string', function() {
      var request = {
        //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
        "path": "testapi/v1/t4",
        "method": "GET",
        "headers": {
          "X-Test1": "test-simple-header"
        }
      };

      testAuth = auth.generateAuth(request, clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);
      assert.equal(testAuth.headers.Authorization, expected('8F9AybcRw+PLxnvT+H0JRkjROrrUgsxJTnRXMzqvcwY='));
    });
  });

  describe('a request with headers containing spaces', function() {
    it('returns the expected authorization header string', function() {
      var request = {
        //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
        "path": "testapi/v1/t4",
        "method": "GET",
        "headers": {
          "X-Test1": "\"     test-header-with-spaces     \""
        }
      };

      testAuth = auth.generateAuth(request, clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);
      assert.equal(testAuth.headers.Authorization, expected('ucq2AbjCNtobHfCTuS38fdkl5UDdWHZhQX46fYR8CqI='));
    });
  });

  describe('a request with headers containing leading and interior spaces', function() {
    it('returns the expected authorization header string', function() {
      var request = {
        //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
        "path": "testapi/v1/t4",
        "method": "GET",
        "headers": {
          "X-Test1": "     first-thing      second-thing"
        }
      };

      testAuth = auth.generateAuth(request, clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);
      assert.equal(testAuth.headers.Authorization, expected('WtnneL539UadAAOJwnsXvPqT4Kt6z7HMgBEwAFpt3+c='));
    });
  });

  describe('a PUT', function() {
    it('returns the expected authorization header string', function() {
      var request = {
        //"url": "https://akaa-kax6r2oleojomqr3-q2i5ed3v35xfwe3j.luna.akamaiapis.net/billing-usage/v1/contractusagedata/contract/C-6JGLXF/6/2014",
        "path": "testapi/v1/t6",
        "method": "PUT",
        "body": "PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP"
      };

      testAuth = auth.generateAuth(request, clientToken, clientSecret, accessToken, baseUrl, false, nonce, timestamp);
      assert.equal(testAuth.headers.Authorization, expected('GNBWEYSEWOLtu+7dD52da2C39aX/Jchpon3K/AmBqBU='));
    });
  });
});
