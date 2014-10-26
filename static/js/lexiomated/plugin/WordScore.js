(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Object.entity.define({
    id: "lexiomated.plugin.WordScore extends lexiomated.Plugin",
    methods: function(_super) {
      var tryNormalize, _score;
      tryNormalize = function(n) {
        var i, m, r;
        if (this.root) {
          return;
        }
        m = this.x.match(n.re);
        if (m) {
          i = 0;
          while (i < n.patches.length) {
            r = Word.ROOTS[m[1] + n.patches[i] + (m[3] || "")];
            if (r) {
              this.root = this.x;
              this.score += this.x.length + (r.score || 90);
              return;
            }
            i++;
          }
        }
      };
      _score = function() {
        var lang, len, mask, r, sf, x;
        x = this.x;
        len = x.length;
        lang = this.word.lang;
        if (len < 2) {
          return;
        }
        r = Word.ROOTS[x];
        if (r) {
          this.root = x;
          this.score += len * 8 + r.score;
          return;
        }
        sf = this.suffix || this.flexie;
        if (sf && lang === "r" && (__indexOf.call("аеяюий", sf) >= 0) && (r = Word.ROOTS[x + "й"])) {
          this.root = r.id;
          this.score += len + r.score;
          return;
        }
        if (lang === "e") {
          if (sf && (r = Word.ROOTS[x + "e"])) {
            this.root = r.id;
            this.score += len * 8 + r.score;
            return;
          }
          if ((x[len - 1] === x[len - 2]) && (r = Word.ROOTS[x.substring(0, len - 1)])) {
            this.root = r.id;
            this.score += len * 8 + r.score;
            return;
          }
        }
        if (len < 3) {
          return;
        }
        if (mask = Word.ROOTS_MASKS[lang + String.signature(x)]) {
          this.root = x;
          this.score += len + mask.score;
        }
      };
      return {
        handleEvent: function(event) {
          var c, k, tres, w, _i, _len, _ref, _ref1, _results;
          _ref = Word.ALL;
          _results = [];
          for (k in _ref) {
            w = _ref[k];
            if (!(!w.best)) {
              continue;
            }
            _ref1 = w.cases;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              c = _ref1[_i];
              _score.call(c);
            }
            Array.sortBy(w.cases, "score", -1);
            w.best = w.cases[0];
            tres = w.best.score * 0.2;
            _results.push(w.cases = (function() {
              var _j, _len1, _ref2, _results1;
              _ref2 = w.cases;
              _results1 = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                c = _ref2[_j];
                if (c.x && c.score >= tres) {
                  _results1.push(c);
                }
              }
              return _results1;
            })());
          }
          return _results;
        }
      };
    }
  });

}).call(this);
