(function() {
  Object.entity.define({
    id: "lexiomated.Text",
    methods: function(_super) {
      return {
        analyze: function(input, callback) {
          var p, _i, _len, _ref;
          this.input = input;
          if (!this.input || !this.input.trim() || this.input === 'null' || this.input === 'undefined') {
            return callback(0, '');
          }
          _ref = this.plugins;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            p = _ref[_i];
            if (typeof p.handleEvent === "function") {
              p.handleEvent(this);
            }
          }
          return callback(0, this);
        },
        each: function(kind, op) {
          var _ref;
          return (_ref = this.rootElt) != null ? _ref.eachChildInDeep(this, function(elt) {
            if (elt.kind === kind) {
              return op.call(this, elt);
            }
          }) : void 0;
        }
      };
    }
  });

}).call(this);
