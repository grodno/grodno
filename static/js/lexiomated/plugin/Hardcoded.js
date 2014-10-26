(function() {
  Object.entity.define({
    id: "lexiomated.plugin.Hardcoded extends lexiomated.Plugin",
    requires: ['gsheet://1r9wwsGFHeJ_rxC-zNJ8ysoEcznk76PmGah1uLdus3iQ/content'],
    methods: function(_super) {
      return {
        onRequiredLoaded: function(content) {
          return this.hardcoded = content.intoRegistry();
        },
        handleEvent: function(event) {
          return event.each('word', (function(_this) {
            return function(elt) {
              var count, e, key, next, next2, r, _ref, _results;
              if ((r = _this.hardcoded[key = elt.text.toLowerCase()])) {
                elt.setKind(r.kind).setFlags(r.flags);
              }
              count = 2;
              e = elt;
              _results = [];
              while (count && (next2 = (_ref = (next = e.next)) != null ? _ref.next : void 0) && next2.kind === 'word') {
                if ((r = _this.hardcoded[key += next.text + next2.text])) {
                  elt.doInBetween(next2.next, 'detachMe').setKind(r.kind).setText(key);
                }
                e = next2;
                _results.push(count--);
              }
              return _results;
            };
          })(this));
        }
      };
    }
  });

}).call(this);
