import { createWidgetType } from '../lib/ui.js';
import Main from './main.html';
import Construction from './construction.html';
// export { default as List } from './List.js';
// export { default as ListItemSelector } from './ListItemSelector.js';
// export { default as Tree } from './Tree.js';
// export { default as Button } from './Button.js';
createWidgetType('Main', Main);
createWidgetType('Construction', Construction);
