import { EventBus } from 'ui';
import Db from './Db.js';
function restoreHotReload($) {
  const hot = module && module.hot;
  if (hot) {
    hot.addStatusHandler(function (d) {});
    // hot.accept();
    hot.dispose(d => {
      d.data = $.data;
    });
    const data = hot.data;
    if (data) {
      return data.data || {};
    }
  }
  return {};
}

class Store extends EventBus {

  constructor() {
    super();

    this.data = restoreHotReload(this);
    window.firebase.database().ref().on('value', snapshot => {
      const val = snapshot.val();

      const boards = val.boards || {};
      const ads = val.ads || {};
      const counts = {};
      Object.keys(ads).forEach(e => (counts[ads[e].boardId] = ((counts[ads[e].boardId] || 0) + 1)));
      Object.keys(boards).forEach(k => { boards[k].count = counts[k]; });

      // this.update(val);
      this.db.update(val);
    });
  }

  get adsList() {
    const boardId = this.data.boardId;
    return this.db.ads.orderBy('date').reverse().toArray()
      .then(l=>l.filter(e => !boardId || e.boardId == boardId));
  }

  get db() {
    return Db;
  }

  get currentBoard() {
    const boardId = this.data.boardId;
    return (this.data.boards || {})[boardId] || { id: '', name: 'All' };
  }

  userInfo(uid) {
    const users = this.data.users || {};
    return users[uid] || { name: uid };
  }

  update(delta) {
    Object.assign(this.data, delta);

    this.emitEvent({ type: 'changed', target: this, data: this.data });
  }

  subscribeAndEmit(key, handler0) {
    const handler = (typeof handler0 === 'function') ? { handleEvent: handler0 } : handler0;

    this.subscribe(key, handler);

    handler.handleEvent({ type: key, data: this.data });
  }

  setBoard(boardId) {
    this.update({ boardId });
  }

}

const store = new Store();

export default store;
