import { typeByTag } from './register.js';
import { Component } from './Component.js';
const deep = [];
export const render = (c, $content, ctx) => {
    deep.unshift('  ');
    c.eachChild(cc => !$content.has(cc.uid) ? cc.done() : 0);
    if (!$content.size) { return; }
    const ch = c.children || (c.children = new Map());
    $content.forEach(({ tag, content, owner, props, inits }, uid) => {
        let cc = ch.get(uid);
        if (!cc) {
            cc = new Component(typeByTag(tag), { tag, uid, ctx, owner, inits, parent: c });
            ch.set(uid, cc);
        }
        cc.content = content;
        cc.prevElt = ctx.cursor;
        // console.log(deep.join(''), 'render', tag, props);
        cc.up(props);
    });
    c.eachChild(cc => !cc.isInited ? cc.init() : 0);
    deep.shift();
};
