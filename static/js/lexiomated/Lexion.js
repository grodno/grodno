(function() {
  var __hasProp = {}.hasOwnProperty;

  this.Lexion = (function() {
    var addLast;

    addLast = function(e) {
      if (this.last) {
        (this.last.next = e).prev = this.last;
      } else {
        this.first = e;
      }
      this.last = e;
      return this;
    };

    function Lexion(opts) {
      this.attrs = {};
      Object.update(this, opts);
      if (!this.tag) {
        this.tag = 'span';
      }
      this.flags = {};
      this.flags[this.kind] = 1;
      if (this.parent) {
        addLast.call(this.parent, this);
      }
    }

    Lexion.prototype.detachMe = function() {
      if (!this.parent) {
        return this;
      }
      if (this.next) {
        this.next.prev = this.prev;
      } else {
        this.parent.last = this.prev || null;
      }
      if (this.prev) {
        this.prev.next = this.next;
      } else {
        this.parent.first = this.next || null;
      }
      this.parent = this.prev = this.next = null;
      return this;
    };

    Lexion.prototype.setAttr = function(k, v) {
      this.attrs[k] = v;
      return this;
    };

    Lexion.prototype.setText = function(v) {
      this.text = v;
      return this;
    };

    Lexion.prototype.setKind = function(v) {
      if (this.kind) {
        this.flags[this.kind] = 0;
      }
      this.kind = v;
      this.flags[this.kind] = 1;
      return this;
    };

    Lexion.prototype.setFlags = function(delta) {
      var cl, _i, _len;
      if (!(delta && (delta = delta.split(" ")).length)) {
        return this;
      }
      for (_i = 0, _len = delta.length; _i < _len; _i++) {
        cl = delta[_i];
        if (cl) {
          if (cl[0] === "!") {
            this.flags[cl.slice(1)] = 0;
          } else {
            this.flags[cl] = 1;
          }
        }
      }
      return this;
    };

    Lexion.prototype.addChild = function(e) {
      e.detachMe();
      return addLast.call(e.parent = this, e);
    };

    Lexion.prototype.setParent = function(p) {
      this.detachMe();
      if (this.parent = p) {
        return addLast.call(p, this);
      }
    };

    Lexion.prototype.setNext = function(e) {
      e.detachMe();
      e.parent = this.parent;
      e.prev = this;
      e.next = this.next;
      if (this.next) {
        this.next.prev = e;
      }
      this.next = e;
      return this;
    };

    Lexion.prototype.doInBetween = function(next, op) {
      var e, i, p, pn;
      p = this.next;
      while (p && p !== next) {
        pn = p.next;
        p[op].apply(p, (function() {
          var _i, _len, _results;
          _results = [];
          for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {
            e = arguments[i];
            if (i > 1) {
              _results.push(e);
            }
          }
          return _results;
        }).apply(this, arguments));
        p = pn;
      }
      return this;
    };

    Lexion.prototype.eachChild = function(ctx, op) {
      var p;
      p = this.first;
      while (p) {
        op.call(ctx, p);
        p = pn;
      }
      return ctx;
    };

    Lexion.prototype.eachChildInDeep = function(ctx, op) {
      var p;
      p = this.first;
      while (p) {
        p.eachChildInDeep(ctx, op);
        op.call(ctx, p);
        p = p.next;
      }
      return ctx;
    };

    Lexion.prototype.surroundWith = function(opts) {
      var p;
      p = new Lexion(opts);
      this.setNext(p).setParent(p);
      return p;
    };

    Lexion.prototype.textRegistry = function(ctx) {
      var ch, e, _i, _j, _len, _len1, _ref, _ref1;
      if (ctx == null) {
        ctx = {
          text: '',
          registry: []
        };
      }
      if (this.children) {
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          e = _ref[_i];
          e.textRegistry(ctx);
        }
      } else if (this.text) {
        ctx.text += this.text;
        _ref1 = this.text;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          ch = _ref1[_j];
          ctx.registry.push(this);
        }
      } else {

      }
      return ctx;
    };

    Lexion.prototype.executeRegExp = function(re, op) {
      var ctx, e, pastLastIndex, s, text;
      pastLastIndex = 0;
      ctx = this.textRegistry();
      ctx.sourceElt = this;
      s = ctx.text;
      while ((e = re.exec(s))) {
        ctx.matching = e;
        if (e.index && (text = s.slice(pastLastIndex, +(e.index - 1) + 1 || 9e9))) {
          op.call(ctx, text, null);
        }
        op.call(ctx, e[0], e);
        pastLastIndex = re.lastIndex;
      }
      if ((text = s.slice(pastLastIndex))) {
        op.call(ctx, text, ctx.matching = null);
      }
      return ctx;
    };

    Lexion.prototype.toHtml = function(ngap) {
      var attrs, f, fl, gap, inner, k, opentag, p, r, t, v;
      if (ngap == null) {
        ngap = 0;
      }
      if (this.kind === 'space') {
        return ' ';
      }
      gap = '\n' + '\t'.multi(ngap);
      if ((r = this.word)) {
        this.setAttr('title', r);
      }
      attrs = ((function() {
        var _ref, _results;
        _ref = this.attrs;
        _results = [];
        for (k in _ref) {
          if (!__hasProp.call(_ref, k)) continue;
          v = _ref[k];
          if (v) {
            _results.push("" + k + "=\"" + v + "\"");
          }
        }
        return _results;
      }).call(this)).join(' ');
      fl = ((function() {
        var _ref, _results;
        _ref = this.flags;
        _results = [];
        for (f in _ref) {
          v = _ref[f];
          if (v) {
            _results.push(f);
          }
        }
        return _results;
      }).call(this)).join(' ');
      fl = fl ? " class=\"" + fl + "\"" : '';
      opentag = "" + this.tag + fl + " " + attrs;
      if (p = this.first) {
        inner = [];
        while (p) {
          inner.push(p.toHtml(ngap + 1));
          p = p.next;
        }
        return "" + gap + "<" + opentag + "> " + (inner.join('')) + gap + "</" + this.tag + ">";
      } else if (this.text) {
        t = this.text.replace(/\s+/g, ' ');
        return "" + gap + "<" + opentag + ">" + t + "</" + this.tag + ">";
      } else {
        return "" + gap + "<" + opentag + "/>";
      }
    };

    return Lexion;

  })();

}).call(this);
