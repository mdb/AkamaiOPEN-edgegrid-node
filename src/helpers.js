var crypto = require('crypto'),
    _ = require('underscore'),
    url = require('url'),
    logger = require('./logger');

module.exports = {
 base64Sha256: function(data) {
    var shasum = crypto.createHash('sha256').update(data);

    return shasum.digest('base64');
  },

  base64HmacSha256: function(data, key) {
    var encrypt = crypto.createHmac('sha256', key);

    encrypt.update(data);

    return encrypt.digest('base64');
  },

  canonicalizeHeaders: function(request) {
    var key,
        headers = request.headers,
        canonicalized = [];

    for (key in headers) {
      canonicalized.push(key.toLowerCase() + ':' + headers[key].trim().replace(/\s+/g, ' '));
    }

    return canonicalized.join('\t');
  },

  dataToSign: function(request, authHeader, maxBody) {
    var parsedUrl = url.parse(request.url, true),
        data = [
          request.method.toUpperCase(),
          parsedUrl.protocol.replace(':', ''),
          parsedUrl.host,
          parsedUrl.path,
          this.canonicalizeHeaders(request),
          this.contentHash(request, maxBody),
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

  isRedirect: function(statusCode) {
    return [
      300, 301, 302, 303, 307
    ].indexOf(statusCode) !== -1;
  },

  contentHash: function(request, maxBody) {
    var contentHash = '',
        preparedBody = request.body || '',
        postDataNew = '';

    if (typeof preparedBody === 'object') {
      logger.info('body content is type object, transforming to post data');

      _.each(preparedBody, function(value, index) {
        postDataNew += index + '=' + encodeURIComponent(JSON.stringify(value)) + '&';
      });

      preparedBody = postDataNew;
      request.body = preparedBody;
    }

    logger.info('body is "' + preparedBody + '"');
    logger.debug('PREPARED BODY LENGTH', preparedBody.length);

    if (request.method == 'POST' && preparedBody.length > 0) {
      logger.info('Signing content: "' + preparedBody + '"');

      if (preparedBody.length > maxBody) {
        logger.warn('Data length (' + preparedBody.length + ') is larger than maximum ' + maxBody);
        preparedBody = preparedBody.substring(0, maxBody);
        logger.info('Body truncated. New value "' + preparedBody + '"');
      }

      logger.debug('PREPARED BODY', preparedBody);

      contentHash = this.base64Sha256(preparedBody);

      logger.info('Content hash is "' + contentHash + '"');
    }

    return contentHash;
  },

  signingKey: function(timestamp, clientSecret) {
    var key = this.base64HmacSha256(timestamp, clientSecret);

    logger.info('Signing key: ' + key + '\n');

    return key;
  }
};
