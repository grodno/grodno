var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Object.entity.defineProperty({
  id: "Liquid",
  methods: function() {
    return {
      comparator: Function.FALSE
    };
  }
});

Object.entity.defineProperty({
  id: "Boolean",
  methods: function() {
    return {
      comparator: function(a, b) {
        return (!a) === (!b);
      },
      setter: function(T, v, ev) {
        return T._state[this.id] = !!v;
      }
    };
  }
});

Object.entity.defineProperty({
  id: "Number",
  methods: function() {
    return {
      comparator: function(a, b) {
        return Number(a) === Number(b);
      },
      setter: function(T, v, ev) {
        return T._state[this.id] = Number(v);
      }
    };
  }
});

Object.entity.defineProperty({
  id: "Date",
  methods: function() {
    return {
      comparator: function(a, b) {
        return Date.compare(a, b) === 0;
      }
    };
  }
});

Object.entity.defineProperty({
  id: "Value",
  mixin: function(_super) {
    return {
      getValue: function() {
        return this.prop("value");
      },
      setValue: function(v) {
        return this.prop("value", v);
      },
      isEmptyValue: function(e) {
        return !this.getValue();
      },
      equalsToValue: function(v) {
        return v && (this.getValue() === ("" + v));
      }
    };
  }
});

Object.entity.defineProperty({
  id: "MultiValue",
  mixin: function(_super) {
    return {
      valueChanged: function(ev, v) {
        this.prop("mvalue", (v ? (v.split && v.length ? v.split(this.mvalueSeparator || ",") : ["" + v]) : []));
        _super.valueChanged.call(this, ev, v);
      },
      getMultiValue: function() {
        return this.mvalue || [];
      },
      equalsValue: function(v) {
        var _ref;
        return v && (_ref = "" + v, __indexOf.call(this.getMultiValue(), _ref) >= 0);
      },
      putIntoMultiValue: function(pk, v) {
        var changed, contained, i, mv, _i, _len;
        if (!pk) {
          return;
        }
        mv = this.getMultiValue();
        pk = "" + pk;
        contained = __indexOf.call(mv, pk) >= 0;
        changed = false;
        if (v === -1) {
          v = (contained ? 0 : 1);
        }
        if (v && !contained) {
          mv.push(pk);
          changed = true;
        }
        if ((!v) && contained) {
          for (i = _i = 0, _len = mv.length; _i < _len; i = ++_i) {
            pk = mv[i];
            if (pk === mv[i]) {
              mv.splice(i, 1);
              changed = true;
              break;
            }
          }
        }
        return changed && this.setValue(mv.sort().join(this.mvalueSeparator));
      }
    };
  }
});

Object.entity.defineProperty({
  id: "IsReady",
  methods: function() {
    return {
      comparator: function(a, b) {
        return (!a) === (!b);
      },
      setter: function(T, v, ev) {
        return T._state[this.id] = !!v;
      }
    };
  },
  mixin: function(_super) {
    return {
      isReady: function() {
        return this.prop("ready");
      },
      setIsReady: function() {
        return this.prop("ready", true);
      },
      unsetIsReady: function() {
        return this.prop("ready", false);
      }
    };
  }
});


/*
Define EventHandler entity type
 */

Object.entity.define({
  id: "EventHandler",
  properties: ["ready:IsReady"],
  options: {
    ready: true
  },
  methods: function(_super) {
    var HANDLER_STUB;
    HANDLER_STUB = function(ev) {
      return ev.callback(Object.error.BAD, "No EventHandler Implementation: " + ev.uri);
    };
    return {
      onEvent: function(ev) {
        Object.log("" + this.id + ".onEvent", ev);
        if (this.isReady(ev)) {
          return this.handleEvent(ev);
        } else {
          return (this.deferedEvents || (this.deferedEvents = [])).push(ev);
        }
      },
      readyChanged: function(_ev, ready) {
        var ev, evs, _i, _len, _results;
        if (ready) {
          evs = this.deferedEvents;
          this.deferedEvents = null;
          if (evs) {
            _results = [];
            for (_i = 0, _len = evs.length; _i < _len; _i++) {
              ev = evs[_i];
              _results.push(this.handleEventImpl(ev));
            }
            return _results;
          }
        }
      },
      createEventHandlerImpl: function() {
        return function(ev) {
          return HANDLER_STUB.call(this, ev);
        };
      },
      init: function() {
        if (!this.id) {
          throw Error('No id for EventHandler');
        }
        _super.init.call(this);
        if (!this.handleEvent) {
          return this.handleEvent = this.createEventHandlerImpl();
        }
      }
    };
  }
});


/*
Define Cache entity type
 */

Object.entity.define({
  id: "Cache extends EventHandler",
  methods: function(_super) {
    var DRY_VERSION;
    DRY_VERSION = -1;
    return {
      resolveUri: Function.NONE,
      cacheDeserializer: Object.parse,
      fetchUnmarshaller: Function.NONE,
      getVersion: function() {
        return -1;
      },
      fetch: function(uri, cb) {
        return Object.fire({
          uri: this.resolveUri(uri),
          callback: cb,
          unmarshaller: this.fetchUnmarshaller
        });
      },
      createDryRunEventHandlerImpl: function() {
        return (function(_this) {
          return function(ev) {
            return _this.fetch(ev.uri, function(err, data) {
              if (!err && data) {
                return ev.callback(err, this.cacheDeserializer.call(id, data));
              }
            });
          };
        })(this);
      },
      createEventHandlerImpl: function() {
        var _cache;
        if ((this.getVersion() === DRY_VERSION) || !this.storage) {
          return this.createDryRunEventHandlerImpl();
        }
        _cache = {};
        return (function(_this) {
          return function(ev) {
            var id, key, r, u;
            u = ev.uri;
            id = u.id.slice(2);
            key = _this.id + ":" + id;
            r = _cache[id];
            if (!r && (r = _lstorage[key]) && (r.indexOf(_ver + ":") === 0) && (r = r.slice(_ver.length + 1))) {
              r = _cache[id] = _this.cacheDeserializer.call(id, r);
            } else {
              r = null;
            }
            if (r) {
              return ev.callback(null, r);
            } else {
              return _this.fetch(id, function(err, data) {
                var rr;
                rr = null;
                if (err) {
                  Object.error(err, "fetch data for versioned cache").log();
                } else if (data) {
                  rr = _cache[id] = (typeof data === "object" ? data : _this.cacheDeserializer.call(id, data));
                  try {
                    _this.storage.setItem(key, _ver + ":" + (typeof data === "object" ? JSON.stringify(data) : data));
                  } catch (_error) {}
                }
                return ev.callback(err, rr);
              });
            }
          };
        })(this);
      }
    };
  }
});


/*
Define Cache entity type
 */

Object.entity.define({
  id: "CodeLoader extends Cache",
  methods: function(_super) {
    return {
      resolveUri: function(uri) {
        return "http://*/js/" + uri.domain + ".js?v=" + (this.getVersion());
      },
      cacheDeserializer: function(s) {
        try {
          (Function.call(Function, s))();
          return true;
        } catch (_error) {
          return Object.error(_error, "JS syntax:" + ex.message).log();
        }
      },
      createDryRunEventHandlerImpl: function() {
        return (function(_this) {
          return function(ev) {
            return Object.require([_this.resolveUri(ev.uri)], ev.callback);
          };
        })(this);
      }
    };
  }
});

Object.entity.define({
  id: "ValueStorage",
  properties: ["value:Value"],
  methods: function(_super) {
    return {
      init: function() {
        this.storage = this.createStorage();
        this.initStorage();
        return _super.init.call(this);
      },
      createStorage: function() {
        return this._options.storage || {
          getItem: function(key) {
            return this[key];
          },
          setItem: function(key, value) {
            return this[key] = value;
          }
        };
      },
      initStorage: function() {
        var s;
        return this.value = (s = this.storage.getItem(this.id)) && Object.parse(s) || this.value || {};
      },
      propertyChanged: function(ev, value, propId) {
        _super.propertyChanged.call(this(ev, value, propId));
        if (propId !== 'value') {
          if (this.valueDelta) {
            return this.valueDelta[propId] = value;
          } else {
            this.valueDelta = {};
            return setTimeout((function(_this) {
              return function() {
                _this.valueDelta = null;
                return _this.setValue(Object.clone(_this.getValue(), che.delta));
              };
            })(this), 1000);
          }
        }
      },
      valueChanged: function(ev, val) {
        this.persistValue(val);
        return _super.valueChanged.call(this, ev, val);
      },
      persistValue: function(v) {
        var s;
        try {
          if (this.storage.getItem(this.id) !== (s = JSON.stringify(v))) {
            return this.storage.setItem(this.id, s);
          }
        } catch (_error) {}
      }
    };
  }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRDpcXHd3d1xcYXhpb2RcXGpzXFxheGlvZC1iYXNpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJEOlxcd3d3XFxheGlvZFxcc3JjXFxqc1xcYXhpb2QtYmFzaWNzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxJQUFBLHFKQUFBOztBQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBZCxDQUNJO0FBQUEsRUFBQSxFQUFBLEVBQUksUUFBSjtBQUFBLEVBQ0EsT0FBQSxFQUFVLFNBQUEsR0FBQTtXQUVOO0FBQUEsTUFBQSxVQUFBLEVBQVksUUFBUSxDQUFDLEtBQXJCO01BRk07RUFBQSxDQURWO0NBREosQ0FBQSxDQUFBOztBQUFBLE1BUU0sQ0FBQyxNQUFNLENBQUMsY0FBZCxDQUNJO0FBQUEsRUFBQSxFQUFBLEVBQUksU0FBSjtBQUFBLEVBQ0EsT0FBQSxFQUFVLFNBQUEsR0FBQTtXQUVOO0FBQUEsTUFBQSxVQUFBLEVBQVksU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO2VBQVUsQ0FBQyxDQUFBLENBQUQsQ0FBQSxLQUFXLENBQUMsQ0FBQSxDQUFELEVBQXJCO01BQUEsQ0FBWjtBQUFBLE1BRUEsTUFBQSxFQUFRLFNBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxFQUFQLEdBQUE7ZUFBYyxDQUFDLENBQUMsTUFBTyxDQUFBLElBQUMsQ0FBQSxFQUFELENBQVQsR0FBZ0IsQ0FBQSxDQUFJLEVBQWxDO01BQUEsQ0FGUjtNQUZNO0VBQUEsQ0FEVjtDQURKLENBUkEsQ0FBQTs7QUFBQSxNQWtCTSxDQUFDLE1BQU0sQ0FBQyxjQUFkLENBQ0k7QUFBQSxFQUFBLEVBQUEsRUFBSSxRQUFKO0FBQUEsRUFDQSxPQUFBLEVBQVUsU0FBQSxHQUFBO1dBRU47QUFBQSxNQUFBLFVBQUEsRUFBWSxTQUFDLENBQUQsRUFBSSxDQUFKLEdBQUE7ZUFBVSxNQUFBLENBQU8sQ0FBUCxDQUFBLEtBQWEsTUFBQSxDQUFPLENBQVAsRUFBdkI7TUFBQSxDQUFa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QUFDLENBQUEsVUFBRCxHQUFjLElBQWQsQ0FBQTt1QkFDQSxLQUFDLENBQUEsUUFBRCxDQUFVLE1BQU0sQ0FBQyxLQUFQLENBQWEsS0FBQyxDQUFBLFFBQUQsQ0FBQSxDQUFiLEVBQTBCLEdBQUcsQ0FBQyxLQUE5QixDQUFWLEVBRkc7Y0FBQSxFQUFBO1lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLEVBSUssSUFKTCxFQUpKO1dBREo7U0FIYTtNQUFBLENBZGpCO0FBQUEsTUE0QkEsWUFBQSxFQUFjLFNBQUMsRUFBRCxFQUFLLEdBQUwsR0FBQTtBQUNWLFFBQUEsSUFBQyxDQUFBLFlBQUQsQ0FBYyxHQUFkLENBQUEsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBcEIsQ0FBeUIsSUFBekIsRUFBNEIsRUFBNUIsRUFBZ0MsR0FBaEMsRUFGVTtNQUFBLENBNUJkO0FBQUEsTUFnQ0EsWUFBQSxFQUFjLFNBQUMsQ0FBRCxHQUFBO0FBQ1YsWUFBQSxDQUFBO0FBQUE7QUFBSSxVQUFBLElBQStCLElBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFpQixJQUFDLENBQUEsRUFBbEIsQ0FBQSxLQUF5QixDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsU0FBTCxDQUFlLENBQWYsQ0FBTCxDQUF4RDttQkFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBaUIsSUFBQyxDQUFBLEVBQWxCLEVBQXNCLENBQXRCLEVBQUE7V0FBSjtTQUFBLGtCQURVO01BQUEsQ0FoQ2Q7TUFGSztFQUFBLENBRlQ7Q0FESixDQTFPQSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiIyBcbiMgQmFzaWMgcHJvcGVydHkgdHlwZXMuXG4jIFxuXG4jIHByb3BlcnR5IFtsaXF1aWRdLlxuT2JqZWN0LmVudGl0eS5kZWZpbmVQcm9wZXJ0eSBcbiAgICBpZDogXCJMaXF1aWRcIlxuICAgIG1ldGhvZHMgOiAtPlxuICAgICAgICAjIHZhbHVlIGNvbXBhcmF0b3JcbiAgICAgICAgY29tcGFyYXRvcjogRnVuY3Rpb24uRkFMU0VcblxuXG4jIHByb3BlcnR5IFtib29sZWFuXS5cbk9iamVjdC5lbnRpdHkuZGVmaW5lUHJvcGVydHkgXG4gICAgaWQ6IFwiQm9vbGVhblwiXG4gICAgbWV0aG9kcyA6IC0+XG4gICAgICAgICMgdmFsdWUgY29tcGFyYXRvclxuICAgICAgICBjb21wYXJhdG9yOiAoYSwgYikgLT4gKG5vdCBhKSBpcyAobm90IGIpICMgY29tcGFyZXMgYXMgYm9vbGVhblxuICAgICAgICAjIHZhbHVlIHNldHRlclxuICAgICAgICBzZXR0ZXI6IChULCB2LCBldikgLT4gVC5fc3RhdGVbQGlkXSA9IG5vdCBub3QgdlxuXG5cbiMgcHJvcGVydHkgW251bWJlcl0uXG5PYmplY3QuZW50aXR5LmRlZmluZVByb3BlcnR5IFxuICAgIGlkOiBcIk51bWJlclwiXG4gICAgbWV0aG9kcyA6IC0+XG4gICAgICAgICMgdmFsdWUgY29tcGFyYXRvclxuICAgICAgICBjb21wYXJhdG9yOiAoYSwgYikgLT4gTnVtYmVyKGEpIGlzIE51bWJlcihiKVxuICAgICAgICAjIHZhbHVlIHNldHRlclxuICAgICAgICBzZXR0ZXI6IChULCB2LCBldikgLT4gVC5fc3RhdGVbQGlkXSA9IE51bWJlcih2KVxuXG5cbiMgcHJvcGVydHkgW2RhdGVdLlxuT2JqZWN0LmVudGl0eS5kZWZpbmVQcm9wZXJ0eSBcbiAgICBpZDogXCJEYXRlXCJcbiAgICBtZXRob2RzIDogLT5cbiAgICAgICAgIyB2YWx1ZSBjb21wYXJhdG9yXG4gICAgICAgIGNvbXBhcmF0b3I6IChhLCBiKSAtPiBEYXRlLmNvbXBhcmUoYSwgYikgaXMgMFxuXG4jIHByb3BlcnR5IFt2YWx1ZV0uXG5PYmplY3QuZW50aXR5LmRlZmluZVByb3BlcnR5IFxuICAgIGlkOiBcIlZhbHVlXCJcbiAgICBtaXhpbjogIChfc3VwZXIpIC0+XG4gICAgXG4gICAgICAgICMgZ2V0IHZhbHVlIFxuICAgICAgICBnZXRWYWx1ZTogLT4gQHByb3AgXCJ2YWx1ZVwiXG5cbiAgICAgICAgIyBzZXQgdmFsdWUgXG4gICAgICAgIHNldFZhbHVlOiAodikgLT4gQHByb3AgXCJ2YWx1ZVwiLCB2XG5cbiAgICAgICAgIyBjaGVjayBpZiB2YWx1ZSBpcyBlbXB0eVxuICAgICAgICBpc0VtcHR5VmFsdWU6IChlKSAtPiBub3QgQGdldFZhbHVlKClcblxuICAgICAgICAjIGNoZWNrIGlmIHZhbHVlIGVxdWFscyB0byBcbiAgICAgICAgZXF1YWxzVG9WYWx1ZTogKHYpIC0+IHYgYW5kIChAZ2V0VmFsdWUoKSBpcyAoXCJcIiArIHYpKVxuXG4jIHByb3BlcnR5IFttdWx0aVZhbHVlXS5cbiMgSXQgcHJvdmlkZXMgdmFsdWUgbXVsdGlzZXQgbG9naWMuXG5cbiMgcGF0Y2ggZW50aXR5IHR5cGUgYXR0YWNoZWQgdG9cbk9iamVjdC5lbnRpdHkuZGVmaW5lUHJvcGVydHkgXG4gICAgaWQ6IFwiTXVsdGlWYWx1ZVwiXG4gICAgbWl4aW46ICAgKF9zdXBlcikgLT5cbiAgICAgICAgdmFsdWVDaGFuZ2VkOiAoZXYsIHYpIC0+XG4gICAgICAgICAgICBAcHJvcCBcIm12YWx1ZVwiLCAoaWYgdiB0aGVuICgoaWYgKHYuc3BsaXQgYW5kIHYubGVuZ3RoKSB0aGVuIHYuc3BsaXQoQG12YWx1ZVNlcGFyYXRvciBvciBcIixcIikgZWxzZSBbXCJcIiArIHZdKSkgZWxzZSBbXSlcbiAgICAgICAgICAgIF9zdXBlci52YWx1ZUNoYW5nZWQuY2FsbCB0aGlzLCBldiwgdlxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgZ2V0TXVsdGlWYWx1ZTogLT4gQG12YWx1ZSBvciBbXVxuICAgIFxuICAgICAgICBlcXVhbHNWYWx1ZTogKHYpIC0+IHYgYW5kICgoXCJcIiArIHYpIGluIEBnZXRNdWx0aVZhbHVlKCkpXG4gICAgXG4gICAgICAgIHB1dEludG9NdWx0aVZhbHVlOiAocGssIHYpIC0+XG4gICAgICAgICAgICByZXR1cm4gICAgdW5sZXNzIHBrXG4gICAgICAgICAgICBtdiA9IEBnZXRNdWx0aVZhbHVlKClcbiAgICAgICAgICAgIHBrID0gXCJcIiArIHBrXG4gICAgICAgICAgICBjb250YWluZWQgPSBwayBpbiBtdlxuICAgICAgICAgICAgY2hhbmdlZCA9IGZhbHNlXG4gICAgICAgICAgICB2ID0gKGlmIGNvbnRhaW5lZCB0aGVuIDAgZWxzZSAxKSBpZiB2IGlzIC0xXG4gICAgICAgICAgICBpZiAodikgYW5kIG5vdCBjb250YWluZWRcbiAgICAgICAgICAgICAgICBtdi5wdXNoIHBrXG4gICAgICAgICAgICAgICAgY2hhbmdlZCA9IHRydWVcbiAgICAgICAgICAgIGlmIChub3QgdikgYW5kIGNvbnRhaW5lZFxuICAgICAgICAgICAgICAgIGZvciBwaywgaSBpbiBtdlxuICAgICAgICAgICAgICAgICAgICBpZiBwayBpcyBtdltpXVxuICAgICAgICAgICAgICAgICAgICAgICAgbXYuc3BsaWNlIGksIDFcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2hhbmdlZCBhbmQgQHNldFZhbHVlKG12LnNvcnQoKS5qb2luKEBtdmFsdWVTZXBhcmF0b3IpKVxuICAgICAgICAgICAgXG5cbiMgcHJvcGVydHkgW3ZhbHVlQnVuZGxlXS5cbiMgSXQgbWFuYWdlIGEgc2V0IG9mIGR5bmFtaWMgcHJvcGVydGllcyBhcyBwYXJ0IG9mIFt2YWx1ZV0gcHJvcGVydHkgYnVuZGxlLlxuT2JqZWN0LmVudGl0eS5kZWZpbmVQcm9wZXJ0eSBcbiAgICBpZDogXCJJc1JlYWR5XCJcbiAgICAjIHBhdGNoIGVudGl0eSB0eXBlIGF0dGFjaGVkIHRvXG4gICAgbWV0aG9kcyA6IC0+XG4gICAgICAgICMgdmFsdWUgY29tcGFyYXRvclxuICAgICAgICBjb21wYXJhdG9yOiAoYSwgYikgLT4gKG5vdCBhKSBpcyAobm90IGIpICMgY29tcGFyZXMgYXMgYm9vbGVhblxuICAgICAgICAjIHZhbHVlIHNldHRlclxuICAgICAgICBzZXR0ZXI6IChULCB2LCBldikgLT4gVC5fc3RhdGVbQGlkXSA9ICAhIXZcbiAgICAgICAgXG4gICAgbWl4aW46ICAoX3N1cGVyKSAtPlxuICAgICAgICAjIEByZXR1cm4gdHJ1ZSBpZiBoYW5kbGVyIGlzIHJlYWR5IHRvIHBlcmZvcm0gZXZlbnRzXG4gICAgICAgIGlzUmVhZHk6IC0+IEBwcm9wIFwicmVhZHlcIlxuXG4gICAgICAgICMgQHNldCByZWFkeSBmbGFnIHRvIHRydWVcbiAgICAgICAgc2V0SXNSZWFkeTogLT4gQHByb3AgXCJyZWFkeVwiLCB0cnVlXG5cbiAgICAgICAgIyBAc2V0IHJlYWR5IGZsYWcgdG8gdHJ1ZVxuICAgICAgICB1bnNldElzUmVhZHk6IC0+IEBwcm9wIFwicmVhZHlcIiwgZmFsc2VcbiMjI1xuRGVmaW5lIEV2ZW50SGFuZGxlciBlbnRpdHkgdHlwZVxuIyMjXG5PYmplY3QuZW50aXR5LmRlZmluZSBcbiAgICBpZCA6IFwiRXZlbnRIYW5kbGVyXCIgXG4gICAgcHJvcGVydGllczogW1wicmVhZHk6SXNSZWFkeVwiXVxuICAgIG9wdGlvbnM6XG4gICAgICAgIHJlYWR5OiB0cnVlICMgcmVhZHkgYnkgZGVmYXVsdFxuICAgIG1ldGhvZHM6IChfc3VwZXIpIC0+XG5cbiAgICAgICAgIyBubyBoYW5kbGVyIHN0dWJcbiAgICAgICAgSEFORExFUl9TVFVCID0gKGV2KSAtPiBldi5jYWxsYmFjayBPYmplY3QuZXJyb3IuQkFELCBcIk5vIEV2ZW50SGFuZGxlciBJbXBsZW1lbnRhdGlvbjogI3tldi51cml9XCJcblxuICAgICAgICAjIGhhbmRsZXMgRXZlbnQgXG4gICAgICAgIG9uRXZlbnQ6IChldikgLT5cbiAgICAgICAgICAgIE9iamVjdC5sb2coXCIje0BpZH0ub25FdmVudFwiLCBldikgXG4gICAgICAgICAgICBpZiBAaXNSZWFkeShldilcbiAgICAgICAgICAgICAgICBAaGFuZGxlRXZlbnQgZXYgXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgIyBUaGUgZXhlY3V0aW9uIHN0YWNrIGlzIHRvIGJ1ZmZlciB1cCBldmVudHMuXG4gICAgICAgICAgICAgICAgKEBkZWZlcmVkRXZlbnRzIG9yIChAZGVmZXJlZEV2ZW50cyA9IFtdKSkucHVzaCBldlxuXG4gICAgICAgICMgZXZhbHVhdGUgZGVmZXJlZCBldmVudHNcbiAgICAgICAgcmVhZHlDaGFuZ2VkOiAoX2V2LCByZWFkeSkgLT5cbiAgICAgICAgICAgIGlmIHJlYWR5XG4gICAgICAgICAgICAgICAgZXZzID0gQGRlZmVyZWRFdmVudHNcbiAgICAgICAgICAgICAgICBAZGVmZXJlZEV2ZW50cyA9IG51bGxcbiAgICAgICAgICAgICAgICBAaGFuZGxlRXZlbnRJbXBsIGV2IGZvciBldiBpbiBldnMgaWYgZXZzXG5cbiAgICAgICAgIyBjcmVhdGVzIEV2ZW50IGhhbmRsZXIgaW1wbGVtZW50YXRpb25cbiAgICAgICAgY3JlYXRlRXZlbnRIYW5kbGVySW1wbDogLT5cbiAgICAgICAgICAgIChldikgLT5cbiAgICAgICAgICAgICAgICBIQU5ETEVSX1NUVUIuY2FsbCBALCBldlxuXG4gICAgICAgIGluaXQ6IC0+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdObyBpZCBmb3IgRXZlbnRIYW5kbGVyJykgdW5sZXNzIEBpZFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBfc3VwZXIuaW5pdC5jYWxsIEBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgKEBoYW5kbGVFdmVudCA9IEBjcmVhdGVFdmVudEhhbmRsZXJJbXBsKCkpIHVubGVzcyBAaGFuZGxlRXZlbnRcbiAgICAgICAgICAgIFxuIyMjXG5EZWZpbmUgQ2FjaGUgZW50aXR5IHR5cGVcbiMjI1xuT2JqZWN0LmVudGl0eS5kZWZpbmUgXG5cbiAgICBpZDogXCJDYWNoZSBleHRlbmRzIEV2ZW50SGFuZGxlclwiXG5cbiAgICBtZXRob2RzOiAoX3N1cGVyKSAtPlxuICAgICAgICBcbiAgICAgICAgRFJZX1ZFUlNJT04gPSAtMVxuICAgICAgICBcbiAgICAgICAgcmVzb2x2ZVVyaTogRnVuY3Rpb24uTk9ORVxuICAgICAgICBcbiAgICAgICAgY2FjaGVEZXNlcmlhbGl6ZXIgOiBPYmplY3QucGFyc2VcbiAgICAgICAgXG4gICAgICAgIGZldGNoVW5tYXJzaGFsbGVyIDogRnVuY3Rpb24uTk9ORSAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBnZXRWZXJzaW9uOiAtPiAtMVxuICAgICAgICBcbiAgICAgICAgZmV0Y2g6ICh1cmksIGNiKSAtPlxuICAgICAgICAgICAgT2JqZWN0LmZpcmVcbiAgICAgICAgICAgICAgICB1cmk6IEByZXNvbHZlVXJpIHVyaVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBjYlxuICAgICAgICAgICAgICAgIHVubWFyc2hhbGxlcjogQGZldGNoVW5tYXJzaGFsbGVyXG4gICAgICAgIFxuICAgICAgICBjcmVhdGVEcnlSdW5FdmVudEhhbmRsZXJJbXBsIDogLT5cbiAgICAgICAgICAgIChldikgPT5cbiAgICAgICAgICAgICAgICBAZmV0Y2ggZXYudXJpLCAoZXJyLCBkYXRhKSAtPiBcbiAgICAgICAgICAgICAgICAgICAgZXYuY2FsbGJhY2sgZXJyLCBAY2FjaGVEZXNlcmlhbGl6ZXIuY2FsbChpZCwgZGF0YSkgaWYgbm90IGVyciBhbmQgZGF0YVxuXG4gICAgICAgIGNyZWF0ZUV2ZW50SGFuZGxlckltcGwgOiAtPlxuXG4gICAgICAgICAgICByZXR1cm4gQGNyZWF0ZURyeVJ1bkV2ZW50SGFuZGxlckltcGwoKSBpZiAoQGdldFZlcnNpb24oKSBpcyBEUllfVkVSU0lPTikgb3Igbm90IEBzdG9yYWdlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIF9jYWNoZSA9IHt9XG4gXG4gICAgICAgICAgICAoZXYpID0+XG4gICAgICAgICAgICAgICAgdSA9IGV2LnVyaVxuICAgICAgICAgICAgICAgIGlkID0gdS5pZFsyLi5dXG4gICAgICAgICAgICAgICAga2V5ID0gQGlkICsgXCI6XCIgKyBpZFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHIgPSBfY2FjaGVbaWRdXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgIyB0cnkgbG9jYWwgc3RvcmFnZVxuICAgICAgICAgICAgICAgIGlmIG5vdCByIGFuZCAociA9IF9sc3RvcmFnZVtrZXldKSBhbmQgKHIuaW5kZXhPZihfdmVyICsgXCI6XCIpIGlzIDApIGFuZCAociA9IHJbX3Zlci5sZW5ndGggKyAxLi5dKVxuICAgICAgICAgICAgICAgICAgICByID0gX2NhY2hlW2lkXSA9IEBjYWNoZURlc2VyaWFsaXplci5jYWxsKGlkLCByKVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgciA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgclxuICAgICAgICAgICAgICAgICAgICBldi5jYWxsYmFjayBudWxsLCByXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAZmV0Y2ggaWQsIChlcnIsIGRhdGEpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICByciA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGVyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5lcnJvcihlcnIsIFwiZmV0Y2ggZGF0YSBmb3IgdmVyc2lvbmVkIGNhY2hlXCIpLmxvZygpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByciA9IF9jYWNoZVtpZF0gPSAoaWYgKHR5cGVvZiAoZGF0YSkgaXMgXCJvYmplY3RcIikgdGhlbiBkYXRhIGVsc2UgQGNhY2hlRGVzZXJpYWxpemVyLmNhbGwoaWQsIGRhdGEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc3RvcmFnZS5zZXRJdGVtIGtleSwgKF92ZXIgKyBcIjpcIiArICgoaWYgKHR5cGVvZiAoZGF0YSkgaXMgXCJvYmplY3RcIikgdGhlbiBKU09OLnN0cmluZ2lmeShkYXRhKSBlbHNlIGRhdGEpKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgZXYuY2FsbGJhY2sgZXJyLCByclxuICAgXG4jIyNcbkRlZmluZSBDYWNoZSBlbnRpdHkgdHlwZVxuIyMjXG5PYmplY3QuZW50aXR5LmRlZmluZSBcblxuICAgIGlkOiBcIkNvZGVMb2FkZXIgZXh0ZW5kcyBDYWNoZVwiXG5cbiAgICBtZXRob2RzOiAoX3N1cGVyKSAtPlxuICAgICAgICBcbiAgICAgICAgcmVzb2x2ZVVyaTogKHVyaSkgLT4gXCJodHRwOi8vKi9qcy8je3VyaS5kb21haW59LmpzP3Y9I3tAZ2V0VmVyc2lvbigpfVwiXG4gICAgICAgIFxuICAgICAgICBjYWNoZURlc2VyaWFsaXplcjogKHMpIC0+XG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICAoRnVuY3Rpb24uY2FsbChGdW5jdGlvbiwgcykpKClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgY2F0Y2ggXG4gICAgICAgICAgICAgICAgT2JqZWN0LmVycm9yKF9lcnJvciwgXCJKUyBzeW50YXg6XCIgKyBleC5tZXNzYWdlKS5sb2coKVxuXG4gICAgICAgICBjcmVhdGVEcnlSdW5FdmVudEhhbmRsZXJJbXBsOiAtPlxuICAgICAgICAgICAgKGV2KSA9PlxuICAgICAgICAgICAgICAgIE9iamVjdC5yZXF1aXJlIFtAcmVzb2x2ZVVyaSBldi51cmldLCBldi5jYWxsYmFja1xuXG4jIFN0b3JhZ2UgZGVmaW5pdGlvbi5cbk9iamVjdC5lbnRpdHkuZGVmaW5lIFxuICAgIGlkOiBcIlZhbHVlU3RvcmFnZVwiXG4gICAgcHJvcGVydGllczogW1widmFsdWU6VmFsdWVcIl1cbiAgICBtZXRob2RzOiAoX3N1cGVyKSAtPlxuXG4gICAgICAgIGluaXQ6IC0+IFxuICAgICAgICAgICAgQHN0b3JhZ2UgPSBAY3JlYXRlU3RvcmFnZSgpIFxuICAgICAgICAgICAgQGluaXRTdG9yYWdlKClcbiAgICAgICAgICAgIF9zdXBlci5pbml0LmNhbGwgQFxuICAgICAgICBcbiAgICAgICAgY3JlYXRlU3RvcmFnZTogLT5cbiAgICAgICAgICAgIEBfb3B0aW9ucy5zdG9yYWdlIG9yXG4gICAgICAgICAgICAgICAgZ2V0SXRlbTogKGtleSkgLT4gQFtrZXldXG4gICAgICAgICAgICAgICAgc2V0SXRlbTogKGtleSwgdmFsdWUpIC0+IEBba2V5XSA9IHZhbHVlXG5cbiAgICAgICAgaW5pdFN0b3JhZ2U6IC0+XG4gICAgICAgICAgICBAdmFsdWUgPSAocyA9IEBzdG9yYWdlLmdldEl0ZW0oQGlkKSkgYW5kIE9iamVjdC5wYXJzZShzKSBvciBAdmFsdWUgb3Ige31cblxuICAgICAgICAgIyBwcm9wZXJ0eSBnZXQvc2V0XG4gICAgICAgIHByb3BlcnR5Q2hhbmdlZDogKGV2LCB2YWx1ZSwgcHJvcElkKSAtPlxuICAgICAgICAgICAgX3N1cGVyLnByb3BlcnR5Q2hhbmdlZC5jYWxsIEAgZXYsIHZhbHVlLCBwcm9wSWRcbiAgICBcbiAgICAgICAgICAgIHVubGVzcyBwcm9wSWQgaXMgJ3ZhbHVlJ1xuICAgICAgICAgICAgICAgIGlmIChAdmFsdWVEZWx0YSlcbiAgICAgICAgICAgICAgICAgICAgQHZhbHVlRGVsdGFbcHJvcElkXSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBAdmFsdWVEZWx0YSA9IHt9XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAdmFsdWVEZWx0YSA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAc2V0VmFsdWUgT2JqZWN0LmNsb25lKEBnZXRWYWx1ZSgpLCBjaGUuZGVsdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAsMTAwMClcblxuICAgICAgICB2YWx1ZUNoYW5nZWQ6IChldiwgdmFsKSAtPlxuICAgICAgICAgICAgQHBlcnNpc3RWYWx1ZSB2YWxcbiAgICAgICAgICAgIF9zdXBlci52YWx1ZUNoYW5nZWQuY2FsbCBALCBldiwgdmFsXG5cbiAgICAgICAgcGVyc2lzdFZhbHVlOiAodikgLT5cbiAgICAgICAgICAgIHRyeSBAc3RvcmFnZS5zZXRJdGVtIEBpZCwgcyB1bmxlc3MgQHN0b3JhZ2UuZ2V0SXRlbShAaWQpIGlzIChzID0gSlNPTi5zdHJpbmdpZnkodikpXG4gICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgIl19
