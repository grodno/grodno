(function() {
  Object.entity.define({
    id: 'mongo.Database',
    options: {},
    methods: function(_super) {
      var OPERATIONS, db, mongo, _close, _collection, _count, _cursor, _findOne, _first, _insert, _last, _obj, _objectID, _optionsKeys, _query, _queryOptionsFilter, _remove, _retPayload, _update, _upsert;
      mongo = typeof mongo === 'object' ? mongo : require("mongodb");
      db = void 0;
      _close = function() {
        if (db != null) {
          db.close();
        }
        return db = null;
      };
      _objectID = function(id) {
        if (id) {
          return new mongo.BSONPure.ObjectID(id);
        } else {
          return null;
        }
      };
      _obj = function(o) {
        if (typeof o === "string") {
          return Object.parse(o);
        } else {
          return o;
        }
      };
      _optionsKeys = ["limit", "sort", "fields", "skip", "hint", "explain", "snapshot", "timeout"];
      _queryOptionsFilter = function(params, r) {
        var k, v, _i, _len;
        if (r == null) {
          r = {};
        }
        for (_i = 0, _len = _optionsKeys.length; _i < _len; _i++) {
          k = _optionsKeys[_i];
          if (v = params[k]) {
            r[k] = v;
          }
        }
        r.sort = _obj(r.sort);
        r.fields = _obj(r.fields);
        r.limit = Number(r.limit) || 100;
        r.skip = Number(r.skip) || 0;
        return r;
      };
      _first = function(collectionId, flow) {
        return function() {
          this.next = flow.next;
          this.collectionId = collectionId;
          if (!this.query) {
            this.query = Object.parse(this.query) || _objectID(this.docId || this.hash);
          }
          if (!this.payload) {
            this.payload = this.doc || this.docs;
          }
          if (db) {
            return this.next(null, db);
          } else {
            return _mongo().connect(this.home.uri, this.home.options, this.next);
          }
        };
      };
      _collection = function(err, db) {
        if (err) {
          return this.next(err);
        }
        return db.collection(this.collectionId, this.next);
      };
      _cursor = function(err, collection) {
        if (err) {
          return this.next(err);
        }
        return collection.find(this.query, _queryOptionsFilter(this), this.next);
      };
      _count = function(err, cursor) {
        if (err) {
          return this.next(err);
        } else {
          return this.next(null, cursor.count);
        }
      };
      _query = function(err, cursor) {
        if (err) {
          return this.next(err);
        } else {
          return cursor.toArray(this.next);
        }
      };
      _findOne = function(err, docs) {
        return this.next(err, Array.item(docs));
      };
      _insert = function(err, collection) {
        if (err) {
          return this.next(err);
        } else {
          return collection.insert(this.payload, this.options, this.next);
        }
      };
      _update = function(err, collection) {
        if (err) {
          return this.next(err);
        } else {
          return collection.update(this.query, this.payload, this.options, this.next);
        }
      };
      _upsert = function(err, collection) {
        if (err) {
          return this.next(err);
        } else {
          return collection.update(this.query, this.payload, Object.update(this.options, {
            upsert: true
          }), this.next);
        }
      };
      _remove = function(err, collection) {
        if (err) {
          return this.next(err);
        } else {
          return collection.remove(this.query, this.next);
        }
      };
      _retPayload = function(err) {
        return this.next(err, err ? null : this.payload);
      };
      _last = function(err, result) {
        if (err) {
          _close();
        }
        return this.next(err, result);
      };
      OPERATIONS = {
        query: [_cursor, _query],
        count: [_cursor, _count],
        find: [_cursor, _query, _findOne],
        insert: [_insert, _retPayload],
        update: [_update, _retPayload],
        upsert: [_upsert, _retPayload],
        remove: _remove
      };
      return {
        perform: function(collectionId, op, opts, cb) {
          if (op == null) {
            op = 'query';
          }
          if (opts == null) {
            opts = {};
          }
          opts = Object.clone(opts, {
            home: this
          });
          this.log(collectionId, op);
          return Function.perform(opts, function(flow) {
            return [_first(collectionId, flow)].concat(_collection, OPERATIONS[op], _last, cb);
          });
        },
        onEvent: function(ev, u) {
          if (u == null) {
            u = ev.uri;
          }
          return this.perform(u.host, u.path[0], ev, ev.callback);
        },
        done: function() {
          _close();
          return _super.done.call(this);
        }
      };
    }
  });

}).call(this);
