var request = require('request'),
    url = require('url'),
    auth = require('./auth'),
    edgerc = require('./edgerc'),
    helpers = require('./helpers'),
    logger = require('./logger');

var EdgeGrid = function(clientToken, clientSecret, accessToken, host) {
  if (typeof arguments[0] === 'object') {
    this._setConfigFromObj(arguments[0]);
  } else {
    this._setConfigFromStrings(clientToken, clientSecret, accessToken, host);
  }
};

EdgeGrid.prototype.auth = function(req) {
  req = helpers.extend(req, {
    url: this.config.host + req.path,
    method: 'GET',
    headers: {
      'Content-Type': "application/json"
    },
    followRedirect: false,
    body: {}
  });

  this.request = auth.generateAuth(req, this.config.client_token, this.config.client_secret, this.config.access_token, this.config.host);
};

EdgeGrid.prototype.send = function(callback) {
  request(this.request, function(error, response, body) {
    if (error) { throw new Error(error); }

    if (helpers.isRedirect(response.statusCode)) {
      this._handleRedirect(response, callback);
      return;
    }

    callback(body, response);
  }.bind(this));
};

EdgeGrid.prototype._handleRedirect = function(resp, callback) {
  var parsedUrl = url.parse(resp.headers['location']);

  resp.headers['authorization'] = undefined;
  this.request.url = undefined;
  this.request.path = parsedUrl.path;

  this.auth(this.request);
  this.send(callback);
};

EdgeGrid.prototype._setConfigFromObj = function(obj) {
  if (!obj.path) {
    if (process.env.EDGEGRID_ENV !== 'test') {
      logger.error('No .edgerc path');
    }

    throw new Error('No edgerc path');
  }

  this.config = edgerc(obj.path, obj.group);
};

EdgeGrid.prototype._setConfigFromStrings = function(clientToken, clientSecret, accessToken, host) {
  if (!validatedArgs([clientToken, clientSecret, accessToken, host])) {
    throw new Error('Insufficient Akamai credentials');
  }

  this.config = {
    client_token: clientToken,
    client_secret: clientSecret,
    access_token: accessToken,
    host: host.indexOf('https://') > -1 ? host : 'https://' + host
  };
};

function validatedArgs(args) {
  var expected = [
        'clientToken', 'clientSecret', 'accessToken', 'host'
      ],
      valid = true;

  expected.forEach(function(arg, i) {
    if (!args[i]) {
      if (process.env.EDGEGRID_ENV !== 'test' ) {
        logger.error('No defined ' + arg);
      }

      valid = false;
    }
  });

  return valid;
}

EdgeGrid.prototype._setConfigFromObj = function(obj) {
  if (!obj.path) {
    if (process.env.EDGEGRID_ENV !== 'test') {
      logger.error('No .edgerc path');
    }

    throw new Error('No edgerc path');
  }

  this.config = edgerc(obj.path, obj.group);
};

module.exports = EdgeGrid;
