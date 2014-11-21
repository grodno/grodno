(function() {
  (function(global) {
    var DIFTONGS, TYPE_U, isLetter, pushIntoCategory, tagsSorterFn, _undef;
    Object.ownProps = function(obj) {
      var n, result;
      result = [];
      for (n in obj) {
        if (obj.hasOwnProperty(n)) {
          result.push({
            id: n,
            value: obj[n]
          });
        }
      }
      return result;
    };
    Array.prototype.sortByMirrorKey = function(key) {
      key = key || "id";
      return this.sort(function(s1, s2, v1, v2) {
        v1 = s1[key].mirror();
        v2 = s2[key].mirror();
        if (v1 > v2) {
          return 1;
        } else {
          if (v1 < v2) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    };
    Array.prototype.sortByKeyLen = function(key) {
      key = key || "id";
      return this.sort(function(s1, s2, v1, v2) {
        v2 = s1[key].length;
        v1 = s2[key].length;
        if (v1 > v2) {
          return 1;
        } else {
          if (v1 < v2) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    };
    Function.prototype.iterator = function() {
      return (function(_this) {
        return function(arr, ctx, p) {
          return Function.iterate(_this, arr, ctx, p);
        };
      })(this);
    };
    Array.prototype.getKeys = function(key) {
      key = key || "id";
      return (function(v, p) {
        return this.push(v[key]);
      }).iterator()(this, []);
    };
    String.prototype.mirror = function() {
      var i, r;
      r = "";
      i = this.length - 1;
      while (i >= 0) {
        r += this[i];
        i--;
      }
      return r;
    };
    String.prototype.multi = function(len) {
      if (len > 0) {
        return new Array(len).join(this);
      } else {
        return '';
      }
    };
    String.prototype.trim = (function() {
      var re;
      re = /^\s+|\s+$/g;
      return function() {
        return this.replace(re, '');
      };
    })();
    String.prototype.endsWith = function(suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
    _undef = void 0;
    isLetter = function(f) {
      return CHARS[f] !== _undef;
    };
    pushIntoCategory = function(obj, cat, val) {
      if (!obj[cat]) {
        obj[cat] = {
          all: []
        };
      }
      obj[cat].all.push(val);
    };
    tagsSorterFn = function(s1, s2, v1, v2) {
      v1 = s1.value.all.length;
      v2 = s2.value.all.length;
      if (v1 > v2) {
        return -1;
      } else {
        if (v1 < v2) {
          return 1;
        } else {
          return 0;
        }
      }
    };
    Array.prototype.mirrorItems = function() {
      return (function(v) {
        this.push(v.mirror(""));
      }).iterator()(this, []);
    };
    Array.prototype.intoRegistry = function(reg) {
      var e, v, _i, _j, _len, _len1, _ref;
      if (reg == null) {
        reg = {};
      }
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        v = this[_i];
        reg[v.id] = v;
        if (v.ids) {
          _ref = v.ids.split(",");
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            e = _ref[_j];
            reg[e] = v;
          }
        }
      }
      return reg;
    };
    TYPE_U = {
      type: "x"
    };
    DIFTONGS = ["oo", "ea", "ei", "th", "gh", "ou", "sh", "ch"];
    return String.signature = function(x) {
      var c, i, l, p, r;
      i = 0;
      r = "";
      l = x.length;
      p = void 0;
      c = void 0;
      while (i < l) {
        c = x[i];
        if (c !== p && DIFTONGS.indexOf(p + c) === -1) {
          r += (Word.CHARS[c] || TYPE_U).type;
          p = c;
        }
        i++;
      }
      return r;
    };
  })(this);

}).call(this);
