// Generated by CoffeeScript 1.8.0

/*
HttpService.
 */

(function() {
  Object.entity.define({
    id: "HttpService extends EventHandler",
    methods: function(_super) {
      var F0, MIME, PARSERS, _error, _negotiateResultType, _newRequest;
      F0 = function(x) {
        return x;
      };
      MIME = {
        json: "application/json",
        js: "application/json",
        html: "text/html",
        txt: "text/plain"
      };
      PARSERS = {
        js: Object.parse,
        json: Object.parse,
        uri: Object.parseUri
      };
      _newRequest = function() {
        try {
          return new window["XMLHttpRequest"]();
        } catch (_error) {
          try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
          } catch (_error) {}
        }
      };
      _error = function(st, text, ev) {
        if (!st || (st >= 200 && st < 300) || (st === 304)) {
          return null;
        } else {
          return {
            reason: "http_transport",
            message: ("Remote error: code " + st + ". ") + ev.uri + '\n' + (text || ''),
            code: st
          };
        }
      };
      _negotiateResultType = function(u) {
        var p, r, urlId;
        urlId = u.path.slice(-1)[0];
        r = "js";
        if (urlId && (p = urlId.lastIndexOf(".")) > -1) {
          r = urlId.slice(p + 1);
        }
        return r;
      };
      return {
        resolveMethod: function(ev) {
          return ev.method || (ev.payload ? "POST" : "GET");
        },
        resolveUri: function(uri) {
          if (uri.domain === '*') {
            uri.domain = window.location.hostname;
          }
          uri.type = uri.params.ssl ? 'https' : window.location.protocol.slice(0, -1);
          return "" + uri;
        },
        handleEvent: function(ev) {
          var dataType, h, headers, rq, running, v;
          try {
            rq = _newRequest();
            dataType = ev.dataType || _negotiateResultType(ev.uri);
            rq.open(this.resolveMethod(ev), this.resolveUri(ev.uri), true);
            rq.onreadystatechange = function() {
              if ((this.readyState === 4) && (!ev.completed)) {
                ev.completed = true;
                this.onreadystatechange = F0;
                ev.callback(_error(this.status, this.statusText, ev), (ev.unmarshaller || PARSERS[dataType] || F0)(this.responseText));
              }
              return false;
            };
            headers = Object.update({
              Accept: MIME[dataType] || "*",
              Language: String.LANGUAGE
            }, ev.headers);
            for (h in headers) {
              v = headers[h];
              if (v) {
                rq.setRequestHeader(h, v);
              }
            }
            if (ev.payload) {
              if (typeof ev.payload === "object") {
                rq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                ev.payload = JSON.stringify(ev.payload);
              }
              rq.send(ev.payload);
            } else {
              rq.send(null);
            }
          } catch (_error) {
            running = false;
            ev.callback(Object.error(_error, "remote_error:" + ev.uri).log());
          }
        }
      };
    }
  });

  Object.entity.define({
    id: "ScriptService extends EventHandler",
    scriptType: "text/javascript",
    methods: function(_super) {
      var counter, registry, _createScriptTag, _doc;
      registry = window._JSONP || (window._JSONP = {});
      counter = window._JSONP_COUNTER || (window._JSONP_COUNTER = 1);
      _doc = window.document;
      _createScriptTag = function(attrs) {
        var e;
        e = _doc.createElement("script");
        e.type = this.scriptType;
        e.charset = "utf-8";
        Object.update(e, attrs);
        return e;
      };
      return {
        resolveUri: function(u) {
          if (u.domain === '*') {
            u.domain = window.location.hostname;
          }
          u.type = u.params.ssl ? 'https' : window.location.protocol.slice(0, -1);
          return "" + u;
        },
        handleEvent: function(ev) {
          var script, sid, u;
          script = _createScriptTag.call(this, ev.scriptAttrs);
          if (ev.scriptId) {
            script.id = ev.scriptId;
          }
          u = ev.uri;
          if (u.type === "script") {
            u.type = "http";
          }
          if (ev.uri.domain === '*') {
            ev.uri.domain = window.location.hostname;
          }
          if (u.params.jsonp) {
            sid = "n" + counter++;
            u.params[u.params.jsonp] = escape("window._JSONP." + sid);
            registry[sid] = function(r) {
              return typeof ev.callback === "function" ? ev.callback(null, r) : void 0;
            };
            script.onload = function() {
              script.parentNode.removeChild(script);
              return delete registry[sid];
            };
          } else {
            script.onload = function() {
              var cb;
              cb = ev.callback;
              ev.callback = null;
              return typeof cb === "function" ? cb(null, this) : void 0;
            };
          }
          script.onerror = function() {
            return ev.callback(Object.error("remote_error", "Script error: " + u));
          };
          script.src = this.resolveUri(u);
          return Object.dom.appendToHead(script);
        }
      };
    }
  });

  (function(global) {
    return Object.entity.define({
      id: "SocketClient extends EventHandler",
      properties: ['requires:Requires'],
      ready: false,
      methods: function(_super) {
        return {
          launch: function(cb) {
            this.requires = ["script://" + this.channel + "/socket.io.js"];
            return _super.launch.call(this, cb);
          },
          init: function() {
            var io, socket;
            _super.init.call(this);
            if (!(io = global.io)) {
              throw new Error('No Socket IO');
            }
            socket = io.connect(this.channel);
            socket.on("connect", ((function(_this) {
              return function() {
                return _this.onConnect();
              };
            })(this)));
            socket.on("message", ((function(_this) {
              return function(ev) {
                return _this.onMessage(ev);
              };
            })(this)));
            socket.on("disconnect", ((function(_this) {
              return function() {
                return _this.onDisconnect();
              };
            })(this)));
            return this.emit = function(ev, cb) {
              if (cb == null) {
                cb = ev.callback;
              }
              ev.uri = "" + ev.uri;
              delete ev.callback;
              return socket.json.emit("message", ev, cb);
            };
          },
          handleEvent: function(ev) {
            this.log("send", ev);
            return this.emit(ev);
          },
          onConnect: function(ev) {
            this.log("onConnect", ev);
            return this.setIsReady();
          },
          onDisconnect: function(ev) {
            return this.log("onDisconnect", ev);
          },
          onMessage: function(ev) {
            this.log("onMessage", ev);
            if (ev.uri) {
              return Object.fire(ev);
            }
          }
        };
      }
    });
  })(this);

  Object.entity.define({
    id: "HtmlLoader extends Cache",
    uriPattern: 'remote://*/html/{{domain}}.html',
    methods: function(_super) {
      return {
        init: function() {
          this.storage = this.createStorage();
          return _super.init.call(this);
        },
        createStorage: function() {
          return this.storage || {
            getItem: function(key) {
              return this[key];
            },
            setItem: function(key, value) {
              return this[key] = value;
            }
          };
        },
        cacheDeserializer: function(s) {
          return s;
        },
        cacheSerializer: function(s) {
          return s;
        }
      };
    }
  });


  /*
  Define Cache entity type
   */

  Object.entity.define({
    id: "CodeLoader extends Cache",
    uriPattern: 'remote://*/js/{{domain}}.js?_ver={{version}}',
    methods: function(_super) {
      return {
        fetchUnmarshaller: function(s) {
          return s;
        },
        cacheSerializer: function(s) {
          return this.evaluate(s);
        },
        cacheDeserializer: function(s) {
          return this.evaluate(s);
        },
        evaluate: function(s) {
          if (!s) {
            return null;
          }
          try {
            (Function.call(Function, s))();
          } catch (_error) {
            Object.error(_error, "JS syntax:" + _error.message).log();
          }
          return s;
        }
      };
    }
  });

  Object.entity.define({
    id: "EntityLoader extends CodeLoader",
    methods: function(_super) {
      return {
        resolveUri: function(uri) {
          uri.domain = uri.domain.replace(/\./g, '/');
          return _super.resolveUri.call(this, uri);
        }
      };
    }
  });

  Object.entity.define({
    id: 'Settings extends ValueStorage',
    storage: window.localStorage
  });

  Object.entity.define({
    id: 'webclient.Application',
    properties: ['title', 'page', 'index', "plugins:Plugins"],
    methods: function(_super) {
      return {
        init: function() {
          if (!this.domNode) {
            this.domNode = window.document.body;
          }
          _super.init.call(this);
          return (window.onhashchange = (function(_this) {
            return function() {
              return _this.navigate(window.location.hash.slice(2) || 'home');
            };
          })(this))();
        },
        titleChanged: function(ev, v) {
          return window.document.title = v;
        },
        navigate: function(h) {
          var hashes;
          if (!h) {
            return;
          }
          hashes = h.split('-');
          this.prop('page', hashes[0]);
          return this.prop('index', hashes[1] || "");
        },
        onPluginsInitialized: function() {
          var node, _i, _len, _ref;
          _ref = this.domNode.querySelectorAll("[data-widget]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            Object.dom.initWidget({
              domNode: node,
              parentEntity: this
            });
          }
          return true;
        }
      };
    }
  });

}).call(this);
