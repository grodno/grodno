(function() {
  Object.log = function(x) {
    var args, c, e, stack;
    c = global.console;
    if (x != null ? x.isError : void 0) {
      stack = (new Error).stack.split('\n').slice(3, -2).join('\n\t\t\t');
      args = [("" + (Date(Date.now())) + " : ") + x, '\n\t Details:', x.details, '\n\t Stacktrace:\n\t\t\t', stack];
      c.error.apply(c, args);
    } else {
      args = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          e = arguments[_i];
          _results.push(e);
        }
        return _results;
      }).apply(this, arguments);
      c.log.apply(c, args);
    }
    return x;
  };

  Object.entity.create({
    id: "request:EventHandler",
    onEvent: function(ev) {
      Object.log("Remote HTTP request", "" + ev.uri);
      return request.get("" + ev.uri, ev.options, function(err, response, body) {
        if (!err && response.statusCode === 200) {
          console.log(body);
        }
        return ev.callback(err, body);
      });
    }
  });

  Object.http = (function() {
    var MIME, REASON_CODES, http, request, _hasBody, _mime, _statusCode;
    http = require("http");
    request = require("request");
    MIME = http.MIME = {
      URL_ENCODED: "application/x-www-form-urlencoded",
      JSON: "application/json",
      JS: "text/javascript",
      HTML: "text/html",
      CSS: "text/css",
      IMAGE: "image/*",
      JPG: "image/jpg",
      PNG: "image/png",
      GIF: "image/gif",
      TXT: "text/plain",
      APPCACHE: "text/cache-manifest"
    };
    REASON_CODES = http.REASON_CODES = {
      ok: 200,
      bad: 400,
      conflict: 409,
      forbidden: 403,
      "not-found": 404,
      "method-not-allowed": 405,
      "internal-server-error": 500
    };

    /*
    Return `true` if the request has a body, otherwise return `false`.
    
    @param  {IncomingMessage} req
    @return {Boolean}
    @api private
     */
    _hasBody = function(req) {
      return "transfer-encoding" in req.headers || "content-length" in req.headers;
    };

    /*
    Extract the mime type from the given request's
    _Content-Type_ header.
    
    @param  {IncomingMessage} req
    @return {String}
    @api private
     */
    _mime = function(req) {
      return (req.headers["content-type"] || "").split(";")[0];
    };
    _statusCode = function(reason) {
      if (reason) {
        return REASON_CODES[reason] || 500;
      } else {
        return 200;
      }
    };
    http.fetchPayload = function(ev, req, next) {
      if (["get", "delete"].indexOf(req.method) === -1) {
        req.addListener("data", function(chunk) {
          ev.body += chunk;
        });
        req.addListener("end", function() {
          Object.http.parsePayload(ev, function() {
            next(err, ev);
          });
        });
      } else {
        this(err, ev);
      }
    };
    http.negotiateMime = function(url) {
      var ext, p;
      p = url.lastIndexOf(".");
      ext = url.substring(p + 1).toUpperCase();
      return MIME[ext] || MIME.HTML;
    };
    http.send = function(res, result, reason) {
      return res.status(_statusCode(reason)).send(result);
    };
    http.sendJson = function(res, obj, reason) {
      return res.status(_statusCode(reason)).json(obj);
    };
    http.sendError = function(res, err) {
      err = Object.error(err).log();
      res.status(_statusCode(err.reason)).json(err);
      return err;
    };
    return http;
  })();

}).call(this);
