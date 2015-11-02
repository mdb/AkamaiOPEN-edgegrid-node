// Authorization: EG1-HMAC-SHA256
// client_token + access_token + timestamp

var uuid = require('node-uuid'),
  moment = require('moment'),
  _ = require('underscore'),
  helpers = require('./helpers'),
  logger = require('./logger');

var _max_body = null;

var createTimestamp = function() {
  var timestamp = moment().utc().format('YYYYMMDDTHH:mm:ss+0000');
  return timestamp;
};

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

  var signed_auth_header = auth_header + helpers.signRequest(request, timestamp, client_secret, auth_header, _max_body);

  logger.info("Signed authorization header: " + signed_auth_header + "\n");

  return signed_auth_header;
};

module.exports = {
  generate_auth: function(request, client_token, client_secret, access_token, host, max_body, guid, timestamp) {

    _max_body = max_body || 2048;

    guid = guid || uuid.v4();
    timestamp = timestamp || createTimestamp();

    if (!request.hasOwnProperty("headers")) {
      request.headers = {};
    }
    request.url = host + request.path;
    request.headers.Authorization = make_auth_header(request, client_token, access_token, client_secret, timestamp, guid);
    return request;
  }
};
