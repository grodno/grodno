(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./lib/armatura/xml.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// ==========
// XML Parse for templates. XML -> NodeTree
// ----------
var RE_XML_ENTITY = /&#?[0-9a-z]{3,5};/g;
var RE_XML_COMMENT = /<!--((?!-->)[\s\S])*-->/g;
var RE_ATTRS = /([a-z][a-zA-Z0-9-:]+)(="[^"]*"|={[^}]*})?/g;
var RE_ESCAPE_XML_ENTITY = /["'&<>]/g;
var RE_XML_TAG = /(<)(\/?)([a-zA-Z][a-zA-Z0-9-:]*)((?:\s+[a-z][a-zA-Z0-9-:]+(?:="[^"]*"|={[^}]*})?)*)\s*(\/?)>/g;
var SINGLE_TAGS = 'img input br col'.split(' ').reduce(function (r, e) {
  r[e] = 1;
  return r;
}, {});
var SUBST_XML_ENTITY = {
  amp: '&',
  gt: '>',
  lt: '<',
  quot: "\"",
  nbsp: ' '
};
var ESCAPE_XML_ENTITY = {
  34: '&quot;',
  38: '&amp;',
  39: '&#39;',
  60: '&lt;',
  62: '&gt;'
};
var RE_EMPTY = /^\s*$/;

var FN_ESCAPE_XML_ENTITY = function FN_ESCAPE_XML_ENTITY(m) {
  return ESCAPE_XML_ENTITY[m.charCodeAt(0)];
};

var FN_XML_ENTITY = function FN_XML_ENTITY(_) {
  var s = _.substring(1, _.length - 1);

  return s[0] === '#' ? String.fromCharCode(+s.slice(1)) : SUBST_XML_ENTITY[s] || ' ';
};

var decodeXmlEntities = function decodeXmlEntities() {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return s.replace(RE_XML_ENTITY, FN_XML_ENTITY);
};

var escapeXml = function escapeXml(s) {
  return !s ? '' : ('' + s).replace(RE_ESCAPE_XML_ENTITY, FN_ESCAPE_XML_ENTITY);
};

var skipQoutes = function skipQoutes(s) {
  return s[0] === '"' && s[s.length - 1] === '"' ? s.slice(1, -1) : s;
};

var UID = 1;

var parseAttrs = function parseAttrs(s) {
  var r = new Map();

  if (!s) {
    return r;
  }

  while (1) {
    var e = RE_ATTRS.exec(s);

    if (!e) {
      return r;
    }

    if (!e[2]) {
      r.set(e[1], "true");
    } else {
      r.set(e[1], decodeXmlEntities(skipQoutes(e[2].slice(1))));
    }
  }
};

var stringifyAttrs = function stringifyAttrs(attrs) {
  if (!attrs || !attrs.size) {
    return '';
  }

  var r = [];
  attrs.forEach(function (v, k) {
    if (v && k !== '#text') {
      r.push(' ' + k + '="' + escapeXml(v) + '"');
    }
  });
  return r.join('');
};

var Node =
/*#__PURE__*/
function () {
  function Node(tag) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Map();

    _classCallCheck(this, Node);

    this.uid = UID++;
    this.tag = tag || '';
    this.attrs = attrs;
    this.nodes = [];
  }

  _createClass(Node, [{
    key: "getChild",
    value: function getChild(index) {
      return this.nodes[index];
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this.attrs.set('#text', decodeXmlEntities(text));
    }
  }, {
    key: "addChild",
    value: function addChild(tag, attrs) {
      var e = new Node(tag, attrs);
      this.nodes.push(e);
      return e;
    }
  }, {
    key: "toString",
    value: function toString() {
      return stringify(this);
    }
  }]);

  return Node;
}();

function stringify(_ref) {
  var tag = _ref.tag,
      attrs = _ref.attrs,
      _ref$nodes = _ref.nodes,
      nodes = _ref$nodes === void 0 ? [] : _ref$nodes;
  var tab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var sattrs = stringifyAttrs(attrs);
  var ssubs = nodes.map(function (c) {
    return stringify(c, "  ".concat(tab));
  }).join('\n');
  var text = attrs && attrs.get('#text');
  var stext = text ? "  ".concat(tab).concat(escapeXml(text)) : '';

  if (tag === '#text') {
    return stext.trim();
  }

  return "".concat(tab, "<").concat(tag).concat(sattrs) + (!ssubs && !stext ? '/>' : ">\n".concat(ssubs).concat(stext, "\n").concat(tab, "</").concat(tag, ">"));
}
var parseXML = function parseXML(_s, key) {
  var s = ('' + _s).trim().replace(RE_XML_COMMENT, '');

  var ctx = [new Node()];
  var lastIndex = 0; // head text omitted

  while (1 > 0) {
    var e = RE_XML_TAG.exec(s);

    if (!e) {
      break;
    } // preceding text


    var text = e.index && s.slice(lastIndex, e.index);

    if (text && !text.match(RE_EMPTY)) {
      ctx[0].addChild('#text').setText(text);
    } // closing tag


    if (e[2]) {
      if (ctx[0].tag !== e[3]) {
        throw new Error((key || '') + ' XML Parse closing tag does not match at: ' + e.index + ' near ' + e.input.slice(Math.max(e.index - 150, 0), e.index) + '^^^^' + e.input.slice(e.index, Math.min(e.index + 150, e.input.length)));
      }

      ctx.shift();
    } else {
      var elt = ctx[0].addChild(e[3], parseAttrs(e[4])); // not single tag

      if (!(e[5] || e[3] in SINGLE_TAGS)) {
        ctx.unshift(elt);

        if (ctx.length === 1) {
          throw new Error('Parse error at: ' + e[0]);
        }
      }
    } // up past index


    lastIndex = RE_XML_TAG.lastIndex;
  } // tail text omitted


  return ctx[0].getChild(0);
};
// CONCATENATED MODULE: ./lib/armatura/compile.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var VALUES = {
  "true": true,
  "false": false,
  "null": null
};
var RE_SINGLE_PLACEHOLDER = /^\{([^}]+)\}$/;
var RE_PLACEHOLDER = /\{([^}]+)\}/g; // Compilation

function expression(v) {
  if (v[0] === ':') {
    return placeholder(v);
  }

  if (!v.includes('{')) {
    var r = v in VALUES ? VALUES[v] : v;
    return function () {
      return r;
    };
  }

  if (v.match(RE_SINGLE_PLACEHOLDER)) {
    return placeholder(v.slice(1, -1).trim());
  }

  return stringInterpolation(v);
}
function stringInterpolation(v) {
  var fnx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var pattern = v.replace(RE_PLACEHOLDER, function (s, expr) {
    fnx.push(placeholder(expr));
    return '{{' + (fnx.length - 1) + '}}';
  });
  return function (c) {
    return !fnx.length ? pattern : pattern.replace(/\{\{(\d+)\}\}/g, function (s, idx) {
      var r = fnx[idx](c);
      return !r && r !== 0 ? '' : r;
    });
  };
}
function placeholder(expr) {
  var _expr$split$map = expr.split('|').map(function (s) {
    return s.trim();
  }),
      _expr$split$map2 = _toArray(_expr$split$map),
      key = _expr$split$map2[0],
      pipes = _expr$split$map2.slice(1);

  var initGettr = key[0] === ':' ? function (fn) {
    return function (c) {
      return c.resource(fn(c));
    };
  }(stringInterpolation(key.slice(1).trim())) : function (c) {
    return c.prop(key);
  };
  var pipec = withPipes(pipes);
  return function (c) {
    return pipec(c, initGettr(c));
  };
}
function withPipes(pipes) {
  return !pipes.length ? function (c, v) {
    return v;
  } : function (c, initialValue) {
    return pipes.reduce(function (r, pk) {
      return c.pipe(r, pk);
    }, initialValue);
  };
}

var assignKeyValue = function assignKeyValue(acc, val, k) {
  if (k.slice(0, 5) === 'data-') {
    acc['data'] = _objectSpread({}, acc['data'], _defineProperty({}, k.slice(5), val in VALUES ? VALUES[val] : val));
  } else {
    acc[k] = val;
  }
};

var makeApplicator = function makeApplicator(get) {
  var k = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_';
  return function (c, acc) {
    return assignKeyValue(acc, get(c), k);
  };
};

var hasSlot = function hasSlot(c, id) {
  var r = false;

  if (id && id != 'default') {
    c.content && c.content.forEach(function (e) {
      r = r || e.tag === c.tag + ':' + id;
    });
  } else {
    c.content && c.content.forEach(function (e) {
      r = r || e.tag.slice(0, c.tag.length + 1) !== c.tag + ':';
    });
  }

  return r;
};

var filterMapKey = function filterMapKey(src, key) {
  var r = new Map();
  src.forEach(function (v, k) {
    if (k !== key) {
      r.set(k, v);
    }
  });
  return r;
};
function compileFor(_ref) {
  var tag = _ref.tag,
      attrs = _ref.attrs,
      uid = _ref.uid,
      nodes = _ref.nodes;

  var _attrs$get$split = attrs.get('ui:for').split(' '),
      _attrs$get$split2 = _slicedToArray(_attrs$get$split, 3),
      itemId = _attrs$get$split2[0],
      expr = _attrs$get$split2[2];

  var $for = {
    itemId: itemId
  };
  var r = {
    tag: 'ui:fragment',
    uid: 'for:' + expr + uid,
    $for: $for,
    key: attrs.get('key')
  };

  if (expr.slice(0, 2) === '<-') {
    var _expr$slice$split$map = expr.slice(2).split('|').map(function (s) {
      return s.trim();
    }),
        _expr$slice$split$map2 = _toArray(_expr$slice$split$map),
        key = _expr$slice$split$map2[0],
        pipes = _expr$slice$split$map2.slice(1);

    var pipec = withPipes(pipes);
    (r.inits || (r.inits = [])).push(function (c) {
      return c.connect(key, function (rr) {
        return {
          $data: pipec(c, rr)
        };
      });
    });
  } else {
    (r.updates || (r.updates = [])).push(makeApplicator(expression('{:'.includes(expr[0]) ? expr : '{' + expr + '}'), '$data'));
  }

  var $nodes = nodes;

  if (nodes && nodes.length) {
    var emptyNode = $nodes.find(function (e) {
      return e.tag === 'ui:empty';
    });

    if (emptyNode) {
      $for.emptyNode = emptyNode.nodes.map(compileNode);
      $nodes = $nodes.filter(function (e) {
        return e !== emptyNode;
      });
    }

    var loadingNode = $nodes.find(function (e) {
      return e.tag === 'ui:loading';
    });

    if (loadingNode) {
      $for.loadingNode = loadingNode.nodes.map(compileNode);
      $nodes = $nodes.filter(function (e) {
        return e !== loadingNode;
      });
    }
  }

  $for.itemNode = compileNode({
    tag: tag,
    attrs: filterMapKey(attrs, 'ui:for'),
    uid: uid,
    nodes: $nodes
  });
  return r;
}
function compileIf(_ref2) {
  var tag = _ref2.tag,
      attrs = _ref2.attrs,
      uid = _ref2.uid,
      nodes = _ref2.nodes;
  var aIf = attrs.get('ui:if');
  var iff = {};
  var r = {
    tag: 'ui:fragment',
    uid: 'if:' + aIf + uid,
    key: attrs.get('key'),
    $if: iff
  };
  var neg = aIf[0] === '!';
  var expr = neg ? aIf.slice(1) : aIf;

  if (expr.slice(0, 2) === '<-') {
    var _expr$slice$split$map3 = expr.slice(2).split('|').map(function (s) {
      return s.trim();
    }),
        _expr$slice$split$map4 = _toArray(_expr$slice$split$map3),
        key = _expr$slice$split$map4[0],
        pipes = _expr$slice$split$map4.slice(1);

    var pipec = withPipes(pipes);
    var applicator = neg ? function (c) {
      return function (rr) {
        return {
          $data: !pipec(c, rr)
        };
      };
    } : function (c) {
      return function (rr) {
        return {
          $data: !!pipec(c, rr)
        };
      };
    };
    (r.inits || (r.inits = [])).push(function (c) {
      return c.connect(key, applicator(c));
    });
  } else if (expr.slice(0, 5) === 'slot(') {
    var gttr = function gttr(c) {
      return hasSlot(c, expr.slice(5, -1));
    };

    (r.updates || (r.updates = [])).push(function (c, acc) {
      acc['$data'] = neg ? !gttr(c) : gttr(c);
    });
  } else {
    var _gttr = expression(expr.includes('{') ? expr : '{' + expr + '}');

    (r.updates || (r.updates = [])).push(function (c, acc) {
      acc['$data'] = neg ? !_gttr(c) : _gttr(c);
    });
  }

  var $then = {
    tag: tag,
    attrs: filterMapKey(attrs, 'ui:if'),
    uid: uid,
    nodes: nodes
  };

  if (nodes && nodes.length) {
    var ifElse = nodes.find(function (e) {
      return e.tag === 'ui:else';
    });
    var ifThen = nodes.find(function (e) {
      return e.tag === 'ui:then';
    });

    if (ifElse) {
      iff["else"] = ifElse.nodes.map(compileNode);
      $then.nodes = ifThen ? ifThen.nodes : nodes.filter(function (e) {
        return e !== ifElse;
      });
    } else if (ifThen) {
      $then.nodes = ifThen.nodes;
    }
  }

  iff.then = [$then].map(compileNode);
  return r;
}
function compileTag(_ref3) {
  var attrs = _ref3.attrs,
      uid = _ref3.uid,
      nodes = _ref3.nodes;
  var expr = attrs.get('tag');
  var r = {
    tag: 'ui:fragment',
    uid: 'tag:' + expr + uid,
    $tag: compile({
      attrs: filterMapKey(attrs, 'tag'),
      nodes: nodes
    })
  };

  if (expr.slice(0, 2) === '<-') {
    (r.inits || (r.inits = [])).push(function (c) {
      return c.connect(expr.slice(2).trim(), function (rr) {
        return {
          $data: rr
        };
      });
    });
  } else {
    var gttr = expression(expr);
    (r.updates || (r.updates = [])).push(function (c, acc) {
      acc['$data'] = gttr(c);
    });
  }

  return r;
}
function compile(r) {
  var attrs = r.attrs,
      nodes = r.nodes;

  if (attrs.has('id')) {
    r.id = attrs.get('id');
  }

  if (attrs.has('ui:ref')) {
    r.ref = attrs.get('ui:ref');
  } // ui:props


  if (attrs.has('ui:props')) {
    var aProps = attrs.get('ui:props');

    if (aProps.slice(0, 2) === '<-') {
      var _aProps$slice$split$m = aProps.slice(2).split('|').map(function (s) {
        return s.trim();
      }),
          _aProps$slice$split$m2 = _toArray(_aProps$slice$split$m),
          key = _aProps$slice$split$m2[0],
          pipes = _aProps$slice$split$m2.slice(1);

      var pipec = withPipes(pipes);
      (r.inits || (r.inits = [])).push(function (c) {
        return c.connect(key, function (rr) {
          return pipec(c, rr);
        });
      });
    } else {
      var getter = expression(aProps);
      (r.updates || (r.updates = [])).push(function (c, acc) {
        return Object.assign(acc, getter(c));
      });
    }
  } // attrs


  attrs.forEach(function (v, k) {
    if (k.slice(0, 3) !== 'ui:') {
      var v2 = v.slice(0, 2);

      if (v2 === '<-') {
        var _v$slice$split$map = v.slice(2).split('|').map(function (s) {
          return s.trim();
        }),
            _v$slice$split$map2 = _toArray(_v$slice$split$map),
            _key = _v$slice$split$map2[0],
            _pipes = _v$slice$split$map2.slice(1);

        var _pipec = withPipes(_pipes);

        (r.inits || (r.inits = [])).push(function (c) {
          return c.connect(_key, function (rr) {
            return _defineProperty({}, k, _pipec(c, rr));
          });
        });
      } else if (v2 === '->') {
        var _v$slice$split$map3 = v.slice(2).split('|').map(function (s) {
          return s.trim();
        }),
            _v$slice$split$map4 = _toArray(_v$slice$split$map3),
            _key2 = _v$slice$split$map4[0],
            _pipes2 = _v$slice$split$map4.slice(1);

        var expr = expression(_key2);

        var _pipec2 = withPipes(_pipes2);

        var ekey = '$' + v + ':' + r.uid;

        var emitter = function emitter(c) {
          return c[ekey] || (c[ekey] = function (data, cb) {
            return c.emit(expr(c), _pipec2(c, data), cb);
          });
        };

        (r.updates || (r.updates = [])).push(function (c, acc) {
          return assignKeyValue(acc, emitter(c), k);
        });
      } else {
        if (!v.includes('{') && v[0] !== ':' && k.slice(0, 5) !== 'data-') {
          assignKeyValue(r.initials || (r.initials = {}), v, k);
        } else {
          (r.updates || (r.updates = [])).push(makeApplicator(expression(v), k));
        }
      }
    }
  });
  r.nodes = nodes.map(compileNode);
  return r;
}
function compileNode(node) {
  if (node.attrs.has('ui:for')) {
    return compileFor(node);
  }

  if (node.attrs.has('ui:if')) {
    return compileIf(node);
  }

  if (node.tag === 'ui:tag') {
    return compileTag(node);
  }

  return compile(node);
}
// CONCATENATED MODULE: ./lib/armatura/utils.js
var COUNTER = 1;
var nope = function nope() {};
var fnId = function fnId(x) {
  return x;
};
var nextId = function nextId() {
  var p = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return p + COUNTER++;
};
var methodName = function methodName(x) {
  var pre = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (!x) {
    return pre;
  }

  var s = "".concat(x);
  return pre + s[0].toUpperCase() + s.slice(1);
};
var camelize = function camelize(key) {
  var sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_';
  var jn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
  return ('' + key).split(sep).map(function (s, i) {
    return i ? s[0].toUpperCase() + s.slice(1) : s;
  }).join(jn);
};
var fnName = function fnName(ctor) {
  return (/^function\s+([\w$]+)\s*\(/.exec(ctor.toString()) || [])[1] || nextId('$C');
};
var runInBrowser = function runInBrowser(fn) {
  return window.requestAnimationFrame(function () {
    return fn.call(window, document);
  });
};
// CONCATENATED MODULE: ./lib/armatura/register.js



var REGISTRY = new Map();

var register_reg = function reg(ctr) {
  var ctor = typeof ctr === 'function' ? ctr : Object.assign(function () {}, ctr);
  var name = ctor.NAME || ctor.name || fnName(ctor);
  var text = ctor.TEMPLATE || ctor.template || ctor.prototype.TEMPLATE;

  ctor.$TEMPLATE = function () {
    try {
      var T = text ? compileNode(parseXML(typeof text === 'function' ? text() : text, name)) : [];

      ctor.$TEMPLATE = function () {
        return T;
      };

      return T;
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.log('compile ' + name, ex);
    }

    return [];
  };

  REGISTRY.set(name, ctor);
};

register_reg({
  NAME: 'ui:fragment'
});
var registerTypes = function registerTypes(types) {
  return types.forEach(register_reg);
};
registerTypes.getByTag = REGISTRY.get.bind(REGISTRY);
// CONCATENATED MODULE: ./lib/armatura/render.js
function render_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function render_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { render_ownKeys(source, true).forEach(function (key) { render_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { render_ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function render_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var render_render = function render(c) {
  var $content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c.resolveTemplate();

  if (!$content || !$content.size) {
    c.eachChild(function (cc) {
      return cc.done();
    });
    return;
  }

  c.eachChild(function (cc) {
    return !$content.has(cc.uid) ? cc.done() : 0;
  });
  var ch = c.children || (c.children = new Map());
  $content.forEach(function (_ref, uid) {
    var tag = _ref.tag,
        content = _ref.content,
        owner = _ref.owner,
        props = _ref.props,
        inits = _ref.inits,
        initials = _ref.initials,
        ref = _ref.ref,
        $if = _ref.$if,
        $for = _ref.$for,
        $tag = _ref.$tag;
    var cc = ch.get(uid);

    if (!cc) {
      props = props && props.data && initials && initials.data ? render_objectSpread({}, props, {}, initials, {
        data: render_objectSpread({}, initials.data, {}, props.data)
      }) : render_objectSpread({}, props, {}, initials);
      cc = new component_Component(registerTypes.getByTag(tag), {
        props: props,
        tag: tag,
        ref: ref,
        $if: $if,
        $for: $for,
        $tag: $tag,
        uid: uid,
        owner: owner,
        inits: inits,
        parent: c
      });
      ch.set(uid, cc);
    }

    cc.owner = owner;
    cc.content = content;
    cc.prevElt = c.elt.cursor;
    cc.up(props);
  });
  c.eachChild(function (cc) {
    return !cc.isInited ? cc.init() : 0;
  });
};
// CONCATENATED MODULE: ./lib/armatura/resolve.js
var resolveSlot = function resolveSlot(owner, id, acc) {
  var $ = owner; // eslint-disable-next-line no-empty

  for (; $.owner && $.tag === 'ui:fragment'; $ = $.owner) {}

  $.content && $.content.forEach(function (v) {
    if (id) {
      if (v.tag === $.tag + ':' + id && v.content) {
        v.content.forEach(function (vv) {
          return acc.set(vv.uid, vv);
        });
      }
    } else if (v.tag.slice(0, $.tag.length + 1) !== $.tag + ':') {
      acc.set(v.uid, v);
    }
  });
  return acc;
};

var resolveTemplateArray = function resolveTemplateArray(owner, tmpl) {
  var acc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Map();
  return tmpl && tmpl.length ? tmpl.reduce(function (m, t) {
    return resolve_resolveTemplate(owner, t, m);
  }, acc) : null;
};

var resolveProps = function resolveProps(props, c) {
  return props && props.length ? props.reduce(function (acc, fn) {
    fn(c, acc);
    return acc;
  }, {}) : null;
};

function resolveRegular(acc, owner, _ref) {
  var tag = _ref.tag,
      updates = _ref.updates,
      initials = _ref.initials,
      inits = _ref.inits,
      nodes = _ref.nodes,
      uid = _ref.uid,
      id = _ref.id,
      ref = _ref.ref,
      $if = _ref.$if,
      $for = _ref.$for,
      $tag = _ref.$tag;

  if (tag === 'ui:slot') {
    return resolveSlot(owner, id, acc);
  }

  var props = resolveProps(updates, owner);
  var content = resolveTemplateArray(owner, nodes);
  return acc.set(uid, {
    tag: tag,
    id: id,
    uid: uid,
    ref: ref,
    owner: owner,
    initials: initials,
    inits: inits,
    $if: $if,
    $for: $for,
    $tag: $tag,
    props: props,
    content: content
  });
}

function resolve_resolveTemplate(owner, tmpl) {
  var acc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Map();

  if (!tmpl) {
    return acc;
  }

  if (tmpl.reduce) {
    return tmpl.length ? resolveTemplateArray(owner, tmpl, acc) : acc;
  }

  return resolveRegular(acc, owner, tmpl);
}
// CONCATENATED MODULE: ./lib/armatura/component.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || component_iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function component_toArray(arr) { return component_arrayWithHoles(arr) || component_iterableToArray(arr) || component_nonIterableRest(); }

function component_iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function component_slicedToArray(arr, i) { return component_arrayWithHoles(arr) || component_iterableToArrayLimit(arr, i) || component_nonIterableRest(); }

function component_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function component_iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function component_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function component_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function component_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { component_ownKeys(source, true).forEach(function (key) { component_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { component_ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function component_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function component_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function component_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function component_createClass(Constructor, protoProps, staticProps) { if (protoProps) component_defineProperties(Constructor.prototype, protoProps); if (staticProps) component_defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable no-console */



var component_Component =
/*#__PURE__*/
function () {
  function Component(Ctor, options) {
    var _this = this;

    component_classCallCheck(this, Component);

    Object.assign(this, options);
    var ref = this.ref,
        parent = this.parent,
        props = this.props;

    if (parent) {
      this.app = parent.app;
      this.ctx = this.elt = parent.elt;
      this.impl = new (Ctor || Component.Element)(props, this);
      this.impl.$ = this;
      this.impl.app = this.app;

      if (ref) {
        var hidden = this.app[ref];
        this.app[ref] = this.impl;
        this.defer(function () {
          _this.app[ref] = hidden;
        });
      }
    } else {
      this.app = this.impl = new Ctor(props, this);
      this.impl.$ = this;
    }
  }
  /**
   * Rendering.
   */


  component_createClass(Component, [{
    key: "resolveFragmentTemplate",
    value: function resolveFragmentTemplate() {
      var _this2 = this;

      var acc = new Map();

      if (this.$for) {
        // ui:for
        var $for = this.$for;
        var data = this.impl.$data;
        var itemId = $for.itemId,
            itemNode = $for.itemNode,
            emptyNode = $for.emptyNode,
            loadingNode = $for.loadingNode;
        var tag = itemNode.tag,
            updates = itemNode.updates,
            _itemNode$initials = itemNode.initials,
            initials = _itemNode$initials === void 0 ? {} : _itemNode$initials,
            nodes = itemNode.nodes,
            uid = itemNode.uid;

        if (data && data.length) {
          if (!data.forEach) {
            throw new Error('wrong ui:for data', data);
          }

          data.forEach(function (d, index) {
            var _Object$assign;

            var id = "".concat(uid, "-$").concat(d.id || index);
            var $ownerImpl = Object.assign(Object.create(_this2.owner.impl), (_Object$assign = {}, component_defineProperty(_Object$assign, itemId, d), component_defineProperty(_Object$assign, itemId + 'Index', index), _Object$assign));

            var up = function up(Δ) {
              return _this2.owner.up(Δ);
            };

            var $owner = Object.assign(Object.create(_this2.owner), {
              impl: $ownerImpl,
              $propFnMap: {},
              up: up
            });

            resolve_resolveTemplate($owner, {
              tag: tag,
              initials: initials,
              updates: updates,
              nodes: nodes,
              uid: id
            }, acc);
          });
        } else if (!data) {
          if (loadingNode) {
            resolve_resolveTemplate(this.owner, loadingNode, acc);
          }
        } else if (!data.length) {
          if (emptyNode) {
            resolve_resolveTemplate(this.owner, emptyNode, acc);
          }
        }
      } else if (this.$if) {
        // ui:if
        var $if = this.$if;
        var $data = this.impl.$data;
        var node = $data ? $if.then : $if["else"];

        resolve_resolveTemplate(this, node, acc);
      } else if (this.$tag) {
        // ui:tag
        var _tag = this.impl.$data;

        if (_tag) {
          resolve_resolveTemplate(this, component_objectSpread({}, this.$tag, {
            tag: _tag,
            uid: _tag + ':' + this.uid
          }), acc);
        }
      } else if (this.content) {
        // content
        this.content.forEach(function (v, k) {
          return acc.set(k, v);
        });
      }

      return acc;
    }
  }, {
    key: "render",
    value: function render() {
      this.ctx.cursor = this.prevElt;

      if (this.impl.render) {
        this.impl.render(this, render_render);
      } else {
        render_render(this);
      }
    }
  }, {
    key: "resolveTemplate",
    value: function resolveTemplate() {
      return this.tag === 'ui:fragment' ? this.resolveFragmentTemplate() : resolve_resolveTemplate(this, this.impl.constructor.$TEMPLATE());
    }
    /**
     * Life-cycle hooks.
     */

  }, {
    key: "init",
    value: function init() {
      var _this3 = this;

      if (this.isDone || this.isInited) {
        return;
      }

      this.isInited = true; // console.log('init', this.tag, this.uid)

      if (this.inits) {
        this.inits.forEach(function (f) {
          return _this3.defer(f(_this3));
        });
        delete this.inits;
      }

      if (this.impl.init) {
        var d = this.impl.init(this);

        if (d) {
          this.up(d);
        }
      }
    }
  }, {
    key: "done",
    value: function done() {
      var _this4 = this;

      if (this.isDone) {
        return;
      }

      this.isDone = true;

      if (this.impl.done) {
        this.impl.done(this);
      } // console.log('done', this.tag, this.uid)


      this.eachChild(function (c) {
        c.parent = null;
        c.done();
      });

      if (this.parent) {
        this.parent.children["delete"](this.uid);
      }

      if (this.prevElt) {
        this.prevElt.nextElt = this.nextElt;
      }

      if (this.defered) {
        this.defered.forEach(function (f) {
          return f(_this4);
        });
        delete this.defered;
      }

      this.cleanUp();
    }
    /**
     * State.
     */

  }, {
    key: "up",
    value: function up(Δ) {
      if (this.isDone) {
        return;
      }

      var changed = this.set(Δ);
      this.render();

      if (this.ref && changed) {
        this.notify();
      }
    }
  }, {
    key: "upAsync",
    value: function upAsync(promise, key) {
      var $ = this;
      var racer = $.raceCondition('set:' + (key || 'up'));

      var up = function up(r) {
        return racer(function () {
          return $.up(r);
        });
      };

      if (key && key !== '...') {
        var akey = key.replace('Promise', '');
        promise.then(function (val) {
          var _up;

          return up((_up = {}, component_defineProperty(_up, akey + 'Error', null), component_defineProperty(_up, akey, val), _up));
        }, function (error) {
          return up(component_defineProperty({}, akey + 'Error', error));
        });
      } else {
        promise.then(up, function (error) {
          return up({
            error: error
          });
        });
      }

      return promise;
    }
  }, {
    key: "set",
    value: function set(Δ) {
      var $ = this;
      var impl = $.impl;
      var changed = false;

      if (impl.set) {
        changed = impl.set(Δ);
      } else if (Δ) {
        if (Δ.then) {
          $.upAsync(Δ);
        } else {
          Object.entries(Δ).forEach(function (_ref) {
            var _ref2 = component_slicedToArray(_ref, 2),
                k = _ref2[0],
                their = _ref2[1];

            if (their && their.then) {
              $.upAsync(their, k);
            } else if (k && typeof their !== 'undefined' && their !== impl[k]) {
              var setter = impl['set' + k[0].toUpperCase() + k.slice(1)];

              if (setter) {
                setter.call(impl, their);
              } else {
                impl[k] = their;
              }

              changed = true;
            }
          });
        }
      }

      return changed;
    }
  }, {
    key: "prop",
    value: function prop(propId) {
      var value = this.propGetter(propId)();
      return typeof value === 'function' ? this.bindFn(value) : value;
    }
  }, {
    key: "propGetter",
    value: function propGetter(key) {
      var $ = this;
      var map = $.$propFnMap || ($.$propFnMap = {});
      var fn = map[key];

      if (fn) {
        return fn;
      }

      var impl = this.impl;

      var _key$split = key.split('.'),
          _key$split2 = component_toArray(_key$split),
          pk = _key$split2[0],
          path = _key$split2.slice(1);

      var gettr = impl[methodName(pk, 'get')];
      var extractor1 = gettr ? function () {
        return gettr.call(impl, $);
      } : function () {
        var $$ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : impl.get ? impl.get() : impl;
        return pk in $$ ? $$[pk] : $.owner && $.owner.prop && $.tag === 'ui:fragment' ? $.owner.prop(pk) : undefined;
      };
      fn = !path.length ? extractor1 : function () {
        return path.reduce(function (r, p) {
          return r ? r[p] : r;
        }, extractor1());
      };
      return map[key] = fn;
    }
  }, {
    key: "pipe",
    value: function pipe(value, key) {
      var _key$split3 = key.split(':'),
          _key$split4 = component_toArray(_key$split3),
          id = _key$split4[0],
          args = _key$split4.slice(1);

      try {
        var fn = this.resource(id);
        var owner = this.actualOwner;
        return fn.apply(owner.impl, [value].concat(_toConsumableArray(args.map(function (a) {
          return a[0] === '@' ? owner.prop(a.slice(1)) : a;
        }))));
      } catch (ex) {
        console.error('ERROR: Object.pipes.' + id, ex);
        return value;
      }
    }
  }, {
    key: "resource",
    value: function resource(key) {
      var _key$split5 = key.split('.'),
          _key$split6 = component_toArray(_key$split5),
          id = _key$split6[0],
          deep = _key$split6.slice(1);

      var target = id === 'app' ? this.app : this.app.resources[id];

      if (deep.length === 0) {
        return target;
      }

      if (deep.length === 1) {
        return target[deep[0]];
      }

      return deep.reduce(function (r, k) {
        return r ? r[k] : null;
      }, target);
    }
    /**
     *  Arrows.
     */

  }, {
    key: "notify",
    value: function notify() {
      var _this5 = this;

      if (this.listeners && !this.notifying) {
        this.notifying = true;
        this.listeners.forEach(function (e) {
          return e(_this5.impl);
        });
        this.notifying = false;
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(fn) {
      var uuid = nextId();
      var listeners = this.listeners || (this.listeners = new Map());
      fn(this.impl);
      listeners.set(uuid, fn);
      return function () {
        return listeners["delete"](uuid);
      };
    }
  }, {
    key: "connect",
    value: function connect(key, applicator) {
      var _this6 = this;

      var _key$split7 = key.split('.'),
          _key$split8 = component_slicedToArray(_key$split7, 2),
          _key$split8$ = _key$split8[0],
          type = _key$split8$ === void 0 ? this.ref : _key$split8$,
          target = _key$split8[1];

      var ref = type === 'this' ? this.impl : this.app[type];

      if (!ref) {
        console.error('connect: No such ref ' + type, key);
      }

      return ref && ref.$.subscribe(function () {
        try {
          var value = ref.$.prop(target);

          _this6.up(applicator ? value && value.then ? value.then(applicator) : applicator(value) : value);
        } catch (ex) {
          console.error('connect ' + type + ':' + target, ex);
        }
      });
    }
  }, {
    key: "emit",
    value: function emit(key, data, _callback) {
      var _this7 = this;

      if (!key || !key.includes('.')) {
        return this.actualOwner.up(key ? component_defineProperty({}, key, data) : data);
      }

      var _key$split9 = key.split('.'),
          _key$split10 = component_slicedToArray(_key$split9, 2),
          type = _key$split10[0],
          target = _key$split10[1];

      var racer = this.raceCondition(type + ':on:' + target);

      var event = component_objectSpread({
        data: data,
        callback: function callback(error, r) {
          return racer(function () {
            return _callback ? _callback(error, r) : _this7.up(component_objectSpread({
              error: error
            }, r));
          });
        }
      }, data);

      var ref = type === 'this' ? this.impl : this.app[type];

      try {
        if (!ref) {
          throw new ReferenceError('emit: No such ref ' + type);
        }

        var method = ref[methodName(target, 'on')];

        if (!method) {
          throw new ReferenceError('emit ' + type + ': No such method ' + methodName(target, 'on'));
        }

        var result = method.call(ref, event, ref);
        this.log(type + ':' + methodName(target, 'on'), result, event, ref);

        if (result) {
          ref.$.up(result);
        }
      } catch (ex) {
        this.error('emit ' + type + ':' + target, ex);
        event.callback(ex);
      }
    }
    /**
     * Routines.
     */

  }, {
    key: "raceCondition",
    value: function raceCondition(key) {
      var COUNTERS = this.$weak || (this.$weak = new Map());
      var counter = 1 + (COUNTERS.get(key) || 0);
      COUNTERS.set(key, counter);
      return function (fn) {
        if (counter === COUNTERS.get(key)) {
          runInBrowser(fn);
        }
      };
    }
  }, {
    key: "defer",
    value: function defer(fn) {
      if (fn && typeof fn === 'function') {
        (this.defered || (this.defered = [])).push(fn);
      }
    }
  }, {
    key: "eachChild",
    value: function eachChild(fn) {
      var ch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.children;

      if (ch) {
        ch.forEach(fn);
      }
    }
  }, {
    key: "cleanUp",
    value: function cleanUp() {
      var _this8 = this;

      ['parent', 'children', 'owner', 'impl', 'app', 'ctx'].forEach(function (k) {
        delete _this8[k];
      });
    }
  }, {
    key: "error",
    value: function error() {
      var _console;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).error.apply(_console, [this.tag + this.uid].concat(args));
    }
  }, {
    key: "log",
    value: function log() {
      var _console2;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      (_console2 = console).log.apply(_console2, [this.tag + this.uid].concat(args));
    }
  }, {
    key: "bindFn",
    value: function bindFn(f) {
      var $ = this;
      var map = $.$boundFnMap || ($.$boundFnMap = new Map());
      var fn = map.get(f);

      if (!fn) {
        var bound = f.bind($.impl);

        fn = function fn() {
          var r = bound.apply(void 0, arguments);

          if (r) {
            $.up(r);
          }
        };

        map.set(f, fn);
      }

      return fn;
    }
  }, {
    key: "actualOwner",
    get: function get() {
      var $ = this; // eslint-disable-next-line no-empty

      for (; $.owner && $.tag === 'ui:fragment'; $ = $.owner) {}

      return $;
    }
  }]);

  return Component;
}();
// CONCATENATED MODULE: ./lib/armatura/dom.js
function dom_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function dom_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function dom_createClass(Constructor, protoProps, staticProps) { if (protoProps) dom_defineProperties(Constructor.prototype, protoProps); if (staticProps) dom_defineProperties(Constructor, staticProps); return Constructor; }

function dom_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function dom_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { dom_ownKeys(source, true).forEach(function (key) { dom_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { dom_ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function dom_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function dom_slicedToArray(arr, i) { return dom_arrayWithHoles(arr) || dom_iterableToArrayLimit(arr, i) || dom_nonIterableRest(); }

function dom_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function dom_iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function dom_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


 // DOM

var DOM_SETTERS = {
  '#text': function text(e, v) {
    return e.textContent = v == null ? '' : v;
  },
  disabled: function disabled(e, v) {
    return e.disabled = v ? true : null;
  },
  "class": function _class(e, v) {
    if (v.includes(':')) {
      v = ('' + v).split(' ').map(function (s) {
        var _s$split = s.split(':'),
            _s$split2 = dom_slicedToArray(_s$split, 2),
            cl = _s$split2[0],
            expr = _s$split2[1];

        if (expr === undefined) return cl;

        var _expr$split = expr.split('=='),
            _expr$split2 = dom_slicedToArray(_expr$split, 2),
            fl = _expr$split2[0],
            eq = _expr$split2[1];

        var disabled = eq ? fl !== eq : ['', '0', 'false', null].indexOf(fl) > -1;
        return disabled ? '' : cl;
      }).join(' ');
    }

    e.className = v;
  },
  selected: function selected(e, v) {
    return e.selected = v ? true : null;
  },
  value: function value(e, v) {
    return e.value = v == null ? '' : v;
  },
  checked: function checked(e, v) {
    return e.checked = !!v;
  },
  init: function init(e, v) {
    var _this = this;

    this.init = function () {
      return v(e, _this);
    };
  },
  data: function data(e, v) {
    if (v && e.$dataset) {
      Object.keys(e.$dataset).forEach(function (k) {
        if (!v[k]) {
          e.dataset[camelize(k, '-', '')] = null;
        }
      });
    }

    e.$dataset = dom_objectSpread({}, v);

    if (v) {
      Object.keys(v).forEach(function (k) {
        e.dataset[camelize(k, '-', '')] = v[k];
      });
    }
  },
  click: function click(e, v) {
    var _this2 = this;

    this.setAttribute('click:click', !v ? null : function (ev) {
      _this2.$attributes.click(dom_objectSpread({}, e.$dataset), ev);

      return false;
    });
  },
  'bubble-click': function bubbleClick(e, v) {
    var _this3 = this;

    this.setAttribute('bubbled-click:click', !v ? null : function (ev) {
      _this3.$attributes['bubble-click'](dom_objectSpread({}, e.$dataset), ev);

      return true;
    });
  },
  blur: function blur(e, v) {
    var _this4 = this;

    this.setAttribute('blur:blur', !v ? null : function (ev) {
      _this4.$attributes.blur(dom_objectSpread({}, e.$dataset), ev);

      return false;
    });
  },
  dblclick: function dblclick(e, v) {
    var _this5 = this;

    this.setAttribute('dblclick:dblclick', !v ? null : function (ev) {
      _this5.$attributes.dblclick(dom_objectSpread({}, e.$dataset), ev);

      return false;
    });
  },
  scroll: function scroll(e, v) {
    var _this6 = this;

    this.setAttribute('scroll:scroll', !v ? null : function (ev) {
      _this6.$attributes.scroll(dom_objectSpread({}, e.$dataset), ev);

      return false;
    });
  },
  error: function error(e, v) {
    var _this7 = this;

    this.setAttribute('error:error', !v ? null : function (ev) {
      var fn = _this7.getAttribute('error');

      fn && fn(dom_objectSpread({}, e.$dataset), ev);
      return false;
    });
  },
  keypress: function keypress(e, v) {
    var _this8 = this;

    this.setAttribute('keypress:keyup', !v ? null : function (ev) {
      if (ev.keyCode !== 13 && ev.keyCode !== 27) {
        var fn = _this8.$attributes.keypress;
        fn && fn(dom_objectSpread({
          value: e.value
        }, e.$dataset), ev);
        setTimeout(function () {
          return e.focus();
        }, 0);
      }

      return false;
    });
  },
  enter: function enter(e, v) {
    var _this9 = this;

    this.setAttribute('enter:keyup', !v ? null : function (ev) {
      if (ev.keyCode === 13) {
        _this9.$attributes.enter(dom_objectSpread({
          value: e.value
        }, e.$dataset), ev);
      }

      if (ev.keyCode === 13 || ev.keyCode === 27) {
        e.blur();
      }

      return false;
    });
  },
  change: function change(e, v) {
    var _this10 = this;

    this.setAttribute('change:change', !v ? null : function (ev) {
      _this10.$attributes.change(dom_objectSpread({
        value: e.value
      }, e.$dataset), ev);

      return false;
    });
  },
  toggle: function toggle(e, v) {
    var _this11 = this;

    this.setAttribute('toggle:change', !v ? null : function (ev) {
      _this11.$attributes.toggle(dom_objectSpread({
        value: e.checked
      }, e.$dataset), ev);

      return false;
    });
  }
};
var DOM_VALUE_COMPARATORS = {
  value: function value(e, their) {
    return e.value === their;
  },
  _: function _(_2, their, mine) {
    return their === mine;
  }
};
var dom_DomElement =
/*#__PURE__*/
function () {
  function DomElement() {
    var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var $ = arguments.length > 1 ? arguments[1] : undefined;

    dom_classCallCheck(this, DomElement);

    this.elt = $.elt = $.tag === '#text' ? document.createTextNode('') : document.createElement($.tag);
    this.$attributes = {};
    this.$ = this.elt.$ = $;
    this.applyAttributes(attrs);
  }

  dom_createClass(DomElement, [{
    key: "done",
    value: function done() {
      var e = this.elt;
      var lstnrs = this.$listeners;

      if (lstnrs) {
        Object.keys(lstnrs).forEach(function (k) {
          return e.removeEventListener(k, lstnrs[k]);
        });
        this.$listeners = null;
      }

      var p = e.parentElement;

      if (p) {
        p.removeChild(e);
      }

      this.elt = this.$attributes = null;
    }
  }, {
    key: "set",
    value: function set(delta) {
      this.delta = this.delta ? Object.assign(this.delta, delta) : delta;
      return this.$.nodes || delta && Object.keys(delta).length;
    }
  }, {
    key: "render",
    value: function render($) {
      var e = this.elt;
      var p = $.ctx;

      if ($.content) {
        e.cursor = null;

        render_render($, $.content);

        e.cursor = null;
      }

      if (this.delta) {
        this.applyAttributes(this.delta);
        this.delta = null;
      }

      var before = p.cursor ? p.cursor.nextSibling : p.firstChild;

      if (!before) {
        if (p !== e.parentElement) {
          p.appendChild(e);
        }
      } else if (e !== before) {
        p.insertBefore(e, before);
      }

      p.cursor = e;
    }
  }, {
    key: "applyAttributes",
    value: function applyAttributes(theirs) {
      var e = this.elt;
      var mines = this.$attributes;

      for (var key in theirs) {
        if (theirs.hasOwnProperty(key) && !(DOM_VALUE_COMPARATORS[key] || DOM_VALUE_COMPARATORS._)(e, theirs[key], mines[key])) {
          var value = theirs[key];
          var setter = DOM_SETTERS[key]; // console.log('setAttribute' + this.$.tag, key, value)

          if (setter) {
            setter.call(this, e, value);
          } else {
            this.setAttribute(key, value);
          }
        }
      }

      this.$attributes = theirs;
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(key, def) {
      return this.$attributes && this.$attributes[key] || def;
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(key, value) {
      var _this12 = this;

      if (value != null) {
        if (typeof value === 'function') {
          var fnValue = function fnValue() {
            if (!_this12.isDone) {
              value.apply(void 0, arguments);
            }
          };

          if (!this.listeners) {
            this.listeners = new Map();
          }

          if (!this.listeners.has(key)) {
            var _key$split = key.split(':'),
                _key$split2 = dom_slicedToArray(_key$split, 2),
                akey = _key$split2[0],
                _key$split2$ = _key$split2[1],
                ekey = _key$split2$ === void 0 ? akey : _key$split2$;

            this.elt.addEventListener(ekey, fnValue, false);
            this.listeners.set(key, fnValue);
          }
        } else {
          this.elt.setAttribute(key, value);
        }
      } else {
        if (this.listeners && this.listeners.has(key)) {
          var _key$split3 = key.split(':'),
              _key$split4 = dom_slicedToArray(_key$split3, 2),
              _akey = _key$split4[0],
              _key$split4$ = _key$split4[1],
              _ekey = _key$split4$ === void 0 ? _akey : _key$split4$;

          this.elt.removeEventListener(_ekey, this.listeners.get(key));
          this.listeners["delete"](key);
        } else {
          this.elt.removeAttribute(key);
        }
      }
    }
  }]);

  return DomElement;
}();
// CONCATENATED MODULE: ./lib/armatura/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register", function() { return register; });
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function armatura_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function armatura_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function armatura_createClass(Constructor, protoProps, staticProps) { if (protoProps) armatura_defineProperties(Constructor.prototype, protoProps); if (staticProps) armatura_defineProperties(Constructor, staticProps); return Constructor; }






var armatura_WebClientAppStub =
/*#__PURE__*/
function () {
  function WebClientAppStub(props, $) {
    armatura_classCallCheck(this, WebClientAppStub);

    Object.assign(this, props);
    $.elt = $.ctx = $.rootElement || document.body;
  }

  armatura_createClass(WebClientAppStub, [{
    key: "render",
    value: function render($, _render) {
      runInBrowser(function () {
        return _render($);
      });
    }
  }]);

  return WebClientAppStub;
}();

function register() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return {
    run: function run() {
      var _ref2;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          rootElement = _ref.rootElement,
          template = _ref.template,
          _ref$App = _ref.App,
          App = _ref$App === void 0 ? armatura_WebClientAppStub : _ref$App,
          _ref$Element = _ref.Element,
          Element = _ref$Element === void 0 ? dom_DomElement : _ref$Element,
          props = _objectWithoutProperties(_ref, ["rootElement", "template", "App", "Element"]);

      var types = (_ref2 = [App]).concat.apply(_ref2, args);

      component_Component.Element = Element;
      App.template = template || App.TEMPLATE || "<".concat(types[1].name || types[1].NAME, "/>");
      registerTypes(types);
      var app = new component_Component(App, {
        props: props,
        rootElement: rootElement
      });
      app.render();
      app.init();
      return app.impl;
    }
  };
}

/***/ })
/******/ ]);
});