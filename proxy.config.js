const PROXY_CONFIG = {
  "/proxy": {
      "target": "http://124.248.67.122:9999/",
      "secure": false,
      "changeOrigin": true,
      "pathRewrite": {
        "^/proxy": ""
      },
      "onProxyRes": function (proxyRes, req, res) {
        var cookies = proxyRes.headers['set-cookie'];
        if (cookies) {
          delete proxyRes.headers['set-cookie'];
          proxyRes.headers['set-cookie'] = cookies + '; Secure;';
        }
      }
  }
}

module.exports = PROXY_CONFIG;
