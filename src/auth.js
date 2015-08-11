// Authorization: EG1-HMAC-SHA256
// client_token + access_token + timestamp

var uuid = require('node-uuid'),
  moment = require('moment'),
  crypto = require('crypto'),
  _ = require('underscore'),
  url = require('url'),
  logger = require('./logger'),
  helpers = require('./helpers');

var _headers_to_sign = null;

var make_auth_header = function(request, client_token, access_token, client_secret, timestamp, nonce) {

  var key_value_pairs = {
    "client_token": client_token,
    "access_token": access_token,
    "timestamp": timestamp,
    "nonce": nonce
  };

  var joined_pairs = "";
  _.each(key_value_pairs, function(value, key) {
    joined_pairs += key + "=" + value + ";";
  });

  var auth_header = "EG1-HMAC-SHA256 " + joined_pairs;

  logger.info("Unsigned authorization header: " + auth_header + "\n");

  var signed_auth_header = auth_header + helpers.signRequest(request, timestamp, client_secret, auth_header);

  logger.info("Signed authorization header: " + signed_auth_header + "\n");

  return signed_auth_header;
};

module.exports = {
  generate_auth: function(request, client_token, client_secret, access_token, host, headers_to_sign, guid, timestamp) {

    _headers_to_sign = headers_to_sign || [];

    guid = guid || uuid.v4();
    timestamp = timestamp || helpers.timestamp();

    if (!request.hasOwnProperty("headers")) {
      request.headers = {};
    }
    request.url = host + request.path;
    request.headers.Authorization = make_auth_header(request, client_token, access_token, client_secret, timestamp, guid);
    return request;
  }
};
