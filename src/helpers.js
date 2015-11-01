module.exports = {
  canonicalizeHeaders: function(request) {
    var key,
        headers = request.headers,
        canonicalized = [];

    for (key in headers) {
      canonicalized.push(key.toLowerCase() + ':' + headers[key].trim().replace(/\s+/g, ' '));
    }


    return canonicalized.join('\t');
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
  }
};
