(function() {
  var __slice = [].slice;

  (function(global) {
    var IDB, IDBCursor, IDBKeyRange, NEXT, PREV, S4, guid, _CURSOR, _FIND, _OPS, _PUT, _STORE, _UPGRADE, _getDoc, _openCursorArgs;
    IDB = global.indexedDB || global.webkitIndexedDB || global.mozIndexedDB || global.msIndexedDB;
    IDBKeyRange = global.IDBKeyRange || global.webkitIDBKeyRange;
    IDBCursor = global.IDBCursor || global.webkitIDBCursor || global.mozIDBCursor || global.msIDBCursor;
    PREV = IDBCursor.PREV || "prev";
    NEXT = IDBCursor.NEXT || "next";
    S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    guid = function() {
      return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    };
    _openCursorArgs = function(options) {
      var desc, lower, range, upper;
      desc = options.descend || (options.dir === "desc");
      if (!(range = options.range)) {
        return [null, !desc ? NEXT : PREV];
      }
      if (range instanceof Array) {
        lower = range[0], upper = range[1];
        if (upper === null) {
          return [IDBKeyRange.lowerBound(lower)];
        } else if (lower === null) {
          return [IDBKeyRange.upperBound(upper)];
        } else {
          if (desc = lower > upper) {
            return [IDBKeyRange.apply(null, __slice.call([upper, lower]).concat([PREV]))];
          } else {
            return [IDBKeyRange.apply(null, __slice.call([lower, upper]).concat([NEXT]))];
          }
        }
      }
      return [IDBKeyRange.only(range)];
    };
    _getDoc = function(store, ev) {
      var index, key, val;
      if (val = ev.id) {
        return store.get(val);
      }
      for (key in store.indexNames) {
        index = store.index(key);
        if (val = ev[index.keyPath]) {
          return index.get(val);
        }
      }
      return null;
    };
    _UPGRADE = (function() {
      var createStore, _idx;
      _idx = function(idx) {
        if (idx.keyPath) {
          return idx;
        } else {
          return {
            keyPath: idx
          };
        }
      };
      createStore = function(id, idx, indices) {
        var store, _i, _len, _results;
        if (idx == null) {
          idx = 'id';
        }
        if (indices == null) {
          indices = [];
        }
        store = this.createObjectStore(id, _idx(idx));
        _results = [];
        for (_i = 0, _len = indices.length; _i < _len; _i++) {
          idx = indices[_i];
          if (idx = _idx(idx)) {
            _results.push(store.createIndex(String.camelize(idx.keyPath, ","), idx.keyPath, idx.options));
          }
        }
        return _results;
      };
      return function(ev, cb) {
        var db, s, st, _i, _j, _len, _len1, _ref, _ref1, _results;
        this.log("Upgrade", ev.oldVersion, " => ", ev.newVersion);
        db = ev.target.result;
        _ref = db.objectStoreNames;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          s = _ref[_i];
          db.deleteObjectStore(s);
        }
        if (!this.scheme) {
          throw new Error("No scheme for db " + this.id);
        }
        _ref1 = this.scheme;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          st = _ref1[_j];
          if ((st = st.id ? st : {
            id: st
          })) {
            _results.push(createStore.call(db, st.id, st.keyPath, st.indices));
          }
        }
        return _results;
      };
    })();
    _STORE = function() {
      var txType, _ref;
      txType = (_ref = this.operation) === "query" || _ref === "read" ? "readonly" : "readwrite";
      try {
        this.store = this.home.db.transaction(this.scope || [this.storeId], txType).objectStore(this.storeId);
        return this.next();
      } catch (_error) {
        return this.callback(this.home.error('db', 'can\'t obtain the store ' + this.storeId, _error));
      }
    };
    _CURSOR = function(store, options, next) {
      var cursor, elements, key, processed, skipped, src;
      if (options == null) {
        options = {};
      }
      key = options.key;
      src = key ? store.index(String.camelize(key, ",")) : store;
      if (!(cursor = src.openCursor.apply(src, _openCursorArgs(options)))) {
        return next("No cursor");
      }
      cursor.onerror = function(e) {
        return next(Object.error("failed", "cursor error", e));
      };
      elements = [];
      skipped = 0;
      processed = 0;
      cursor.onsuccess = function(e) {
        cursor = e.target.result;
        if (!cursor) {
          return next(null, elements);
        }
        if (options.limit && processed >= options.limit) {
          next(null, elements);
          e.target.transaction.abort();
        } else if (options.offset && options.offset > skipped) {
          skipped++;
          cursor["continue"]();
        } else {
          elements.push(cursor.value);
          processed++;
          cursor["continue"]();
        }
        return 0;
      };
      return 0;
    };
    _FIND = function() {
      var cb, req;
      cb = this.next;
      if (!(req = _getDoc(this.store, this.options))) {
        return cb("not_specified");
      }
      req.onsuccess = function(event) {
        var data, err;
        if (!(data = event.target.result)) {
          err = "not_found";
        }
        return cb(err, data);
      };
      req.onerror = function() {
        return cb("not_found");
      };
      return 0;
    };
    _PUT = [
      function() {
        var docs, on_;
        docs = [].concat(this.payload);
        on_ = (function(_this) {
          return function() {
            var doc, tx;
            if (!(doc = docs.shift())) {
              return _this.next();
            }
            if (!doc.id) {
              doc.id = guid();
            }
            doc.ts = Date.now().valueOf();
            tx = _this.store.put(doc);
            tx.onsuccess = on_;
            return tx.onerror = _this.next;
          };
        })(this);
        return on_();
      }, function() {
        this.home.prop('touch', Date.now());
        return this.next();
      }
    ];
    _OPS = {
      query: function() {
        return _CURSOR(this.store, this.options, this.next);
      },
      find: _FIND,
      field: [
        _FIND, function(err, data) {
          return this.next(err, data != null ? data[this.options.field] : void 0);
        }
      ],
      insert: _PUT,
      update: _PUT,
      upsert: _PUT,
      remove: function() {
        var tx;
        tx = store["delete"](this.payload[0].id);
        tx.oncomplete = this.next;
        return tx.onerror = (function(_this) {
          return function() {
            return _this.next("Not Deleted");
          };
        })(this);
      },
      clear: function() {
        var tx;
        tx = store.clear();
        tx.oncomplete = this.next;
        return tx.onerror = (function(_this) {
          return function() {
            return _this.next("Not cleared");
          };
        })(this);
      },
      sync: function() {
        var uri;
        if (uri = this.prop('syncDeltaUri')) {
          return this.prop('syncDeltaUri', uri);
        }
      }
    };
    return Object.entity.define({
      id: "IndexedDatabase extends EventHandler",
      properties: ['touch', "sync"],
      version: 1,
      methods: function(_super) {
        return {
          launch: function(cb) {
            var tx;
            tx = IDB.open(this.id, this.version);
            tx.onblocked = (function(_this) {
              return function(ev) {
                return _this.error("db", "blocked");
              };
            })(this);
            tx.onerror = (function(_this) {
              return function(ev) {
                return _this.error("db", "couldn't not connect", ev);
              };
            })(this);
            tx.onabort = (function(_this) {
              return function(ev) {
                return _this.error("db", "connection aborted", ev);
              };
            })(this);
            tx.onsuccess = (function(_this) {
              return function(ev) {
                _this.db = ev.target.result;
                return _super.launch.call(_this, cb);
              };
            })(this);
            return tx.onupgradeneeded = (function(_this) {
              return function(ev) {
                var _ref;
                if ((_ref = global.localStorage) != null) {
                  _ref[_this.id + 'LastSync'] = 0;
                }
                return _UPGRADE.call(_this, ev, function() {
                  return _super.launch.call(_this, cb);
                });
              };
            })(this);
          },
          init: function() {
            var _ref;
            _super.init.call(this);
            this.prop('lastSynchedTimestamp', (_ref = global.localStorage) != null ? _ref[this.id + 'LastSync'] : void 0);
            if (this.socketChannel) {
              return Object.entity.create({
                id: this.id + 'Socket:SocketClient',
                channel: this.socketChannel
              });
            }
          },
          done: function() {
            var _ref;
            if ((_ref = this.db) != null) {
              _ref.close();
            }
            return _super.done.call(this);
          },
          handleEvent: function(ev, u) {
            ev.home = this;
            ev.storeId = u.path[0].toLowerCase();
            ev.operation = u.host;
            ev.payload = ev.docs || [ev.doc];
            ev.options = Object.update(u.params, ev.options);
            return Function.perform(ev, function(flow) {
              this.next = flow.next;
              return [_STORE].concat(_OPS[this.operation], this.callback);
            });
          },
          syncChanged: function(ev, delta) {
            if (!delta) {
              return this._newSyncTs = Date.now();
            }
            return Function.perform(this, function(flow) {
              return [
                function() {
                  var docs, storeId;
                  for (storeId in delta) {
                    docs = delta[storeId];
                    if ((storeId = storeId.split('_')[0])) {
                      Object.event.fire({
                        uri: "db://upsert/" + storeId,
                        docs: docs,
                        callback: flow.wait()
                      });
                    }
                  }
                  return flow.next();
                }, function() {
                  return this.prop('lastSynchedTimestamp', this._newSyncTs);
                }
              ];
            });
          },
          lastSynchedTimestampChanged: function(ev, ts) {
            var fn, _ref;
            if ((_ref = global.localStorage) != null) {
              _ref.setItem(this.id + 'LastSync', ts);
            }
            if (this.syncPeriod) {
              fn = (function(_this) {
                return function() {
                  return _this.prop('lastSynchedTimestampByPeriod', ts);
                };
              })(this);
              return global.setTimeout(fn, this.syncPeriod);
            } else {
              if (!this.prop('lastSynchedTimestampOnce')) {
                return this.prop('lastSynchedTimestampOnce', ts);
              }
            }
          }
        };
      }
    });
  })(this);

}).call(this);
