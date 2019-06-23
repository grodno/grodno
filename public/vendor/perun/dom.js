import { render } from './render.js';
import { DOM_SETTERS, DOM_VALUE_COMPARATORS } from './utils.js';

const doc = window.document;

export class Element {

  constructor($) {
    this.elt = $.tag === '#text' ? doc.createTextNode('') : doc.createElement($.tag);
    this.$attributes = {};
    this.$ = $;
  }
  done() {
    const e = this.elt;
    const lstnrs = this.$listeners;
    if (lstnrs) {
      Object.keys(lstnrs).forEach(k => e.removeEventListener(k, lstnrs[k]));
      this.$listeners = null;
    }
    const p = e.parentElement;
    if (p) {
      p.removeChild(e);
    }
    this.elt = this.$attributes = null;
  }
  set(delta) {
    this.delta = delta;
    return this.$.nodes || delta && Object.keys(delta).length;
  }
  render(p) {
    const e = this.elt;
    const $ = this.$;
    p.cursor = e;
    if ($.content) {
      e.cursor = null;
      render($, $.content, e);
      e.cursor = null;
    }
    if (this.delta) {
      this.applyAttributes(this.delta);
      this.delta = null;
    }
    const before = p.cursor ? p.cursor.nextSibling : p.firstChild;
    if (!before) {
      p.appendChild(e);
    } else if (e !== before) {
      p.insertBefore(e, before);
    }
  }
  applyAttributes(theirs) {
    const e = this.elt;
    const mines = this.$attributes;
    for (let key in mines) {
      if (mines.hasOwnProperty(key) && theirs[key] === Object.undefined) {
        theirs[key] = null;
      }
    }
    for (let key in theirs) {
      if (theirs.hasOwnProperty(key) && !(DOM_VALUE_COMPARATORS[key] || DOM_VALUE_COMPARATORS._)(e, theirs[key], mines[key])) {
        const value = theirs[key];
        const prefixP = key.indexOf('-');
        const setter = DOM_SETTERS[prefixP === -1 ? key : key.slice(0, prefixP) + '*'];
        if (setter) {
          setter.call(this, e, key, value);
        } else if (typeof value === 'function' || (this.listeners && this.listeners.has(key))) {
          const T = this;
          this.setListener(key, !value ? null : (ev) => {
            T.$attributes[key]({ value: e.value, ...e.$dataset }, ev);
            return false;
          });
        } else {
          this.setAttribute(key, value);
        }
      }
    }
    if (e.$dataset) {
      Object.keys(e.$dataset).forEach(k => { e.dataset[k] = e.$dataset[k]; });
    }
    this.$attributes = theirs;
  }
  setAttribute(key, value) {
    if (value != null) {
      this.elt.setAttribute(key, value);
    } else {
      this.elt.removeAttribute(key);
    }
  }
  setListener(key, fn) {
    if (fn) {
      if (!this.listeners) {
        this.listeners = new Map();
      }
      if (!this.listeners.has(key)) {
        this.elt.addEventListener(key, fn, false);
        this.listeners.set(key, fn);
      }
    } else if (this.listeners && this.listeners.has(key)) {
      this.elt.removeEventListener(key, this.listeners.get(key));
      this.listeners.delete(key);
    }
  }
}
