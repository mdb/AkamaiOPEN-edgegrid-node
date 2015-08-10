var crypto = require('crypto'),
    moment = require('moment'),
    url = require('url'),
    logger = require('./logger');

module.exports = {
  arrayIncludes: function(item, array) {
    return array.indexOf(item) > -1;
  },

  arrayIncludesString: function(item, array) {
    return this.arrayIncludes(item.toLowerCase(), array.map(function(elem) {
      return elem.toLowerCase();
    }));
  },

  base64HmacSha256: function(data, key) {
    var encrypt = crypto.createHmac('sha256', key);

    encrypt.update(data);

    return encrypt.digest('base64');
  },

  base64Sha256: function(data) {
    var shasum = crypto.createHash('sha256').update(data);

    return shasum.digest('base64');
  },

  canonicalizeHeaders: function(request, headersToSign) {
    headersToSign = headersToSign || [];
    var key,
        headers = request.headers,
        canonicalized = [];

    for (key in headers) {
      if (this.arrayIncludesString(key, headersToSign)) {
        canonicalized.push(key.toLowerCase() + ':' + headers[key].trim().replace(/\s+/g, ' ') + '\t');
      }
    }

    return canonicalized.join('');
  },

  contentHash: function(request) {
    if (request.method.toLowerCase() === 'post') {
      return this.base64Sha256(request.body);
    }

    return '';
  },

  dataToSign: function(request, authHeader) {
    var parsedUrl = url.parse(request.url, true);
        data = [
          request.method.toUpperCase(),
          parsedUrl.protocol.replace(':', ''),
          parsedUrl.host,
          parsedUrl.path,
          this.canonicalizeHeaders(request),
          this.contentHash(request),
          authHeader
        ].join('\t');

    logger.info('data to sign: "' + data + '" \n');

    return data;
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
