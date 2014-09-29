// Generated by CoffeeScript 1.8.0
(function() {
  Object.entity.define({
    id: 'webserver.FilesPlugin extends EventHandler',
    staticDirs: ['./static'],
    methods: function(_super) {
      var express, fs, path;
      fs = require('fs');
      path = require('path');
      express = require('express');
      return {
        config: function(app) {
          var dir, _i, _len, _ref, _results;
          this.rootDir = path.dirname(require.main.filename);
          _ref = this.staticDirs;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            dir = _ref[_i];
            _results.push(app.use(express["static"](dir)));
          }
          return _results;
        },
        resolveUri: function(uri) {
          return path.resolve.apply(path, [this.rootDir].concat(uri.path));
        },
        handleEvent: function(ev) {
          var name;
          name = this.resolveUri(ev.uri);
          return fs.exists(name, function(x) {
            if (!x) {
              return ev.callback({
                message: "not-found: File not found: " + name
              });
            }
            return fs.readFile(name, ev.uri.params.encoding || "utf8", ev.callback);
          });
        }
      };
    }
  });

}).call(this);