var uuid = require('node-uuid'),
    _ = require('underscore'),
    helpers = require('./helpers'),
    logger = require('./logger');

var _max_body = null;

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

  _.each(keyValPairs, function(value, key) {
    joinedPairs += key + '=' + value + ';';
  });

  authHeader = 'EG1-HMAC-SHA256 ' + joinedPairs;

  logger.info('Unsigned authorization header: ' + authHeader + '\n');

  signedAuthHeader = authHeader + helpers.signRequest(request, timestamp, client_secret, authHeader, _max_body);

  logger.info('Signed authorization header: ' + signedAuthHeader + '\n');

  return signedAuthHeader;
};

module.exports = {
  generate_auth: function(request, client_token, client_secret, access_token, host, max_body, guid, timestamp) {
    _max_body = max_body || 2048;
    guid = guid || uuid.v4();
    timestamp = timestamp || helpers.createTimestamp();

    if (!request.hasOwnProperty('headers')) {
      request.headers = {};
    }

    request.url = host + request.path;

    request.headers.Authorization = makeAuthHeader(request, client_token, access_token, client_secret, timestamp, guid);

    return request;
  }
};
