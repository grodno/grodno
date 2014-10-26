(function() {
  Object.entity.define({
    id: 'webserver.Application',
    properties: ['config', "plugins:Plugins"],
    methods: function(_super) {
      return {
        init: function() {
          var p, _i, _len, _ref;
          this.log("Application init");
          this.setupTerminationHandlers();
          this.express = require("express")();
          this.http = require("http").createServer(this.express);
          _super.init.call(this);
          _ref = this.plugins;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            p = _ref[_i];
            if (typeof p.config === "function") {
              p.config(this);
            }
          }
          return this.http.listen(this.port, this.ipaddress, (function(_this) {
            return function() {
              return _this.log("%s: Node server started on %s:%d ...", Date(Date.now()), _this.ipaddress, _this.port);
            };
          })(this));
        },
        use: function(x) {
          this.express.use(x);
          return this;
        },
        config: function(key, def) {
          return Object.get(this.config, key) || def || null;
        },
        done: function() {
          _super.done.call(this);
          this.http.removeAllListeners("connection");
          this.http.removeAllListeners("request");
          this.http.close;
          return this;
        },

        /*
        Setup termination handlers (for exit and a list of signals).
         */
        setupTerminationHandlers: function() {
          var sig, terminator, _i, _len, _ref;
          process.on("exit", (function(_this) {
            return function() {
              _this.done();
              return _this.error("" + (Date(Date.now())) + ": Node server stopped.");
            };
          })(this));
          terminator = function(sig) {
            Object.error(": Received " + sig + " - terminating ...").log();
            return process.exit(1);
          };
          _ref = ["SIGHUP", "SIGINT", "SIGQUIT", "SIGILL", "SIGTRAP", "SIGABRT", "SIGBUS", "SIGFPE", "SIGUSR1", "SIGSEGV", "SIGUSR2", "SIGTERM"];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sig = _ref[_i];
            process.on(sig, (function() {
              return terminator(sig);
            }));
          }
          return this;
        }
      };
    }
  });

}).call(this);
