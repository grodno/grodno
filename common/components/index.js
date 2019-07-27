import { Filter } from './Filter';
import { Mapbox } from './Mapbox';
import { Form, FormField } from './Form';
import components from './components.html';
import elements from './elements.html';
import layouts from './layouts.html';
import userinfo from './UserInfo.html';
import fields from './fields.html';
import { loadTemplates } from 'armatura/support.js';

export default [
  Mapbox, Filter, Form, FormField,
  ...loadTemplates(components, elements, layouts, userinfo, fields)
];
