const path = require('path');

module.exports = {
  // ...
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert/"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "url": require.resolve("url/"),
    },
  },
};
