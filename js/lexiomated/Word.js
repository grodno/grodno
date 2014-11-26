(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.Word = (function() {
    var APP1, Case, ETE, NEG, NEG3, RE_RU, VOWEL_PREP, op_complexify, op_flexify, op_prefixize, op_suffixize, _matchesInTree, _reverseMatchesInTree;

    _matchesInTree = function(sub, op) {
      var c, l, p, r, x;
      x = this.x;
      l = x.length - 2;
      p = 0;
      while (p < l && (c = x[p]) && sub && (sub = sub[c])) {
        if (r = sub["_"]) {
          op.call(this, r, r.id, x.slice(p + 1));
        }
        p++;
      }
    };

    _reverseMatchesInTree = function(sub, op) {
      var c, p, r, x;
      x = this.x;
      p = x.length - 1;
      while (p > 1 && (c = x[p]) && sub && (sub = sub[c])) {
        if (r = sub["_"]) {
          op.call(this, r, x.slice(p), x.slice(0, +(p - 1) + 1 || 9e9));
        }
        p--;
      }
    };

    op_prefixize = function(r, key, rest) {
      if (rest.length > 1) {
        return this.branch({
          prefix: key,
          x: rest,
          score: key.length - 2,
          flags: r.flags
        });
      }
    };

    op_flexify = function(r, key, rest) {
      if (rest.length > 1) {
        return this.branch({
          flexie: key,
          x: rest,
          score: key.length,
          flags: r.flags
        });
      }
    };

    op_suffixize = function(r, key, rest) {
      if (rest.length > 1) {
        return this.branch({
          suffix: key,
          x: rest,
          score: key.length,
          flags: r.flags
        });
      }
    };

    op_complexify = function(r, key, rest) {
      if (rest.length > 1) {
        return this.branch({
          complexie: key,
          x: rest,
          score: 2 * key.length,
          flags: r.flags
        });
      }
    };

    VOWEL_PREP = "aeoi";

    APP1 = ["ся", "сь", "те"];

    NEG = ["не", "ни", "un", "de", "in", "re"];

    NEG3 = ["dis", "non", "mis"];

    ETE = ["eте"];

    RE_RU = /^[а-я]+$/i;

    Case = (function() {
      function Case(word, parent) {
        this.word = word;
        this.score = 0;
        Object.update(this, parent);
        this.level = ((parent != null ? parent.level : void 0) || 0) + 1;
        this.word.cases.push(this);
        this;
      }

      Case.prototype.branch = function(params) {
        return (new Case(this.word, this)).update(params).analyze();
      };

      Case.prototype.update = function(params) {
        var fl, n, sc;
        if (params) {
          fl = (this.setFlags(params.flags)).flags;
          sc = this.score + (params.score || 0);
          for (n in params) {
            this[n] = params[n];
          }
          this.score = sc;
          this.flags = fl;
        }
        return this;
      };

      Case.prototype.setFlags = function(fl) {
        this.flags = (this.flags || '') + (fl ? ' ' + fl : '');
        return this;
      };

      Case.prototype.toString = function() {
        return (this.negation || "") + (this.prependix ? this.prependix + "-" : "") + this.getForm() + (this.flexie ? ":" + this.flexie : "") + (this.appendix ? ":" + this.appendix : "");
      };

      Case.prototype.getForm = function() {
        return (this.prefix || "") + (this.complexie ? "{" + this.complexie + "}" : "") + "[" + (this.x || "-") + (!this.root || (this.root === this.x) ? "" : "=" + this.root) + "]" + (this.suffix || "");
      };

      Case.prototype.analyze = function() {
        if (this.flexie == null) {
          _reverseMatchesInTree.call(this, Word.FLEXIES_TREE, op_flexify, this.flexie = "");
        }
        if (this.prefix == null) {
          _matchesInTree.call(this, Word.PREFIXES_TREE, op_prefixize, this.prefix = "");
        }
        if (this.suffix == null) {
          _reverseMatchesInTree.call(this, Word.SUFFIXES_TREE, op_suffixize, this.suffix = "");
        }
        if (this.complexie == null) {
          _matchesInTree.call(this, Word.COMPLEXIES_TREE, op_complexify, this.complexie = "");
        }
        return this.tuneRoot();
      };

      Case.prototype.tuneRoot = (function(ev) {
        return function() {
          var x;
          x = this.x;
          if ((x.length > 4) && (this.word.lang === "e") && (VOWEL_PREP.indexOf(x[0]) > -1) && (x[1] === x[2])) {
            this.branch({
              prependix: x.substr(0, 2),
              score: 3,
              x: x.substr(2)
            });
          }
          return this;
        };
      })();

      Case.prototype.cuttify = function() {
        var ch2, ch3, x, _ref, _ref1, _ref2, _ref3;
        x = this.x;
        if (_ref = (ch2 = x.slice(0, 2)), __indexOf.call(NEG, _ref) >= 0) {
          this.branch({
            negation: ch2,
            score: 3,
            x: x.slice(2)
          });
        }
        if (_ref1 = (ch3 = x.slice(0, 3)), __indexOf.call(NEG3, _ref1) >= 0) {
          this.branch({
            negation: ch3,
            score: 4,
            x: x.slice(3)
          });
        }
        if (_ref2 = (ch2 = x.slice(-2)), __indexOf.call(APP1, _ref2) >= 0) {
          this.branch({
            appendix: ch2,
            score: 3,
            x: x.slice(0, +(x.length - 3) + 1 || 9e9),
            flags: 'reflect'
          });
        }
        if (_ref3 = (ch2 = x.slice(-3)), __indexOf.call(ETE, _ref3) >= 0) {
          this.branch({
            appendix: "е",
            score: 3,
            x: x.slice(0, +(x.length - 2) + 1 || 9e9)
          });
        }
        return this;
      };

      return Case;

    })();

    function Word(x) {
      this.x = x;
      this.cases = [];
      this.info = {};
      this.lang = this.x.match(RE_RU) ? 'r' : 'e';
    }

    Word.prototype.analyze = function(b) {
      if (!this.top) {
        this.top = (new Case(this)).update({
          score: 1,
          x: this.x.toLowerCase()
        }).cuttify().analyze();
      }
      return this;
    };

    Word.prototype.toString = function(sep) {
      var w;
      if (sep == null) {
        sep = ', ';
      }
      return ((function() {
        var _i, _len, _ref, _results;
        _ref = this.cases;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          w = _ref[_i];
          _results.push(w.score + ":" + w);
        }
        return _results;
      }).call(this)).join(sep);
    };

    Word.registry = function(key, arr) {
      return this[key] = arr.intoRegistry(this[key]);
    };

    Word.get = function(x) {
      return this.ALL[x] || (this.ALL[x] = new Word(x));
    };

    Word.ALL = {};

    Word.applyDictionaries = function(data) {
      var k, r, v;
      if (!data) {
        return null;
      }
      for (k in data) {
        r = data[k];
        if (k.slice(0, 6) === 'roots') {
          this.registry('ROOTS', r);
        }
      }
      this.registry('COMPLEXIES', data.complexies);
      this.registry('FLEXIES', data.flexies);
      this.registry('ROOTS_MASKS', data.root_masks);
      this.applyInTree("COMPLEXIES_TREE", data.complexies);
      this.applyInTree("PREFIXES_TREE", data.prefixes);
      this.applyInTree("SUFFIXES_TREE", data.suffixes, function(x) {
        return x.id.mirror();
      });
      this.applyInTree("FLEXIES_TREE", (function() {
        var _ref, _results;
        _ref = this.FLEXIES;
        _results = [];
        for (k in _ref) {
          v = _ref[k];
          _results.push(v);
        }
        return _results;
      }).call(this), function(x) {
        return x.id.mirror();
      });
      return data;
    };

    Word.applyInTree = function(key, data, keyFn) {
      var tree, v, _i, _len, _results;
      if (keyFn == null) {
        keyFn = function(x) {
          return x.id;
        };
      }
      tree = this[key] || (this[key] = {});
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        v = data[_i];
        _results.push(Object.prop(tree, ((keyFn(v)) + "_").split("").join("."), v));
      }
      return _results;
    };

    return Word;

  })();

}).call(this);
