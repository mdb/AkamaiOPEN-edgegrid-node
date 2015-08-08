var crypto = require('crypto'),
    moment = require('moment');

module.exports = {
  base64HmacSha256: function(data, key) {
    var encrypt = crypto.createHmac('sha256', key);

    encrypt.update(data);

    return encrypt.digest('base64');
  },

  base64Sha256: function(data) {
    var shasum = crypto.createHash('sha256').update(data);

    return shasum.digest('base64');
  },

  canonicalizeHeaders: function(request) {
    var key,
        headers = request.headers,
        canonicalized = [];

    for (key in headers) {
      canonicalized.push(key.toLowerCase() + ':' + headers[key].trim().replace(/\s+/g, ' '));
    }

    return canonicalized.join('\t') + '\t';
  },

  contentHash: function(request) {
    if (request.method.toLowerCase() === 'post') {
      return this.base64Sha256(request.body);
    }

    return '';
  },

  extend: function(a, b) {
    var key;

    for(key in b) {
      if (!a.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  },

  timestamp: function() {
    return moment().utc().format('YYYYMMDDTHH:mm:ss+0000');
  }
};
