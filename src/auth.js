var uuid = require('node-uuid'),
    helpers = require('./helpers'),
    logger = require('./logger'),
    _maxBody = null;

var makeAuthHeader = function(request, client_token, access_token, client_secret, timestamp, nonce) {
  var keyValPairs = {
        client_token: client_token,
        access_token: access_token,
        timestamp: timestamp,
        nonce: nonce
      },
      joinedPairs = '',
      authHeader,
      signedAuthHeader;

  Object.keys(keyValPairs).forEach(function(key) {
    joinedPairs += key + '=' + keyValPairs[key] + ';';
  });

  authHeader = 'EG1-HMAC-SHA256 ' + joinedPairs;

  logger.info('Unsigned authorization header: ' + authHeader + '\n');

  signedAuthHeader = authHeader + helpers.signRequest(request, timestamp, client_secret, authHeader, _maxBody);

  logger.info('Signed authorization header: ' + signedAuthHeader + '\n');

  return signedAuthHeader;
};

module.exports = {
  generateAuth: function(request, clientToken, clientSecret, accessToken, host, maxBody, guid, timestamp) {
    _maxBody = maxBody || 2048;
    guid = guid || uuid.v4();
    timestamp = timestamp || helpers.createTimestamp();

    if (!request.hasOwnProperty('headers')) {
      request.headers = {};
    }

    request.url = host + request.path;

    request.headers.Authorization = makeAuthHeader(request, clientToken, accessToken, clientSecret, timestamp, guid);

    return request;
  }
};
