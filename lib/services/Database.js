import Dexie from 'dexie';
import { AService } from './AService';

export class DatabaseService extends AService {
  constructor(props, $) {
    super(props, $)
    const { schema, name = 'dexie' } = props;
    const dexie = new Dexie(name, 4);
    dexie.version(1).stores({ ...schema, _meta: 'id' });
    dexie.version(2).upgrade(() => null);
    dexie.version(3).upgrade(() => null);
    dexie.version(4).upgrade(() => null);
    Object.assign(this, {
      dexie,
      remote: $.app.firebase.impl,
      cache: {},
      dbkeys: Object.keys(schema)
    });
    this.dbkeys.forEach(key => {
      this['get' + String.capitalize(key)] = () => this.getIndex(key)
    })
  }
  openDb() {
    // Open the database
    this.dexie.open().then(() => this.emit('this.opened')).catch(this.error);
  }
  init() {
    this.openDb();
  }

  onOpened() {
    return this.syncAll()
  }
  onUpsertNews({ data }) {
    return this.upsert('news', data)
  }
  onUpsertAds({ data }) {
    return this.upsert('ads', data)
  }

  getMeta() {
    return this.getTable('_meta').toArray().then(arr => Array.toHash(arr))
  }
  getTableMeta(id) {
    return this.getMeta().then(meta => meta[id] || {})
  }
  syncAll() {
    return this.getMeta()
      .then(meta => Promise.all(this.dbkeys
        .map(id => [id, Object.dig(meta, `${id}.last_modified`) || 0])
        .map(([id, since = 0]) => this.remote.getCollection(id, since)
          .then(docs => [id, docs, docs.reduce((last, { modified_at: at = 0 }) => Math.max(at || 0, last || 0), since)]))))
      .then(all => this.localUpdate(all.reduce((d, [coll, docs, last_modified]) => {
        d[`_meta`].push({ id: `${coll}`, last_modified });
        d[coll] = docs;
        this.log('sync', coll, last_modified, docs);
        return d;
      }, { _meta: [] })))
      .then(() => { this.log('sync all: OK'); })
      .catch((err) => this.log('sync all: error: ' + err))
      .then(() => ({ _: NaN }))
  }
  syncTable(id) {
    return this.getTableMeta(id)
      .then(meta => this.remote.getCollection(id, Object.dig(meta, `last_modified`))
        .then(docs => [docs, docs.reduce((last, e) => (e.modified_at || 0) > last ? e.modified_at : last, Object.dig(meta, `last_modified`) || 0)]))
      .then(([docs, last_modified]) => this.localUpdate({ [id]: docs, _meta: { [id]: { id, last_modified } } }))
      .then(this.notify)
      .then(() => { this.log('DB sync OK'); })
      .catch((err) => this.log('DB sync error: ' + err))
  }
  getTable(coll) {
    return this.dexie.table(coll);
  }
  getOne(url) {
    const [kind, id] = url.path;
    let coll = this.getCollection(kind);
    return coll.get(id).then(d => (d ? { ...d, kind } : null));
  }
  getDict({ data: { dict } }) {
    return this.getCollection('dict').where('type').equals(dict).toArray();
  }
  getIndex(kind) {
    if (!this.dbkeys.includes(kind)) {
      return null;
    }
    let coll = this.getTable(kind);
    // if (index && indexKey) {
    //   coll = coll.where(index).equals(indexKey);
    //   coll = desc === 'desc' ? coll.desc() : coll;
    // }
    // const filter = url.params;
    // if (filter) {
    //   coll = coll.filter(filterFn(filter));
    // }
    return coll.toArray();
  }
  eachDelta(delta, fn = e => e) {
    const bulks = {};
    for (let coll in delta) {
      if (this.dbkeys.includes(coll)) {
        bulks[coll] = delta[coll].map(fn);
      }
    }
    return bulks;
  }
  localUpdate(delta) {
    const bulks = this.eachDelta(delta);
    if (delta._meta) {
      bulks._meta = delta._meta;
    }
    const ops = Object.keys(bulks).map(key => this.dexie[key].bulkPut(bulks[key]));
    return Promise.all(ops);
  }
  async upsert(kind, data) {
    if (!data.id) {
      data.id = this.remote.nextId(kind);
    }
    await this.update({ [kind]: [data] });
    this.log('upsert ' + kind, data);
    return { _: NaN }
  }
  async update(delta) {
    await this.localUpdate(delta);
    return this.remote.update(delta);
  }
  checkVersion() {
    if (this.app.local.get('$version') !== this.version) {
      this.app.local.assign({ $version: this.version });
    }
  }
}
