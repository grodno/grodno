
import { urlParse, fnId, arrayToHash, dig } from 'furnitura';
import { LocalStorage } from './LocalStorage';
import { ApiService } from 'armatura';

export class GSheetsService extends ApiService {
  constructor(options) {
    super(options);
    this.local = new LocalStorage()
  }
  async init() {
    this.syncAll();
  }
  syncAll() {
    const { since, data: { items: items0 } } = this.local.get('ads') || { since: 0, data: { items: {} } }
    if (Date.now() - since < 15 * 60 * 1000) {
      return this.log('not expired yet', Date.now() - since)
    }
    return fetch(this.url + '?since=' + since, { method: 'GET', redirect: 'follow' })
      .then(r => r.text())
      .then(r => JSON.parse(r))
      .then(({ items, boards }) => [arrayToHash(items), arrayToHash(boards), items.reduce((last, { modified_at: at = 0 }) => Math.max(at || 0, last || 0), 0)])
      .then(([items, boards, last]) => {
        this.log('sync ads', last, items);
        Object.values(items).forEach(e => {
          const board = boards[e.boardId] || { name: '#' + e.boardId }
          e.boardName = board.name
          e.link = 'https://forum.grodno.net/index.php?topic=' + e.id
          e.tags = Object.keys([e.tags, board.tags, board.action].reduce((acc, s) => {
            (s || '').split(',').forEach(ss => { if (ss) { acc[ss] = 1 } })
            return acc;
          }, {})).join(',')
        })
        this.local.assign({ ads: { since: last || Date.now(), data: { items: { ...items0, ...items }, boards } } })
      })
      .then(this.notify)
      .then(() => { this.log('sync all: OK'); })
      .catch((err) => this.log('sync all: error: ' + err));;
  }
  getAll() {
    const { data } = this.local.get('ads') || { data: { items: {} } }
    return data;
  }
  getItems() {
    let all = this.getAll();
    return Object.values(all.items)
  }
  eachDelta(delta, fn = fnId) {
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
  async update(delta) {
    await this.localUpdate(delta);
    return this.remote.update(delta);
  }
  async onUpsert({ path: [kind], data }) {
    if (!data.id) {
      data.id = this.remote.nextId(kind);
    }
    await this.update({ [kind]: [data] });
    this.log('onUpsert', data);
  }
  async onUpdate({ path: [kind], data }) {
    await this.update({ [kind]: [data] });
    this.log('Updated', data);
  }
  async onDelete({ path: [kind, id] }) {
    await this.update({ [kind]: [{ id, status: 'deleted' }] });
    this.log('Deleted', id);
  }
}