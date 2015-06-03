(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["mixintest"] = factory();
	else
		root["mixintest"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Vue = __webpack_require__(1)
	var Mixin = __webpack_require__(63)
	var reactor = __webpack_require__(65)
	var timeMachine = __webpack_require__(66)
	var itemActions = __webpack_require__(67)

	document.addEventListener("DOMContentLoaded", function() {
	  var reactorTimeMachine = timeMachine(reactor)

	  var List = Vue.extend({
	    mixins: [Mixin(reactor)],

	    getDataBindings: function() {
	      return {
	        items: itemActions.items,

	        count: itemActions.itemTotal,

	        isTooHigh: [itemActions.itemTotal, function(itemTotal)  {
	          return itemTotal && itemTotal > 5
	        }]
	      }
	    },

	    data: function(){
	      return {
	        name: '',
	        items: [],
	        count: 0,
	        isTooHigh: false
	      }
	    },

	    methods: {
	      addItem: function(e) {
	        e.preventDefault()
	        reactor.dispatch('addItem', {
	          name: this.name
	        })

	        this.name = ''
	      }
	    }
	  })


	  var History = Vue.extend({
	    mixins: [Mixin(reactorTimeMachine)],

	    getDataBindings: function() {
	      return {
	        readableHistory: [['history'], function(states) {
	          return states && states.map(function(state) {
	            return state.toString()
	          })
	        }],
	      }
	    },

	    data: function(){
	      return {
	        readableHistory: []
	      }
	    },

	    methods: {
	      restoreState: function(time) {
	        reactorTimeMachine.go(time)
	      },
	    }
	  })

	  var list1 = new List({
	    el: '#list1'
	  })
	  var list2 = new List({
	    el: '#list2'
	  })

	  var history = new History({
	    el: '#history'
	  })

	  reactor.dispatch('addItem', { name: 'item 1' })
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var extend = _.extend

	/**
	 * The exposed Vue constructor.
	 *
	 * API conventions:
	 * - public API methods/properties are prefiexed with `$`
	 * - internal methods/properties are prefixed with `_`
	 * - non-prefixed properties are assumed to be proxied user
	 *   data.
	 *
	 * @constructor
	 * @param {Object} [options]
	 * @public
	 */

	function Vue (options) {
	  this._init(options)
	}

	/**
	 * Mixin global API
	 */

	extend(Vue, __webpack_require__(28))

	/**
	 * Vue and every constructor that extends Vue has an
	 * associated options object, which can be accessed during
	 * compilation steps as `this.constructor.options`.
	 *
	 * These can be seen as the default options of every
	 * Vue instance.
	 */

	Vue.options = {
	  directives  : __webpack_require__(29),
	  filters     : __webpack_require__(52),
	  transitions : {},
	  components  : {},
	  elementDirectives: {}
	}

	/**
	 * Build up the prototype
	 */

	var p = Vue.prototype

	/**
	 * $data has a setter which does a bunch of
	 * teardown/setup work
	 */

	Object.defineProperty(p, '$data', {
	  get: function () {
	    return this._data
	  },
	  set: function (newData) {
	    if (newData !== this._data) {
	      this._setData(newData)
	    }
	  }
	})

	/**
	 * Mixin internal instance methods
	 */

	extend(p, __webpack_require__(54))
	extend(p, __webpack_require__(55))
	extend(p, __webpack_require__(56))
	extend(p, __webpack_require__(2))
	extend(p, __webpack_require__(57))

	/**
	 * Mixin public API methods
	 */

	extend(p, __webpack_require__(58))
	extend(p, __webpack_require__(59))
	extend(p, __webpack_require__(60))
	extend(p, __webpack_require__(61))
	extend(p, __webpack_require__(62))

	module.exports = _.Vue = Vue

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var Directive = __webpack_require__(11)
	var compile = __webpack_require__(23)
	var transclude = __webpack_require__(27)

	/**
	 * Transclude, compile and link element.
	 *
	 * If a pre-compiled linker is available, that means the
	 * passed in element will be pre-transcluded and compiled
	 * as well - all we need to do is to call the linker.
	 *
	 * Otherwise we need to call transclude/compile/link here.
	 *
	 * @param {Element} el
	 * @return {Element}
	 */

	exports._compile = function (el) {
	  var options = this.$options
	  if (options._linkFn) {
	    // pre-transcluded with linker, just use it
	    this._initElement(el)
	    this._unlinkFn = options._linkFn(this, el)
	  } else {
	    // transclude and init element
	    // transclude can potentially replace original
	    // so we need to keep reference
	    var original = el
	    el = transclude(el, options)
	    this._initElement(el)
	    // compile and link the rest
	    this._unlinkFn = compile(el, options)(this, el)
	    // finally replace original
	    if (options.replace) {
	      _.replace(original, el)
	    }
	  }
	  return el
	}

	/**
	 * Initialize instance element. Called in the public
	 * $mount() method.
	 *
	 * @param {Element} el
	 */

	exports._initElement = function (el) {
	  if (el instanceof DocumentFragment) {
	    this._isBlock = true
	    this.$el = this._blockStart = el.firstChild
	    this._blockEnd = el.lastChild
	    // set persisted text anchors to empty
	    if (this._blockStart.nodeType === 3) {
	      this._blockStart.data = this._blockEnd.data = ''
	    }
	    this._blockFragment = el
	  } else {
	    this.$el = el
	  }
	  this.$el.__vue__ = this
	  this._callHook('beforeCompile')
	}

	/**
	 * Create and bind a directive to an element.
	 *
	 * @param {String} name - directive name
	 * @param {Node} node   - target node
	 * @param {Object} desc - parsed directive descriptor
	 * @param {Object} def  - directive definition object
	 * @param {Vue|undefined} host - transclusion host component
	 */

	exports._bindDir = function (name, node, desc, def, host) {
	  this._directives.push(
	    new Directive(name, node, this, desc, def, host)
	  )
	}

	/**
	 * Teardown an instance, unobserves the data, unbind all the
	 * directives, turn off all the event listeners, etc.
	 *
	 * @param {Boolean} remove - whether to remove the DOM node.
	 * @param {Boolean} deferCleanup - if true, defer cleanup to
	 *                                 be called later
	 */

	exports._destroy = function (remove, deferCleanup) {
	  if (this._isBeingDestroyed) {
	    return
	  }
	  this._callHook('beforeDestroy')
	  this._isBeingDestroyed = true
	  var i
	  // remove self from parent. only necessary
	  // if parent is not being destroyed as well.
	  var parent = this.$parent
	  if (parent && !parent._isBeingDestroyed) {
	    parent._children.$remove(this)
	  }
	  // same for transclusion host.
	  var host = this._host
	  if (host && !host._isBeingDestroyed) {
	    host._transCpnts.$remove(this)
	  }
	  // destroy all children.
	  i = this._children.length
	  while (i--) {
	    this._children[i].$destroy()
	  }
	  // teardown all directives. this also tearsdown all
	  // directive-owned watchers.
	  if (this._unlinkFn) {
	    // passing destroying: true to avoid searching and
	    // splicing the directives
	    this._unlinkFn(true)
	  }
	  i = this._watchers.length
	  while (i--) {
	    this._watchers[i].teardown()
	  }
	  // remove reference to self on $el
	  if (this.$el) {
	    this.$el.__vue__ = null
	  }
	  // remove DOM element
	  var self = this
	  if (remove && this.$el) {
	    this.$remove(function () {
	      self._cleanup()
	    })
	  } else if (!deferCleanup) {
	    this._cleanup()
	  }
	}

	/**
	 * Clean up to ensure garbage collection.
	 * This is called after the leave transition if there
	 * is any.
	 */

	exports._cleanup = function () {
	  // remove reference from data ob
	  this._data.__ob__.removeVm(this)
	  this._data =
	  this._watchers =
	  this.$el =
	  this.$parent =
	  this.$root =
	  this._children =
	  this._transCpnts =
	  this._directives = null
	  // call the last hook...
	  this._isDestroyed = true
	  this._callHook('destroyed')
	  // turn off all instance listeners.
	  this.$off()
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var lang   = __webpack_require__(6)
	var extend = lang.extend

	extend(exports, lang)
	extend(exports, __webpack_require__(7))
	extend(exports, __webpack_require__(8))
	extend(exports, __webpack_require__(4))
	extend(exports, __webpack_require__(9))
	extend(exports, __webpack_require__(10))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var config = __webpack_require__(5)
	var commonTagRE = /^(div|p|span|img|a|br|ul|ol|li|h1|h2|h3|h4|h5|table|tbody|tr|td|pre)$/

	/**
	 * Check if an element is a component, if yes return its
	 * component id.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {String|undefined}
	 */

	exports.checkComponent = function (el, options) {
	  var tag = el.tagName.toLowerCase()
	  if (tag === 'component') {
	    // dynamic syntax
	    var exp = el.getAttribute('is')
	    el.removeAttribute('is')
	    return exp
	  } else if (
	    !commonTagRE.test(tag) &&
	    _.resolveAsset(options, 'components', tag)
	  ) {
	    return tag
	  }
	}

	/**
	 * Create an "anchor" for performing dom insertion/removals.
	 * This is used in a number of scenarios:
	 * - block instance
	 * - v-html
	 * - v-if
	 * - component
	 * - repeat
	 *
	 * @param {String} content
	 * @param {Boolean} persist - IE trashes empty textNodes on
	 *                            cloneNode(true), so in certain
	 *                            cases the anchor needs to be
	 *                            non-empty to be persisted in
	 *                            templates.
	 * @return {Comment|Text}
	 */

	exports.createAnchor = function (content, persist) {
	  return config.debug
	    ? document.createComment(content)
	    : document.createTextNode(persist ? ' ' : '')
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {

	  /**
	   * The prefix to look for when parsing directives.
	   *
	   * @type {String}
	   */

	  prefix: 'v-',

	  /**
	   * Whether to print debug messages.
	   * Also enables stack trace for warnings.
	   *
	   * @type {Boolean}
	   */

	  debug: false,

	  /**
	   * Whether to suppress warnings.
	   *
	   * @type {Boolean}
	   */

	  silent: false,

	  /**
	   * Whether allow observer to alter data objects'
	   * __proto__.
	   *
	   * @type {Boolean}
	   */

	  proto: true,

	  /**
	   * Whether to parse mustache tags in templates.
	   *
	   * @type {Boolean}
	   */

	  interpolate: true,

	  /**
	   * Whether to use async rendering.
	   */

	  async: true,

	  /**
	   * Whether to warn against errors caught when evaluating
	   * expressions.
	   */

	  warnExpressionErrors: true,

	  /**
	   * Internal flag to indicate the delimiters have been
	   * changed.
	   *
	   * @type {Boolean}
	   */

	  _delimitersChanged: true,

	  /**
	   * List of asset types that a component can own.
	   *
	   * @type {Array}
	   */

	  _assetTypes: [
	    'directive',
	    'elementDirective',
	    'filter',
	    'transition'
	  ]

	}

	/**
	 * Interpolation delimiters.
	 * We need to mark the changed flag so that the text parser
	 * knows it needs to recompile the regex.
	 *
	 * @type {Array<String>}
	 */

	var delimiters = ['{{', '}}']
	Object.defineProperty(module.exports, 'delimiters', {
	  get: function () {
	    return delimiters
	  },
	  set: function (val) {
	    delimiters = val
	    this._delimitersChanged = true
	  }
	})

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Check is a string starts with $ or _
	 *
	 * @param {String} str
	 * @return {Boolean}
	 */

	exports.isReserved = function (str) {
	  var c = (str + '').charCodeAt(0)
	  return c === 0x24 || c === 0x5F
	}

	/**
	 * Guard text output, make sure undefined outputs
	 * empty string
	 *
	 * @param {*} value
	 * @return {String}
	 */

	exports.toString = function (value) {
	  return value == null
	    ? ''
	    : value.toString()
	}

	/**
	 * Check and convert possible numeric numbers before
	 * setting back to data
	 *
	 * @param {*} value
	 * @return {*|Number}
	 */

	exports.toNumber = function (value) {
	  return (
	    isNaN(value) ||
	    value === null ||
	    typeof value === 'boolean'
	  ) ? value
	    : Number(value)
	}

	/**
	 * Strip quotes from a string
	 *
	 * @param {String} str
	 * @return {String | false}
	 */

	exports.stripQuotes = function (str) {
	  var a = str.charCodeAt(0)
	  var b = str.charCodeAt(str.length - 1)
	  return a === b && (a === 0x22 || a === 0x27)
	    ? str.slice(1, -1)
	    : false
	}

	/**
	 * Replace helper
	 *
	 * @param {String} _ - matched delimiter
	 * @param {String} c - matched char
	 * @return {String}
	 */
	function toUpper (_, c) {
	  return c ? c.toUpperCase () : ''
	}

	/**
	 * Camelize a hyphen-delmited string.
	 *
	 * @param {String} str
	 * @return {String}
	 */

	var camelRE = /-(\w)/g
	exports.camelize = function (str) {
	  return str.replace(camelRE, toUpper)
	}

	/**
	 * Converts hyphen/underscore/slash delimitered names into
	 * camelized classNames.
	 *
	 * e.g. my-component => MyComponent
	 *      some_else    => SomeElse
	 *      some/comp    => SomeComp
	 *
	 * @param {String} str
	 * @return {String}
	 */

	var classifyRE = /(?:^|[-_\/])(\w)/g
	exports.classify = function (str) {
	  return str.replace(classifyRE, toUpper)
	}

	/**
	 * Simple bind, faster than native
	 *
	 * @param {Function} fn
	 * @param {Object} ctx
	 * @return {Function}
	 */

	exports.bind = function (fn, ctx) {
	  return function (a) {
	    var l = arguments.length
	    return l
	      ? l > 1
	        ? fn.apply(ctx, arguments)
	        : fn.call(ctx, a)
	      : fn.call(ctx)
	  }
	}

	/**
	 * Convert an Array-like object to a real Array.
	 *
	 * @param {Array-like} list
	 * @param {Number} [start] - start index
	 * @return {Array}
	 */

	exports.toArray = function (list, start) {
	  start = start || 0
	  var i = list.length - start
	  var ret = new Array(i)
	  while (i--) {
	    ret[i] = list[i + start]
	  }
	  return ret
	}

	/**
	 * Mix properties into target object.
	 *
	 * @param {Object} to
	 * @param {Object} from
	 */

	exports.extend = function (to, from) {
	  for (var key in from) {
	    to[key] = from[key]
	  }
	  return to
	}

	/**
	 * Quick object check - this is primarily used to tell
	 * Objects from primitive values when we know the value
	 * is a JSON-compliant type.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	exports.isObject = function (obj) {
	  return obj && typeof obj === 'object'
	}

	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	var toString = Object.prototype.toString
	exports.isPlainObject = function (obj) {
	  return toString.call(obj) === '[object Object]'
	}

	/**
	 * Array type check.
	 *
	 * @param {*} obj
	 * @return {Boolean}
	 */

	exports.isArray = function (obj) {
	  return Array.isArray(obj)
	}

	/**
	 * Define a non-enumerable property
	 *
	 * @param {Object} obj
	 * @param {String} key
	 * @param {*} val
	 * @param {Boolean} [enumerable]
	 */

	exports.define = function (obj, key, val, enumerable) {
	  Object.defineProperty(obj, key, {
	    value        : val,
	    enumerable   : !!enumerable,
	    writable     : true,
	    configurable : true
	  })
	}

	/**
	 * Debounce a function so it only gets called after the
	 * input stops arriving after the given wait period.
	 *
	 * @param {Function} func
	 * @param {Number} wait
	 * @return {Function} - the debounced function
	 */

	exports.debounce = function(func, wait) {
	  var timeout, args, context, timestamp, result
	  var later = function() {
	    var last = Date.now() - timestamp
	    if (last < wait && last >= 0) {
	      timeout = setTimeout(later, wait - last)
	    } else {
	      timeout = null
	      result = func.apply(context, args)
	      if (!timeout) context = args = null
	    }
	  }
	  return function() {
	    context = this
	    args = arguments
	    timestamp = Date.now()
	    if (!timeout) {
	      timeout = setTimeout(later, wait)
	    }
	    return result
	  }
	}

	/**
	 * Manual indexOf because it's slightly faster than
	 * native.
	 *
	 * @param {Array} arr
	 * @param {*} obj
	 */

	exports.indexOf = function (arr, obj) {
	  for (var i = 0, l = arr.length; i < l; i++) {
	    if (arr[i] === obj) return i
	  }
	  return -1
	}

	/**
	 * Make a cancellable version of an async callback.
	 *
	 * @param {Function} fn
	 * @return {Function}
	 */

	exports.cancellable = function (fn) {
	  var cb = function () {
	    if (!cb.cancelled) {
	      return fn.apply(this, arguments)
	    }
	  }
	  cb.cancel = function () {
	    cb.cancelled = true
	  }
	  return cb
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// can we use __proto__?
	exports.hasProto = '__proto__' in {}

	// Browser environment sniffing
	var inBrowser = exports.inBrowser =
	  typeof window !== 'undefined' &&
	  Object.prototype.toString.call(window) !== '[object Object]'

	exports.isIE9 =
	  inBrowser &&
	  navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0

	exports.isAndroid =
	  inBrowser &&
	  navigator.userAgent.toLowerCase().indexOf('android') > 0

	// Transition property/event sniffing
	if (inBrowser && !exports.isIE9) {
	  var isWebkitTrans =
	    window.ontransitionend === undefined &&
	    window.onwebkittransitionend !== undefined
	  var isWebkitAnim =
	    window.onanimationend === undefined &&
	    window.onwebkitanimationend !== undefined
	  exports.transitionProp = isWebkitTrans
	    ? 'WebkitTransition'
	    : 'transition'
	  exports.transitionEndEvent = isWebkitTrans
	    ? 'webkitTransitionEnd'
	    : 'transitionend'
	  exports.animationProp = isWebkitAnim
	    ? 'WebkitAnimation'
	    : 'animation'
	  exports.animationEndEvent = isWebkitAnim
	    ? 'webkitAnimationEnd'
	    : 'animationend'
	}

	/**
	 * Defer a task to execute it asynchronously. Ideally this
	 * should be executed as a microtask, so we leverage
	 * MutationObserver if it's available, and fallback to
	 * setTimeout(0).
	 *
	 * @param {Function} cb
	 * @param {Object} ctx
	 */

	exports.nextTick = (function () {
	  var callbacks = []
	  var pending = false
	  var timerFunc
	  function handle () {
	    pending = false
	    var copies = callbacks.slice(0)
	    callbacks = []
	    for (var i = 0; i < copies.length; i++) {
	      copies[i]()
	    }
	  }
	  /* istanbul ignore if */
	  if (typeof MutationObserver !== 'undefined') {
	    var counter = 1
	    var observer = new MutationObserver(handle)
	    var textNode = document.createTextNode(counter)
	    observer.observe(textNode, {
	      characterData: true
	    })
	    timerFunc = function () {
	      counter = (counter + 1) % 2
	      textNode.data = counter
	    }
	  } else {
	    timerFunc = setTimeout
	  }
	  return function (cb, ctx) {
	    var func = ctx
	      ? function () { cb.call(ctx) }
	      : cb
	    callbacks.push(func)
	    if (pending) return
	    pending = true
	    timerFunc(handle, 0)
	  }
	})()

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(5)

	/**
	 * Check if a node is in the document.
	 * Note: document.documentElement.contains should work here
	 * but always returns false for comment nodes in phantomjs,
	 * making unit tests difficult. This is fixed byy doing the
	 * contains() check on the node's parentNode instead of
	 * the node itself.
	 *
	 * @param {Node} node
	 * @return {Boolean}
	 */

	var doc =
	  typeof document !== 'undefined' &&
	  document.documentElement

	exports.inDoc = function (node) {
	  var parent = node && node.parentNode
	  return doc === node ||
	    doc === parent ||
	    !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
	}

	/**
	 * Extract an attribute from a node.
	 *
	 * @param {Node} node
	 * @param {String} attr
	 */

	exports.attr = function (node, attr) {
	  attr = config.prefix + attr
	  var val = node.getAttribute(attr)
	  if (val !== null) {
	    node.removeAttribute(attr)
	  }
	  return val
	}

	/**
	 * Insert el before target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */

	exports.before = function (el, target) {
	  target.parentNode.insertBefore(el, target)
	}

	/**
	 * Insert el after target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */

	exports.after = function (el, target) {
	  if (target.nextSibling) {
	    exports.before(el, target.nextSibling)
	  } else {
	    target.parentNode.appendChild(el)
	  }
	}

	/**
	 * Remove el from DOM
	 *
	 * @param {Element} el
	 */

	exports.remove = function (el) {
	  el.parentNode.removeChild(el)
	}

	/**
	 * Prepend el to target
	 *
	 * @param {Element} el
	 * @param {Element} target
	 */

	exports.prepend = function (el, target) {
	  if (target.firstChild) {
	    exports.before(el, target.firstChild)
	  } else {
	    target.appendChild(el)
	  }
	}

	/**
	 * Replace target with el
	 *
	 * @param {Element} target
	 * @param {Element} el
	 */

	exports.replace = function (target, el) {
	  var parent = target.parentNode
	  if (parent) {
	    parent.replaceChild(el, target)
	  }
	}

	/**
	 * Add event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 */

	exports.on = function (el, event, cb) {
	  el.addEventListener(event, cb)
	}

	/**
	 * Remove event listener shorthand.
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Function} cb
	 */

	exports.off = function (el, event, cb) {
	  el.removeEventListener(event, cb)
	}

	/**
	 * Add class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {Strong} cls
	 */

	exports.addClass = function (el, cls) {
	  if (el.classList) {
	    el.classList.add(cls)
	  } else {
	    var cur = ' ' + (el.getAttribute('class') || '') + ' '
	    if (cur.indexOf(' ' + cls + ' ') < 0) {
	      el.setAttribute('class', (cur + cls).trim())
	    }
	  }
	}

	/**
	 * Remove class with compatibility for IE & SVG
	 *
	 * @param {Element} el
	 * @param {Strong} cls
	 */

	exports.removeClass = function (el, cls) {
	  if (el.classList) {
	    el.classList.remove(cls)
	  } else {
	    var cur = ' ' + (el.getAttribute('class') || '') + ' '
	    var tar = ' ' + cls + ' '
	    while (cur.indexOf(tar) >= 0) {
	      cur = cur.replace(tar, ' ')
	    }
	    el.setAttribute('class', cur.trim())
	  }
	}

	/**
	 * Extract raw content inside an element into a temporary
	 * container div
	 *
	 * @param {Element} el
	 * @param {Boolean} asFragment
	 * @return {Element}
	 */

	exports.extractContent = function (el, asFragment) {
	  var child
	  var rawContent
	  /* istanbul ignore if */
	  if (
	    el.tagName === 'TEMPLATE' &&
	    el.content instanceof DocumentFragment
	  ) {
	    el = el.content
	  }
	  if (el.hasChildNodes()) {
	    rawContent = asFragment
	      ? document.createDocumentFragment()
	      : document.createElement('div')
	    /* jshint boss:true */
	    while (child = el.firstChild) {
	      rawContent.appendChild(child)
	    }
	  }
	  return rawContent
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(5)

	/**
	 * Enable debug utilities. The enableDebug() function and
	 * all _.log() & _.warn() calls will be dropped in the
	 * minified production build.
	 */

	enableDebug()

	function enableDebug () {

	  var hasConsole = typeof console !== 'undefined'
	  
	  /**
	   * Log a message.
	   *
	   * @param {String} msg
	   */

	  exports.log = function (msg) {
	    if (hasConsole && config.debug) {
	      console.log('[Vue info]: ' + msg)
	    }
	  }

	  /**
	   * We've got a problem here.
	   *
	   * @param {String} msg
	   */

	  exports.warn = function (msg) {
	    if (hasConsole && (!config.silent || config.debug)) {
	      console.warn('[Vue warn]: ' + msg)
	      /* istanbul ignore if */
	      if (config.debug) {
	        /* jshint debug: true */
	        debugger
	      }
	    }
	  }

	  /**
	   * Assert asset exists
	   */

	  exports.assertAsset = function (val, type, id) {
	    /* istanbul ignore if */
	    if (type === 'directive') {
	      if (id === 'component') {
	        exports.warn(
	          'v-component has been deprecated in 0.12. ' +
	          'Use custom element syntax instead.'
	        )
	        return
	      }
	      if (id === 'with') {
	        exports.warn(
	          'v-with has been deprecated in 0.12. ' +
	          'Use props instead.'
	        )
	        return
	      }
	    }
	    if (!val) {
	      exports.warn('Failed to resolve ' + type + ': ' + id)
	    }
	  }
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var extend = _.extend

	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 *
	 * All strategy functions follow the same signature:
	 *
	 * @param {*} parentVal
	 * @param {*} childVal
	 * @param {Vue} [vm]
	 */

	var strats = Object.create(null)

	/**
	 * Helper that recursively merges two data objects together.
	 */

	function mergeData (to, from) {
	  var key, toVal, fromVal
	  for (key in from) {
	    toVal = to[key]
	    fromVal = from[key]
	    if (!to.hasOwnProperty(key)) {
	      to.$add(key, fromVal)
	    } else if (_.isObject(toVal) && _.isObject(fromVal)) {
	      mergeData(toVal, fromVal)
	    }
	  }
	  return to
	}

	/**
	 * Data
	 */

	strats.data = function (parentVal, childVal, vm) {
	  if (!vm) {
	    // in a Vue.extend merge, both should be functions
	    if (!childVal) {
	      return parentVal
	    }
	    if (typeof childVal !== 'function') {
	      _.warn(
	        'The "data" option should be a function ' +
	        'that returns a per-instance value in component ' +
	        'definitions.'
	      )
	      return parentVal
	    }
	    if (!parentVal) {
	      return childVal
	    }
	    // when parentVal & childVal are both present,
	    // we need to return a function that returns the
	    // merged result of both functions... no need to
	    // check if parentVal is a function here because
	    // it has to be a function to pass previous merges.
	    return function mergedDataFn () {
	      return mergeData(
	        childVal.call(this),
	        parentVal.call(this)
	      )
	    }
	  } else {
	    // instance merge, return raw object
	    var instanceData = typeof childVal === 'function'
	      ? childVal.call(vm)
	      : childVal
	    var defaultData = typeof parentVal === 'function'
	      ? parentVal.call(vm)
	      : undefined
	    if (instanceData) {
	      return mergeData(instanceData, defaultData)
	    } else {
	      return defaultData
	    }
	  }
	}

	/**
	 * El
	 */

	strats.el = function (parentVal, childVal, vm) {
	  if (!vm && childVal && typeof childVal !== 'function') {
	    _.warn(
	      'The "el" option should be a function ' +
	      'that returns a per-instance value in component ' +
	      'definitions.'
	    )
	    return
	  }
	  var ret = childVal || parentVal
	  // invoke the element factory if this is instance merge
	  return vm && typeof ret === 'function'
	    ? ret.call(vm)
	    : ret
	}

	/**
	 * Hooks and param attributes are merged as arrays.
	 */

	strats.created =
	strats.ready =
	strats.attached =
	strats.detached =
	strats.beforeCompile =
	strats.compiled =
	strats.beforeDestroy =
	strats.destroyed =
	strats.props = function (parentVal, childVal) {
	  return childVal
	    ? parentVal
	      ? parentVal.concat(childVal)
	      : _.isArray(childVal)
	        ? childVal
	        : [childVal]
	    : parentVal
	}

	/**
	 * 0.11 deprecation warning
	 */

	strats.paramAttributes = function () {
	  /* istanbul ignore next */
	  _.warn(
	    '"paramAttributes" option has been deprecated in 0.12. ' +
	    'Use "props" instead.'
	  )
	}

	/**
	 * Assets
	 *
	 * When a vm is present (instance creation), we need to do
	 * a three-way merge between constructor options, instance
	 * options and parent options.
	 */

	strats.directives =
	strats.filters =
	strats.transitions =
	strats.components =
	strats.elementDirectives = function (parentVal, childVal) {
	  var res = Object.create(parentVal)
	  return childVal
	    ? extend(res, childVal)
	    : res
	}

	/**
	 * Events & Watchers.
	 *
	 * Events & watchers hashes should not overwrite one
	 * another, so we merge them as arrays.
	 */

	strats.watch =
	strats.events = function (parentVal, childVal) {
	  if (!childVal) return parentVal
	  if (!parentVal) return childVal
	  var ret = {}
	  extend(ret, parentVal)
	  for (var key in childVal) {
	    var parent = ret[key]
	    var child = childVal[key]
	    if (parent && !_.isArray(parent)) {
	      parent = [parent]
	    }
	    ret[key] = parent
	      ? parent.concat(child)
	      : [child]
	  }
	  return ret
	}

	/**
	 * Other object hashes.
	 */

	strats.methods =
	strats.computed = function (parentVal, childVal) {
	  if (!childVal) return parentVal
	  if (!parentVal) return childVal
	  var ret = Object.create(parentVal)
	  extend(ret, childVal)
	  return ret
	}

	/**
	 * Default strategy.
	 */

	var defaultStrat = function (parentVal, childVal) {
	  return childVal === undefined
	    ? parentVal
	    : childVal
	}

	/**
	 * Make sure component options get converted to actual
	 * constructors.
	 *
	 * @param {Object} components
	 */

	function guardComponents (components) {
	  if (components) {
	    var def
	    for (var key in components) {
	      def = components[key]
	      if (_.isPlainObject(def)) {
	        def.name = key
	        components[key] = _.Vue.extend(def)
	      }
	    }
	  }
	}

	/**
	 * Merge two option objects into a new one.
	 * Core utility used in both instantiation and inheritance.
	 *
	 * @param {Object} parent
	 * @param {Object} child
	 * @param {Vue} [vm] - if vm is present, indicates this is
	 *                     an instantiation merge.
	 */

	exports.mergeOptions = function merge (parent, child, vm) {
	  guardComponents(child.components)
	  var options = {}
	  var key
	  if (child.mixins) {
	    for (var i = 0, l = child.mixins.length; i < l; i++) {
	      parent = merge(parent, child.mixins[i], vm)
	    }
	  }
	  for (key in parent) {
	    mergeField(key)
	  }
	  for (key in child) {
	    if (!(parent.hasOwnProperty(key))) {
	      mergeField(key)
	    }
	  }
	  function mergeField (key) {
	    var strat = strats[key] || defaultStrat
	    options[key] = strat(parent[key], child[key], vm, key)
	  }
	  return options
	}

	/**
	 * Resolve an asset.
	 * This function is used because child instances need access
	 * to assets defined in its ancestor chain.
	 *
	 * @param {Object} options
	 * @param {String} type
	 * @param {String} id
	 * @return {Object|Function}
	 */

	exports.resolveAsset = function resolve (options, type, id) {
	  var asset = options[type][id]
	  while (!asset && options._parent) {
	    options = options._parent.$options
	    asset = options[type][id]
	  }
	  return asset
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var config = __webpack_require__(5)
	var Watcher = __webpack_require__(12)
	var textParser = __webpack_require__(21)
	var expParser = __webpack_require__(17)

	/**
	 * A directive links a DOM element with a piece of data,
	 * which is the result of evaluating an expression.
	 * It registers a watcher with the expression and calls
	 * the DOM update function when a change is triggered.
	 *
	 * @param {String} name
	 * @param {Node} el
	 * @param {Vue} vm
	 * @param {Object} descriptor
	 *                 - {String} expression
	 *                 - {String} [arg]
	 *                 - {Array<Object>} [filters]
	 * @param {Object} def - directive definition object
	 * @param {Vue|undefined} host - transclusion host target
	 * @constructor
	 */

	function Directive (name, el, vm, descriptor, def, host) {
	  // public
	  this.name = name
	  this.el = el
	  this.vm = vm
	  // copy descriptor props
	  this.raw = descriptor.raw
	  this.expression = descriptor.expression
	  this.arg = descriptor.arg
	  this.filters = descriptor.filters
	  // private
	  this._descriptor = descriptor
	  this._host = host
	  this._locked = false
	  this._bound = false
	  // init
	  this._bind(def)
	}

	var p = Directive.prototype

	/**
	 * Initialize the directive, mixin definition properties,
	 * setup the watcher, call definition bind() and update()
	 * if present.
	 *
	 * @param {Object} def
	 */

	p._bind = function (def) {
	  if (this.name !== 'cloak' && this.el && this.el.removeAttribute) {
	    this.el.removeAttribute(config.prefix + this.name)
	  }
	  if (typeof def === 'function') {
	    this.update = def
	  } else {
	    _.extend(this, def)
	  }
	  this._watcherExp = this.expression
	  this._checkDynamicLiteral()
	  if (this.bind) {
	    this.bind()
	  }
	  if (this._watcherExp &&
	      (this.update || this.twoWay) &&
	      (!this.isLiteral || this._isDynamicLiteral) &&
	      !this._checkStatement()) {
	    // wrapped updater for context
	    var dir = this
	    var update = this._update = this.update
	      ? function (val, oldVal) {
	          if (!dir._locked) {
	            dir.update(val, oldVal)
	          }
	        }
	      : function () {} // noop if no update is provided
	    // pre-process hook called before the value is piped
	    // through the filters. used in v-repeat.
	    var preProcess = this._preProcess
	      ? _.bind(this._preProcess, this)
	      : null
	    var watcher = this._watcher = new Watcher(
	      this.vm,
	      this._watcherExp,
	      update, // callback
	      {
	        filters: this.filters,
	        twoWay: this.twoWay,
	        deep: this.deep,
	        preProcess: preProcess
	      }
	    )
	    if (this._initValue != null) {
	      watcher.set(this._initValue)
	    } else if (this.update) {
	      this.update(watcher.value)
	    }
	  }
	  this._bound = true
	}

	/**
	 * check if this is a dynamic literal binding.
	 *
	 * e.g. v-component="{{currentView}}"
	 */

	p._checkDynamicLiteral = function () {
	  var expression = this.expression
	  if (expression && this.isLiteral) {
	    var tokens = textParser.parse(expression)
	    if (tokens) {
	      var exp = textParser.tokensToExp(tokens)
	      this.expression = this.vm.$get(exp)
	      this._watcherExp = exp
	      this._isDynamicLiteral = true
	    }
	  }
	}

	/**
	 * Check if the directive is a function caller
	 * and if the expression is a callable one. If both true,
	 * we wrap up the expression and use it as the event
	 * handler.
	 *
	 * e.g. v-on="click: a++"
	 *
	 * @return {Boolean}
	 */

	p._checkStatement = function () {
	  var expression = this.expression
	  if (
	    expression && this.acceptStatement &&
	    !expParser.isSimplePath(expression)
	  ) {
	    var fn = expParser.parse(expression).get
	    var vm = this.vm
	    var handler = function () {
	      fn.call(vm, vm)
	    }
	    if (this.filters) {
	      handler = vm._applyFilters(handler, null, this.filters)
	    }
	    this.update(handler)
	    return true
	  }
	}

	/**
	 * Check for an attribute directive param, e.g. lazy
	 *
	 * @param {String} name
	 * @return {String}
	 */

	p._checkParam = function (name) {
	  var param = this.el.getAttribute(name)
	  if (param !== null) {
	    this.el.removeAttribute(name)
	  }
	  return param
	}

	/**
	 * Teardown the watcher and call unbind.
	 */

	p._teardown = function () {
	  if (this._bound) {
	    this._bound = false
	    if (this.unbind) {
	      this.unbind()
	    }
	    if (this._watcher) {
	      this._watcher.teardown()
	    }
	    this.vm = this.el = this._watcher = null
	  }
	}

	/**
	 * Set the corresponding value with the setter.
	 * This should only be used in two-way directives
	 * e.g. v-model.
	 *
	 * @param {*} value
	 * @public
	 */

	p.set = function (value) {
	  if (this.twoWay) {
	    this._withLock(function () {
	      this._watcher.set(value)
	    })
	  }
	}

	/**
	 * Execute a function while preventing that function from
	 * triggering updates on this directive instance.
	 *
	 * @param {Function} fn
	 */

	p._withLock = function (fn) {
	  var self = this
	  self._locked = true
	  fn.call(self)
	  _.nextTick(function () {
	    self._locked = false
	  })
	}

	module.exports = Directive

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var config = __webpack_require__(5)
	var Observer = __webpack_require__(13)
	var expParser = __webpack_require__(17)
	var batcher = __webpack_require__(20)
	var uid = 0

	/**
	 * A watcher parses an expression, collects dependencies,
	 * and fires callback when the expression value changes.
	 * This is used for both the $watch() api and directives.
	 *
	 * @param {Vue} vm
	 * @param {String} expression
	 * @param {Function} cb
	 * @param {Object} options
	 *                 - {Array} filters
	 *                 - {Boolean} twoWay
	 *                 - {Boolean} deep
	 *                 - {Boolean} user
	 *                 - {Function} [preProcess]
	 * @constructor
	 */

	function Watcher (vm, expression, cb, options) {
	  this.vm = vm
	  vm._watchers.push(this)
	  this.expression = expression
	  this.cb = cb
	  this.id = ++uid // uid for batching
	  this.active = true
	  options = options || {}
	  this.deep = !!options.deep
	  this.user = !!options.user
	  this.twoWay = !!options.twoWay
	  this.filters = options.filters
	  this.preProcess = options.preProcess
	  this.deps = []
	  this.newDeps = []
	  // parse expression for getter/setter
	  var res = expParser.parse(expression, options.twoWay)
	  this.getter = res.get
	  this.setter = res.set
	  this.value = this.get()
	}

	var p = Watcher.prototype

	/**
	 * Add a dependency to this directive.
	 *
	 * @param {Dep} dep
	 */

	p.addDep = function (dep) {
	  var newDeps = this.newDeps
	  var old = this.deps
	  if (_.indexOf(newDeps, dep) < 0) {
	    newDeps.push(dep)
	    var i = _.indexOf(old, dep)
	    if (i < 0) {
	      dep.addSub(this)
	    } else {
	      old[i] = null
	    }
	  }
	}

	/**
	 * Evaluate the getter, and re-collect dependencies.
	 */

	p.get = function () {
	  this.beforeGet()
	  var vm = this.vm
	  var value
	  try {
	    value = this.getter.call(vm, vm)
	  } catch (e) {
	    if (config.warnExpressionErrors) {
	      _.warn(
	        'Error when evaluating expression "' +
	        this.expression + '":\n   ' + e
	      )
	    }
	  }
	  // "touch" every property so they are all tracked as
	  // dependencies for deep watching
	  if (this.deep) {
	    traverse(value)
	  }
	  if (this.preProcess) {
	    value = this.preProcess(value)
	  }
	  if (this.filters) {
	    value = vm._applyFilters(value, null, this.filters, false)
	  }
	  this.afterGet()
	  return value
	}

	/**
	 * Set the corresponding value with the setter.
	 *
	 * @param {*} value
	 */

	p.set = function (value) {
	  var vm = this.vm
	  if (this.filters) {
	    value = vm._applyFilters(
	      value, this.value, this.filters, true)
	  }
	  try {
	    this.setter.call(vm, vm, value)
	  } catch (e) {
	    if (config.warnExpressionErrors) {
	      _.warn(
	        'Error when evaluating setter "' +
	        this.expression + '":\n   ' + e
	      )
	    }
	  }
	}

	/**
	 * Prepare for dependency collection.
	 */

	p.beforeGet = function () {
	  Observer.target = this
	}

	/**
	 * Clean up for dependency collection.
	 */

	p.afterGet = function () {
	  Observer.target = null
	  var i = this.deps.length
	  while (i--) {
	    var dep = this.deps[i]
	    if (dep) {
	      dep.removeSub(this)
	    }
	  }
	  this.deps = this.newDeps
	  this.newDeps = []
	}

	/**
	 * Subscriber interface.
	 * Will be called when a dependency changes.
	 */

	p.update = function () {
	  if (!config.async || config.debug) {
	    this.run()
	  } else {
	    batcher.push(this)
	  }
	}

	/**
	 * Batcher job interface.
	 * Will be called by the batcher.
	 */

	p.run = function () {
	  if (this.active) {
	    var value = this.get()
	    if (
	      value !== this.value ||
	      Array.isArray(value) ||
	      this.deep
	    ) {
	      var oldValue = this.value
	      this.value = value
	      this.cb(value, oldValue)
	    }
	  }
	}

	/**
	 * Remove self from all dependencies' subcriber list.
	 */

	p.teardown = function () {
	  if (this.active) {
	    // remove self from vm's watcher list
	    // we can skip this if the vm if being destroyed
	    // which can improve teardown performance.
	    if (!this.vm._isBeingDestroyed) {
	      this.vm._watchers.$remove(this)
	    }
	    var i = this.deps.length
	    while (i--) {
	      this.deps[i].removeSub(this)
	    }
	    this.active = false
	    this.vm = this.cb = this.value = null
	  }
	}


	/**
	 * Recrusively traverse an object to evoke all converted
	 * getters, so that every nested property inside the object
	 * is collected as a "deep" dependency.
	 *
	 * @param {Object} obj
	 */

	function traverse (obj) {
	  var key, val, i
	  for (key in obj) {
	    val = obj[key]
	    if (_.isArray(val)) {
	      i = val.length
	      while (i--) traverse(val[i])
	    } else if (_.isObject(val)) {
	      traverse(val)
	    }
	  }
	}

	module.exports = Watcher

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var config = __webpack_require__(5)
	var Dep = __webpack_require__(14)
	var arrayMethods = __webpack_require__(15)
	var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
	__webpack_require__(16)

	var uid = 0

	/**
	 * Type enums
	 */

	var ARRAY  = 0
	var OBJECT = 1

	/**
	 * Augment an target Object or Array by intercepting
	 * the prototype chain using __proto__
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */

	function protoAugment (target, src) {
	  target.__proto__ = src
	}

	/**
	 * Augment an target Object or Array by defining
	 * hidden properties.
	 *
	 * @param {Object|Array} target
	 * @param {Object} proto
	 */

	function copyAugment (target, src, keys) {
	  var i = keys.length
	  var key
	  while (i--) {
	    key = keys[i]
	    _.define(target, key, src[key])
	  }
	}

	/**
	 * Observer class that are attached to each observed
	 * object. Once attached, the observer converts target
	 * object's property keys into getter/setters that
	 * collect dependencies and dispatches updates.
	 *
	 * @param {Array|Object} value
	 * @param {Number} type
	 * @constructor
	 */

	function Observer (value, type) {
	  this.id = ++uid
	  this.value = value
	  this.active = true
	  this.deps = []
	  _.define(value, '__ob__', this)
	  if (type === ARRAY) {
	    var augment = config.proto && _.hasProto
	      ? protoAugment
	      : copyAugment
	    augment(value, arrayMethods, arrayKeys)
	    this.observeArray(value)
	  } else if (type === OBJECT) {
	    this.walk(value)
	  }
	}

	Observer.target = null

	var p = Observer.prototype

	/**
	 * Attempt to create an observer instance for a value,
	 * returns the new observer if successfully observed,
	 * or the existing observer if the value already has one.
	 *
	 * @param {*} value
	 * @return {Observer|undefined}
	 * @static
	 */

	Observer.create = function (value) {
	  if (
	    value &&
	    value.hasOwnProperty('__ob__') &&
	    value.__ob__ instanceof Observer
	  ) {
	    return value.__ob__
	  } else if (_.isArray(value)) {
	    return new Observer(value, ARRAY)
	  } else if (
	    _.isPlainObject(value) &&
	    !value._isVue // avoid Vue instance
	  ) {
	    return new Observer(value, OBJECT)
	  }
	}

	/**
	 * Walk through each property and convert them into
	 * getter/setters. This method should only be called when
	 * value type is Object. Properties prefixed with `$` or `_`
	 * and accessor properties are ignored.
	 *
	 * @param {Object} obj
	 */

	p.walk = function (obj) {
	  var keys = Object.keys(obj)
	  var i = keys.length
	  var key, prefix
	  while (i--) {
	    key = keys[i]
	    prefix = key.charCodeAt(0)
	    if (prefix !== 0x24 && prefix !== 0x5F) { // skip $ or _
	      this.convert(key, obj[key])
	    }
	  }
	}

	/**
	 * Try to carete an observer for a child value,
	 * and if value is array, link dep to the array.
	 *
	 * @param {*} val
	 * @return {Dep|undefined}
	 */

	p.observe = function (val) {
	  return Observer.create(val)
	}

	/**
	 * Observe a list of Array items.
	 *
	 * @param {Array} items
	 */

	p.observeArray = function (items) {
	  var i = items.length
	  while (i--) {
	    this.observe(items[i])
	  }
	}

	/**
	 * Convert a property into getter/setter so we can emit
	 * the events when the property is accessed/changed.
	 *
	 * @param {String} key
	 * @param {*} val
	 */

	p.convert = function (key, val) {
	  var ob = this
	  var childOb = ob.observe(val)
	  var dep = new Dep()
	  if (childOb) {
	    childOb.deps.push(dep)
	  }
	  Object.defineProperty(ob.value, key, {
	    enumerable: true,
	    configurable: true,
	    get: function () {
	      // Observer.target is a watcher whose getter is
	      // currently being evaluated.
	      if (ob.active && Observer.target) {
	        Observer.target.addDep(dep)
	      }
	      return val
	    },
	    set: function (newVal) {
	      if (newVal === val) return
	      // remove dep from old value
	      var oldChildOb = val && val.__ob__
	      if (oldChildOb) {
	        oldChildOb.deps.$remove(dep)
	      }
	      val = newVal
	      // add dep to new value
	      var newChildOb = ob.observe(newVal)
	      if (newChildOb) {
	        newChildOb.deps.push(dep)
	      }
	      dep.notify()
	    }
	  })
	}

	/**
	 * Notify change on all self deps on an observer.
	 * This is called when a mutable value mutates. e.g.
	 * when an Array's mutating methods are called, or an
	 * Object's $add/$delete are called.
	 */

	p.notify = function () {
	  var deps = this.deps
	  for (var i = 0, l = deps.length; i < l; i++) {
	    deps[i].notify()
	  }
	}

	/**
	 * Add an owner vm, so that when $add/$delete mutations
	 * happen we can notify owner vms to proxy the keys and
	 * digest the watchers. This is only called when the object
	 * is observed as an instance's root $data.
	 *
	 * @param {Vue} vm
	 */

	p.addVm = function (vm) {
	  (this.vms = this.vms || []).push(vm)
	}

	/**
	 * Remove an owner vm. This is called when the object is
	 * swapped out as an instance's $data object.
	 *
	 * @param {Vue} vm
	 */

	p.removeVm = function (vm) {
	  this.vms.$remove(vm)
	}

	module.exports = Observer


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	/**
	 * A dep is an observable that can have multiple
	 * directives subscribing to it.
	 *
	 * @constructor
	 */

	function Dep () {
	  this.subs = []
	}

	var p = Dep.prototype

	/**
	 * Add a directive subscriber.
	 *
	 * @param {Directive} sub
	 */

	p.addSub = function (sub) {
	  this.subs.push(sub)
	}

	/**
	 * Remove a directive subscriber.
	 *
	 * @param {Directive} sub
	 */

	p.removeSub = function (sub) {
	  this.subs.$remove(sub)
	}

	/**
	 * Notify all subscribers of a new value.
	 */

	p.notify = function () {
	  // stablize the subscriber list first
	  var subs = _.toArray(this.subs)
	  for (var i = 0, l = subs.length; i < l; i++) {
	    subs[i].update()
	  }
	}

	module.exports = Dep

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var arrayProto = Array.prototype
	var arrayMethods = Object.create(arrayProto)

	/**
	 * Intercept mutating methods and emit events
	 */

	;[
	  'push',
	  'pop',
	  'shift',
	  'unshift',
	  'splice',
	  'sort',
	  'reverse'
	]
	.forEach(function (method) {
	  // cache original method
	  var original = arrayProto[method]
	  _.define(arrayMethods, method, function mutator () {
	    // avoid leaking arguments:
	    // http://jsperf.com/closure-with-arguments
	    var i = arguments.length
	    var args = new Array(i)
	    while (i--) {
	      args[i] = arguments[i]
	    }
	    var result = original.apply(this, args)
	    var ob = this.__ob__
	    var inserted
	    switch (method) {
	      case 'push':
	        inserted = args
	        break
	      case 'unshift':
	        inserted = args
	        break
	      case 'splice':
	        inserted = args.slice(2)
	        break
	    }
	    if (inserted) ob.observeArray(inserted)
	    // notify change
	    ob.notify()
	    return result
	  })
	})

	/**
	 * Swap the element at the given index with a new value
	 * and emits corresponding event.
	 *
	 * @param {Number} index
	 * @param {*} val
	 * @return {*} - replaced element
	 */

	_.define(
	  arrayProto,
	  '$set',
	  function $set (index, val) {
	    if (index >= this.length) {
	      this.length = index + 1
	    }
	    return this.splice(index, 1, val)[0]
	  }
	)

	/**
	 * Convenience method to remove the element at given index.
	 *
	 * @param {Number} index
	 * @param {*} val
	 */

	_.define(
	  arrayProto,
	  '$remove',
	  function $remove (index) {
	    /* istanbul ignore if */
	    if (!this.length) return
	    if (typeof index !== 'number') {
	      index = _.indexOf(this, index)
	    }
	    if (index > -1) {
	      this.splice(index, 1)
	    }
	  }
	)

	module.exports = arrayMethods

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var objProto = Object.prototype

	/**
	 * Add a new property to an observed object
	 * and emits corresponding event
	 *
	 * @param {String} key
	 * @param {*} val
	 * @public
	 */

	_.define(
	  objProto,
	  '$add',
	  function $add (key, val) {
	    if (this.hasOwnProperty(key)) return
	    var ob = this.__ob__
	    if (!ob || _.isReserved(key)) {
	      this[key] = val
	      return
	    }
	    ob.convert(key, val)
	    ob.notify()
	    if (ob.vms) {
	      var i = ob.vms.length
	      while (i--) {
	        var vm = ob.vms[i]
	        vm._proxy(key)
	        vm._digest()
	      }
	    }
	  }
	)

	/**
	 * Set a property on an observed object, calling add to
	 * ensure the property is observed.
	 *
	 * @param {String} key
	 * @param {*} val
	 * @public
	 */

	_.define(
	  objProto,
	  '$set',
	  function $set (key, val) {
	    this.$add(key, val)
	    this[key] = val
	  }
	)

	/**
	 * Deletes a property from an observed object
	 * and emits corresponding event
	 *
	 * @param {String} key
	 * @public
	 */

	_.define(
	  objProto,
	  '$delete',
	  function $delete (key) {
	    if (!this.hasOwnProperty(key)) return
	    delete this[key]
	    var ob = this.__ob__
	    if (!ob || _.isReserved(key)) {
	      return
	    }
	    ob.notify()
	    if (ob.vms) {
	      var i = ob.vms.length
	      while (i--) {
	        var vm = ob.vms[i]
	        vm._unproxy(key)
	        vm._digest()
	      }
	    }
	  }
	)

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var Path = __webpack_require__(18)
	var Cache = __webpack_require__(19)
	var expressionCache = new Cache(1000)

	var allowedKeywords =
	  'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
	  'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
	  'encodeURIComponent,parseInt,parseFloat'
	var allowedKeywordsRE =
	  new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)')

	// keywords that don't make sense inside expressions
	var improperKeywords =
	  'break,case,class,catch,const,continue,debugger,default,' +
	  'delete,do,else,export,extends,finally,for,function,if,' +
	  'import,in,instanceof,let,return,super,switch,throw,try,' +
	  'var,while,with,yield,enum,await,implements,package,' +
	  'proctected,static,interface,private,public'
	var improperKeywordsRE =
	  new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)')

	var wsRE = /\s/g
	var newlineRE = /\n/g
	var saveRE = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|new |typeof |void /g
	var restoreRE = /"(\d+)"/g
	var pathTestRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
	var pathReplaceRE = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g
	var booleanLiteralRE = /^(true|false)$/

	/**
	 * Save / Rewrite / Restore
	 *
	 * When rewriting paths found in an expression, it is
	 * possible for the same letter sequences to be found in
	 * strings and Object literal property keys. Therefore we
	 * remove and store these parts in a temporary array, and
	 * restore them after the path rewrite.
	 */

	var saved = []

	/**
	 * Save replacer
	 *
	 * The save regex can match two possible cases:
	 * 1. An opening object literal
	 * 2. A string
	 * If matched as a plain string, we need to escape its
	 * newlines, since the string needs to be preserved when
	 * generating the function body.
	 *
	 * @param {String} str
	 * @param {String} isString - str if matched as a string
	 * @return {String} - placeholder with index
	 */

	function save (str, isString) {
	  var i = saved.length
	  saved[i] = isString
	    ? str.replace(newlineRE, '\\n')
	    : str
	  return '"' + i + '"'
	}

	/**
	 * Path rewrite replacer
	 *
	 * @param {String} raw
	 * @return {String}
	 */

	function rewrite (raw) {
	  var c = raw.charAt(0)
	  var path = raw.slice(1)
	  if (allowedKeywordsRE.test(path)) {
	    return raw
	  } else {
	    path = path.indexOf('"') > -1
	      ? path.replace(restoreRE, restore)
	      : path
	    return c + 'scope.' + path
	  }
	}

	/**
	 * Restore replacer
	 *
	 * @param {String} str
	 * @param {String} i - matched save index
	 * @return {String}
	 */

	function restore (str, i) {
	  return saved[i]
	}

	/**
	 * Rewrite an expression, prefixing all path accessors with
	 * `scope.` and generate getter/setter functions.
	 *
	 * @param {String} exp
	 * @param {Boolean} needSet
	 * @return {Function}
	 */

	function compileExpFns (exp, needSet) {
	  if (improperKeywordsRE.test(exp)) {
	    _.warn(
	      'Avoid using reserved keywords in expression: '
	      + exp
	    )
	  }
	  // reset state
	  saved.length = 0
	  // save strings and object literal keys
	  var body = exp
	    .replace(saveRE, save)
	    .replace(wsRE, '')
	  // rewrite all paths
	  // pad 1 space here becaue the regex matches 1 extra char
	  body = (' ' + body)
	    .replace(pathReplaceRE, rewrite)
	    .replace(restoreRE, restore)
	  var getter = makeGetter(body)
	  if (getter) {
	    return {
	      get: getter,
	      body: body,
	      set: needSet
	        ? makeSetter(body)
	        : null
	    }
	  }
	}

	/**
	 * Compile getter setters for a simple path.
	 *
	 * @param {String} exp
	 * @return {Function}
	 */

	function compilePathFns (exp) {
	  var getter, path
	  if (exp.indexOf('[') < 0) {
	    // really simple path
	    path = exp.split('.')
	    path.raw = exp
	    getter = Path.compileGetter(path)
	  } else {
	    // do the real parsing
	    path = Path.parse(exp)
	    getter = path.get
	  }
	  return {
	    get: getter,
	    // always generate setter for simple paths
	    set: function (obj, val) {
	      Path.set(obj, path, val)
	    }
	  }
	}

	/**
	 * Build a getter function. Requires eval.
	 *
	 * We isolate the try/catch so it doesn't affect the
	 * optimization of the parse function when it is not called.
	 *
	 * @param {String} body
	 * @return {Function|undefined}
	 */

	function makeGetter (body) {
	  try {
	    return new Function('scope', 'return ' + body + ';')
	  } catch (e) {
	    _.warn(
	      'Invalid expression. ' +
	      'Generated function body: ' + body
	    )
	  }
	}

	/**
	 * Build a setter function.
	 *
	 * This is only needed in rare situations like "a[b]" where
	 * a settable path requires dynamic evaluation.
	 *
	 * This setter function may throw error when called if the
	 * expression body is not a valid left-hand expression in
	 * assignment.
	 *
	 * @param {String} body
	 * @return {Function|undefined}
	 */

	function makeSetter (body) {
	  try {
	    return new Function('scope', 'value', body + '=value;')
	  } catch (e) {
	    _.warn('Invalid setter function body: ' + body)
	  }
	}

	/**
	 * Check for setter existence on a cache hit.
	 *
	 * @param {Function} hit
	 */

	function checkSetter (hit) {
	  if (!hit.set) {
	    hit.set = makeSetter(hit.body)
	  }
	}

	/**
	 * Parse an expression into re-written getter/setters.
	 *
	 * @param {String} exp
	 * @param {Boolean} needSet
	 * @return {Function}
	 */

	exports.parse = function (exp, needSet) {
	  exp = exp.trim()
	  // try cache
	  var hit = expressionCache.get(exp)
	  if (hit) {
	    if (needSet) {
	      checkSetter(hit)
	    }
	    return hit
	  }
	  // we do a simple path check to optimize for them.
	  // the check fails valid paths with unusal whitespaces,
	  // but that's too rare and we don't care.
	  // also skip boolean literals and paths that start with
	  // global "Math"
	  var res = exports.isSimplePath(exp)
	    ? compilePathFns(exp)
	    : compileExpFns(exp, needSet)
	  expressionCache.put(exp, res)
	  return res
	}

	/**
	 * Check if an expression is a simple path.
	 *
	 * @param {String} exp
	 * @return {Boolean}
	 */

	exports.isSimplePath = function (exp) {
	  return pathTestRE.test(exp) &&
	    // don't treat true/false as paths
	    !booleanLiteralRE.test(exp) &&
	    // Math constants e.g. Math.PI, Math.E etc.
	    exp.slice(0, 5) !== 'Math.'
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var Cache = __webpack_require__(19)
	var pathCache = new Cache(1000)
	var identRE = exports.identRE = /^[$_a-zA-Z]+[\w$]*$/

	/**
	 * Path-parsing algorithm scooped from Polymer/observe-js
	 */

	var pathStateMachine = {
	  'beforePath': {
	    'ws': ['beforePath'],
	    'ident': ['inIdent', 'append'],
	    '[': ['beforeElement'],
	    'eof': ['afterPath']
	  },

	  'inPath': {
	    'ws': ['inPath'],
	    '.': ['beforeIdent'],
	    '[': ['beforeElement'],
	    'eof': ['afterPath']
	  },

	  'beforeIdent': {
	    'ws': ['beforeIdent'],
	    'ident': ['inIdent', 'append']
	  },

	  'inIdent': {
	    'ident': ['inIdent', 'append'],
	    '0': ['inIdent', 'append'],
	    'number': ['inIdent', 'append'],
	    'ws': ['inPath', 'push'],
	    '.': ['beforeIdent', 'push'],
	    '[': ['beforeElement', 'push'],
	    'eof': ['afterPath', 'push'],
	    ']': ['inPath', 'push']
	  },

	  'beforeElement': {
	    'ws': ['beforeElement'],
	    '0': ['afterZero', 'append'],
	    'number': ['inIndex', 'append'],
	    "'": ['inSingleQuote', 'append', ''],
	    '"': ['inDoubleQuote', 'append', ''],
	    "ident": ['inIdent', 'append', '*']
	  },

	  'afterZero': {
	    'ws': ['afterElement', 'push'],
	    ']': ['inPath', 'push']
	  },

	  'inIndex': {
	    '0': ['inIndex', 'append'],
	    'number': ['inIndex', 'append'],
	    'ws': ['afterElement'],
	    ']': ['inPath', 'push']
	  },

	  'inSingleQuote': {
	    "'": ['afterElement'],
	    'eof': 'error',
	    'else': ['inSingleQuote', 'append']
	  },

	  'inDoubleQuote': {
	    '"': ['afterElement'],
	    'eof': 'error',
	    'else': ['inDoubleQuote', 'append']
	  },

	  'afterElement': {
	    'ws': ['afterElement'],
	    ']': ['inPath', 'push']
	  }
	}

	function noop () {}

	/**
	 * Determine the type of a character in a keypath.
	 *
	 * @param {Char} char
	 * @return {String} type
	 */

	function getPathCharType (char) {
	  if (char === undefined) {
	    return 'eof'
	  }

	  var code = char.charCodeAt(0)

	  switch(code) {
	    case 0x5B: // [
	    case 0x5D: // ]
	    case 0x2E: // .
	    case 0x22: // "
	    case 0x27: // '
	    case 0x30: // 0
	      return char

	    case 0x5F: // _
	    case 0x24: // $
	      return 'ident'

	    case 0x20: // Space
	    case 0x09: // Tab
	    case 0x0A: // Newline
	    case 0x0D: // Return
	    case 0xA0:  // No-break space
	    case 0xFEFF:  // Byte Order Mark
	    case 0x2028:  // Line Separator
	    case 0x2029:  // Paragraph Separator
	      return 'ws'
	  }

	  // a-z, A-Z
	  if ((0x61 <= code && code <= 0x7A) ||
	      (0x41 <= code && code <= 0x5A)) {
	    return 'ident'
	  }

	  // 1-9
	  if (0x31 <= code && code <= 0x39) {
	    return 'number'
	  }

	  return 'else'
	}

	/**
	 * Parse a string path into an array of segments
	 * Todo implement cache
	 *
	 * @param {String} path
	 * @return {Array|undefined}
	 */

	function parsePath (path) {
	  var keys = []
	  var index = -1
	  var mode = 'beforePath'
	  var c, newChar, key, type, transition, action, typeMap

	  var actions = {
	    push: function() {
	      if (key === undefined) {
	        return
	      }
	      keys.push(key)
	      key = undefined
	    },
	    append: function() {
	      if (key === undefined) {
	        key = newChar
	      } else {
	        key += newChar
	      }
	    }
	  }

	  function maybeUnescapeQuote () {
	    var nextChar = path[index + 1]
	    if ((mode === 'inSingleQuote' && nextChar === "'") ||
	        (mode === 'inDoubleQuote' && nextChar === '"')) {
	      index++
	      newChar = nextChar
	      actions.append()
	      return true
	    }
	  }

	  while (mode) {
	    index++
	    c = path[index]

	    if (c === '\\' && maybeUnescapeQuote()) {
	      continue
	    }

	    type = getPathCharType(c)
	    typeMap = pathStateMachine[mode]
	    transition = typeMap[type] || typeMap['else'] || 'error'

	    if (transition === 'error') {
	      return // parse error
	    }

	    mode = transition[0]
	    action = actions[transition[1]] || noop
	    newChar = transition[2]
	    newChar = newChar === undefined
	      ? c
	      : newChar === '*'
	        ? newChar + c
	        : newChar
	    action()

	    if (mode === 'afterPath') {
	      keys.raw = path
	      return keys
	    }
	  }
	}

	/**
	 * Format a accessor segment based on its type.
	 *
	 * @param {String} key
	 * @return {Boolean}
	 */

	function formatAccessor (key) {
	  if (identRE.test(key)) { // identifier
	    return '.' + key
	  } else if (+key === key >>> 0) { // bracket index
	    return '[' + key + ']'
	  } else if (key.charAt(0) === '*') {
	    return '[o' + formatAccessor(key.slice(1)) + ']'
	  } else { // bracket string
	    return '["' + key.replace(/"/g, '\\"') + '"]'
	  }
	}

	/**
	 * Compiles a getter function with a fixed path.
	 * The fixed path getter supresses errors.
	 *
	 * @param {Array} path
	 * @return {Function}
	 */

	exports.compileGetter = function (path) {
	  var body = 'return o' + path.map(formatAccessor).join('')
	  return new Function('o', 'try {' + body + '} catch (e) {}')
	}

	/**
	 * External parse that check for a cache hit first
	 *
	 * @param {String} path
	 * @return {Array|undefined}
	 */

	exports.parse = function (path) {
	  var hit = pathCache.get(path)
	  if (!hit) {
	    hit = parsePath(path)
	    if (hit) {
	      hit.get = exports.compileGetter(hit)
	      pathCache.put(path, hit)
	    }
	  }
	  return hit
	}

	/**
	 * Get from an object from a path string
	 *
	 * @param {Object} obj
	 * @param {String} path
	 */

	exports.get = function (obj, path) {
	  path = exports.parse(path)
	  if (path) {
	    return path.get(obj)
	  }
	}

	/**
	 * Set on an object from a path
	 *
	 * @param {Object} obj
	 * @param {String | Array} path
	 * @param {*} val
	 */

	exports.set = function (obj, path, val) {
	  var original = obj
	  if (typeof path === 'string') {
	    path = exports.parse(path)
	  }
	  if (!path || !_.isObject(obj)) {
	    return false
	  }
	  var last, key
	  for (var i = 0, l = path.length; i < l; i++) {
	    last = obj
	    key = path[i]
	    if (key.charAt(0) === '*') {
	      key = original[key.slice(1)]
	    }
	    if (i < l - 1) {
	      obj = obj[key]
	      if (!_.isObject(obj)) {
	        obj = {}
	        last.$add(key, obj)
	        warnNonExistent(path)
	      }
	    } else {
	      if (key in obj) {
	        obj[key] = val
	      } else {
	        obj.$add(key, val)
	        warnNonExistent(path)
	      }
	    }
	  }
	  return true
	}

	function warnNonExistent (path) {
	  _.warn(
	    'You are setting a non-existent path "' + path.raw + '" ' +
	    'on a vm instance. Consider pre-initializing the property ' +
	    'with the "data" option for more reliable reactivity ' +
	    'and better performance.'
	  )
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * A doubly linked list-based Least Recently Used (LRU)
	 * cache. Will keep most recently used items while
	 * discarding least recently used items when its limit is
	 * reached. This is a bare-bone version of
	 * Rasmus Andersson's js-lru:
	 *
	 *   https://github.com/rsms/js-lru
	 *
	 * @param {Number} limit
	 * @constructor
	 */

	function Cache (limit) {
	  this.size = 0
	  this.limit = limit
	  this.head = this.tail = undefined
	  this._keymap = {}
	}

	var p = Cache.prototype

	/**
	 * Put <value> into the cache associated with <key>.
	 * Returns the entry which was removed to make room for
	 * the new entry. Otherwise undefined is returned.
	 * (i.e. if there was enough room already).
	 *
	 * @param {String} key
	 * @param {*} value
	 * @return {Entry|undefined}
	 */

	p.put = function (key, value) {
	  var entry = {
	    key:key,
	    value:value
	  }
	  this._keymap[key] = entry
	  if (this.tail) {
	    this.tail.newer = entry
	    entry.older = this.tail
	  } else {
	    this.head = entry
	  }
	  this.tail = entry
	  if (this.size === this.limit) {
	    return this.shift()
	  } else {
	    this.size++
	  }
	}

	/**
	 * Purge the least recently used (oldest) entry from the
	 * cache. Returns the removed entry or undefined if the
	 * cache was empty.
	 */

	p.shift = function () {
	  var entry = this.head
	  if (entry) {
	    this.head = this.head.newer
	    this.head.older = undefined
	    entry.newer = entry.older = undefined
	    this._keymap[entry.key] = undefined
	  }
	  return entry
	}

	/**
	 * Get and register recent use of <key>. Returns the value
	 * associated with <key> or undefined if not in cache.
	 *
	 * @param {String} key
	 * @param {Boolean} returnEntry
	 * @return {Entry|*}
	 */

	p.get = function (key, returnEntry) {
	  var entry = this._keymap[key]
	  if (entry === undefined) return
	  if (entry === this.tail) {
	    return returnEntry
	      ? entry
	      : entry.value
	  }
	  // HEAD--------------TAIL
	  //   <.older   .newer>
	  //  <--- add direction --
	  //   A  B  C  <D>  E
	  if (entry.newer) {
	    if (entry === this.head) {
	      this.head = entry.newer
	    }
	    entry.newer.older = entry.older // C <-- E.
	  }
	  if (entry.older) {
	    entry.older.newer = entry.newer // C. --> E
	  }
	  entry.newer = undefined // D --x
	  entry.older = this.tail // D. --> E
	  if (this.tail) {
	    this.tail.newer = entry // E. <-- D
	  }
	  this.tail = entry
	  return returnEntry
	    ? entry
	    : entry.value
	}

	module.exports = Cache

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var MAX_UPDATE_COUNT = 10

	// we have two separate queues: one for directive updates
	// and one for user watcher registered via $watch().
	// we want to guarantee directive updates to be called
	// before user watchers so that when user watchers are
	// triggered, the DOM would have already been in updated
	// state.
	var queue = []
	var userQueue = []
	var has = {}
	var waiting = false
	var flushing = false

	/**
	 * Reset the batcher's state.
	 */

	function reset () {
	  queue = []
	  userQueue = []
	  has = {}
	  waiting = false
	  flushing = false
	}

	/**
	 * Flush both queues and run the jobs.
	 */

	function flush () {
	  flushing = true
	  run(queue)
	  run(userQueue)
	  reset()
	}

	/**
	 * Run the jobs in a single queue.
	 *
	 * @param {Array} queue
	 */

	function run (queue) {
	  // do not cache length because more jobs might be pushed
	  // as we run existing jobs
	  for (var i = 0; i < queue.length; i++) {
	    queue[i].run()
	  }
	}

	/**
	 * Push a job into the job queue.
	 * Jobs with duplicate IDs will be skipped unless it's
	 * pushed when the queue is being flushed.
	 *
	 * @param {Object} job
	 *   properties:
	 *   - {String|Number} id
	 *   - {Function}      run
	 */

	exports.push = function (job) {
	  var id = job.id
	  if (!id || !has[id] || flushing) {
	    if (!has[id]) {
	      has[id] = 1
	    } else {
	      has[id]++
	      // detect possible infinite update loops
	      if (has[id] > MAX_UPDATE_COUNT) {
	        _.warn(
	          'You may have an infinite update loop for the ' +
	          'watcher with expression: "' + job.expression + '".'
	        )
	        return
	      }
	    }
	    // A user watcher callback could trigger another
	    // directive update during the flushing; at that time
	    // the directive queue would already have been run, so
	    // we call that update immediately as it is pushed.
	    if (flushing && !job.user) {
	      job.run()
	      return
	    }
	    ;(job.user ? userQueue : queue).push(job)
	    if (!waiting) {
	      waiting = true
	      _.nextTick(flush)
	    }
	  }
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Cache = __webpack_require__(19)
	var config = __webpack_require__(5)
	var dirParser = __webpack_require__(22)
	var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
	var cache, tagRE, htmlRE, firstChar, lastChar

	/**
	 * Escape a string so it can be used in a RegExp
	 * constructor.
	 *
	 * @param {String} str
	 */

	function escapeRegex (str) {
	  return str.replace(regexEscapeRE, '\\$&')
	}

	/**
	 * Compile the interpolation tag regex.
	 *
	 * @return {RegExp}
	 */

	function compileRegex () {
	  config._delimitersChanged = false
	  var open = config.delimiters[0]
	  var close = config.delimiters[1]
	  firstChar = open.charAt(0)
	  lastChar = close.charAt(close.length - 1)
	  var firstCharRE = escapeRegex(firstChar)
	  var lastCharRE = escapeRegex(lastChar)
	  var openRE = escapeRegex(open)
	  var closeRE = escapeRegex(close)
	  tagRE = new RegExp(
	    firstCharRE + '?' + openRE +
	    '(.+?)' +
	    closeRE + lastCharRE + '?',
	    'g'
	  )
	  htmlRE = new RegExp(
	    '^' + firstCharRE + openRE +
	    '.*' +
	    closeRE + lastCharRE + '$'
	  )
	  // reset cache
	  cache = new Cache(1000)
	}

	/**
	 * Parse a template text string into an array of tokens.
	 *
	 * @param {String} text
	 * @return {Array<Object> | null}
	 *               - {String} type
	 *               - {String} value
	 *               - {Boolean} [html]
	 *               - {Boolean} [oneTime]
	 */

	exports.parse = function (text) {
	  if (config._delimitersChanged) {
	    compileRegex()
	  }
	  var hit = cache.get(text)
	  if (hit) {
	    return hit
	  }
	  if (!tagRE.test(text)) {
	    return null
	  }
	  var tokens = []
	  var lastIndex = tagRE.lastIndex = 0
	  var match, index, value, first, oneTime
	  /* jshint boss:true */
	  while (match = tagRE.exec(text)) {
	    index = match.index
	    // push text token
	    if (index > lastIndex) {
	      tokens.push({
	        value: text.slice(lastIndex, index)
	      })
	    }
	    // tag token
	    first = match[1].charCodeAt(0)
	    oneTime = first === 0x2A // *
	    value = oneTime
	      ? match[1].slice(1)
	      : match[1]
	    tokens.push({
	      tag: true,
	      value: value.trim(),
	      html: htmlRE.test(match[0]),
	      oneTime: oneTime
	    })
	    lastIndex = index + match[0].length
	  }
	  if (lastIndex < text.length) {
	    tokens.push({
	      value: text.slice(lastIndex)
	    })
	  }
	  cache.put(text, tokens)
	  return tokens
	}

	/**
	 * Format a list of tokens into an expression.
	 * e.g. tokens parsed from 'a {{b}} c' can be serialized
	 * into one single expression as '"a " + b + " c"'.
	 *
	 * @param {Array} tokens
	 * @param {Vue} [vm]
	 * @return {String}
	 */

	exports.tokensToExp = function (tokens, vm) {
	  return tokens.length > 1
	    ? tokens.map(function (token) {
	        return formatToken(token, vm)
	      }).join('+')
	    : formatToken(tokens[0], vm, true)
	}

	/**
	 * Format a single token.
	 *
	 * @param {Object} token
	 * @param {Vue} [vm]
	 * @param {Boolean} single
	 * @return {String}
	 */

	function formatToken (token, vm, single) {
	  return token.tag
	    ? vm && token.oneTime
	      ? '"' + vm.$eval(token.value) + '"'
	      : inlineFilters(token.value, single)
	    : '"' + token.value + '"'
	}

	/**
	 * For an attribute with multiple interpolation tags,
	 * e.g. attr="some-{{thing | filter}}", in order to combine
	 * the whole thing into a single watchable expression, we
	 * have to inline those filters. This function does exactly
	 * that. This is a bit hacky but it avoids heavy changes
	 * to directive parser and watcher mechanism.
	 *
	 * @param {String} exp
	 * @param {Boolean} single
	 * @return {String}
	 */

	var filterRE = /[^|]\|[^|]/
	function inlineFilters (exp, single) {
	  if (!filterRE.test(exp)) {
	    return single
	      ? exp
	      : '(' + exp + ')'
	  } else {
	    var dir = dirParser.parse(exp)[0]
	    if (!dir.filters) {
	      return '(' + exp + ')'
	    } else {
	      return 'this._applyFilters(' +
	        dir.expression + // value
	        ',null,' +       // oldValue (null for read)
	        JSON.stringify(dir.filters) + // filter descriptors
	        ',false)'        // write?
	    }
	  }
	}

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var Cache = __webpack_require__(19)
	var cache = new Cache(1000)
	var argRE = /^[^\{\?]+$|^'[^']*'$|^"[^"]*"$/
	var filterTokenRE = /[^\s'"]+|'[^']+'|"[^"]+"/g
	var reservedArgRE = /^in$|^-?\d+/

	/**
	 * Parser state
	 */

	var str
	var c, i, l
	var inSingle
	var inDouble
	var curly
	var square
	var paren
	var begin
	var argIndex
	var dirs
	var dir
	var lastFilterIndex
	var arg

	/**
	 * Push a directive object into the result Array
	 */

	function pushDir () {
	  dir.raw = str.slice(begin, i).trim()
	  if (dir.expression === undefined) {
	    dir.expression = str.slice(argIndex, i).trim()
	  } else if (lastFilterIndex !== begin) {
	    pushFilter()
	  }
	  if (i === 0 || dir.expression) {
	    dirs.push(dir)
	  }
	}

	/**
	 * Push a filter to the current directive object
	 */

	function pushFilter () {
	  var exp = str.slice(lastFilterIndex, i).trim()
	  var filter
	  if (exp) {
	    filter = {}
	    var tokens = exp.match(filterTokenRE)
	    filter.name = tokens[0]
	    if (tokens.length > 1) {
	      filter.args = tokens.slice(1).map(processFilterArg)
	    }
	  }
	  if (filter) {
	    (dir.filters = dir.filters || []).push(filter)
	  }
	  lastFilterIndex = i + 1
	}

	/**
	 * Check if an argument is dynamic and strip quotes.
	 *
	 * @param {String} arg
	 * @return {Object}
	 */

	function processFilterArg (arg) {
	  var stripped = reservedArgRE.test(arg)
	    ? arg
	    : _.stripQuotes(arg)
	  return {
	    value: stripped || arg,
	    dynamic: !stripped
	  }
	}

	/**
	 * Parse a directive string into an Array of AST-like
	 * objects representing directives.
	 *
	 * Example:
	 *
	 * "click: a = a + 1 | uppercase" will yield:
	 * {
	 *   arg: 'click',
	 *   expression: 'a = a + 1',
	 *   filters: [
	 *     { name: 'uppercase', args: null }
	 *   ]
	 * }
	 *
	 * @param {String} str
	 * @return {Array<Object>}
	 */

	exports.parse = function (s) {

	  var hit = cache.get(s)
	  if (hit) {
	    return hit
	  }

	  // reset parser state
	  str = s
	  inSingle = inDouble = false
	  curly = square = paren = begin = argIndex = 0
	  lastFilterIndex = 0
	  dirs = []
	  dir = {}
	  arg = null

	  for (i = 0, l = str.length; i < l; i++) {
	    c = str.charCodeAt(i)
	    if (inSingle) {
	      // check single quote
	      if (c === 0x27) inSingle = !inSingle
	    } else if (inDouble) {
	      // check double quote
	      if (c === 0x22) inDouble = !inDouble
	    } else if (
	      c === 0x2C && // comma
	      !paren && !curly && !square
	    ) {
	      // reached the end of a directive
	      pushDir()
	      // reset & skip the comma
	      dir = {}
	      begin = argIndex = lastFilterIndex = i + 1
	    } else if (
	      c === 0x3A && // colon
	      !dir.expression &&
	      !dir.arg
	    ) {
	      // argument
	      arg = str.slice(begin, i).trim()
	      // test for valid argument here
	      // since we may have caught stuff like first half of
	      // an object literal or a ternary expression.
	      if (argRE.test(arg)) {
	        argIndex = i + 1
	        dir.arg = _.stripQuotes(arg) || arg
	      }
	    } else if (
	      c === 0x7C && // pipe
	      str.charCodeAt(i + 1) !== 0x7C &&
	      str.charCodeAt(i - 1) !== 0x7C
	    ) {
	      if (dir.expression === undefined) {
	        // first filter, end of expression
	        lastFilterIndex = i + 1
	        dir.expression = str.slice(argIndex, i).trim()
	      } else {
	        // already has filter
	        pushFilter()
	      }
	    } else {
	      switch (c) {
	        case 0x22: inDouble = true; break // "
	        case 0x27: inSingle = true; break // '
	        case 0x28: paren++; break         // (
	        case 0x29: paren--; break         // )
	        case 0x5B: square++; break        // [
	        case 0x5D: square--; break        // ]
	        case 0x7B: curly++; break         // {
	        case 0x7D: curly--; break         // }
	      }
	    }
	  }

	  if (i === 0 || begin !== i) {
	    pushDir()
	  }

	  cache.put(s, dirs)
	  return dirs
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var config = __webpack_require__(5)
	var textParser = __webpack_require__(21)
	var dirParser = __webpack_require__(22)
	var templateParser = __webpack_require__(24)
	var resolveAsset = _.resolveAsset

	// internal directives
	var propDef = __webpack_require__(25)
	var componentDef = __webpack_require__(26)

	// terminal directives
	var terminalDirectives = [
	  'repeat',
	  'if'
	]

	module.exports = compile

	/**
	 * Compile a template and return a reusable composite link
	 * function, which recursively contains more link functions
	 * inside. This top level compile function should only be
	 * called on instance root nodes.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Object} options
	 * @param {Boolean} partial
	 * @param {Boolean} transcluded
	 * @return {Function}
	 */

	function compile (el, options, partial, transcluded) {
	  // link function for the node itself.
	  var nodeLinkFn = !partial
	    ? compileRoot(el, options)
	    : compileNode(el, options)
	  // link function for the childNodes
	  var childLinkFn =
	    !(nodeLinkFn && nodeLinkFn.terminal) &&
	    el.tagName !== 'SCRIPT' &&
	    el.hasChildNodes()
	      ? compileNodeList(el.childNodes, options)
	      : null

	  /**
	   * A composite linker function to be called on a already
	   * compiled piece of DOM, which instantiates all directive
	   * instances.
	   *
	   * @param {Vue} vm
	   * @param {Element|DocumentFragment} el
	   * @return {Function|undefined}
	   */

	  function compositeLinkFn (vm, el) {
	    // save original directive count before linking
	    // so we can capture the directives created during a
	    // partial compilation.
	    var originalDirCount = vm._directives.length
	    var parentOriginalDirCount =
	      vm.$parent && vm.$parent._directives.length
	    // cache childNodes before linking parent, fix #657
	    var childNodes = _.toArray(el.childNodes)
	    // if this is a transcluded compile, linkers need to be
	    // called in source scope, and the host needs to be
	    // passed down.
	    var source = transcluded ? vm.$parent : vm
	    var host = transcluded ? vm : undefined
	    // link
	    if (nodeLinkFn) nodeLinkFn(source, el, host)
	    if (childLinkFn) childLinkFn(source, childNodes, host)

	    var selfDirs = vm._directives.slice(originalDirCount)
	    var parentDirs = vm.$parent &&
	      vm.$parent._directives.slice(parentOriginalDirCount)

	    /**
	     * The linker function returns an unlink function that
	     * tearsdown all directives instances generated during
	     * the process.
	     *
	     * @param {Boolean} destroying
	     */
	    return function unlink (destroying) {
	      teardownDirs(vm, selfDirs, destroying)
	      if (parentDirs) {
	        teardownDirs(vm.$parent, parentDirs)
	      }
	    }
	  }

	  // transcluded linkFns are terminal, because it takes
	  // over the entire sub-tree.
	  if (transcluded) {
	    compositeLinkFn.terminal = true
	  }

	  return compositeLinkFn
	}

	/**
	 * Teardown a subset of directives on a vm.
	 *
	 * @param {Vue} vm
	 * @param {Array} dirs
	 * @param {Boolean} destroying
	 */

	function teardownDirs (vm, dirs, destroying) {
	  var i = dirs.length
	  while (i--) {
	    dirs[i]._teardown()
	    if (!destroying) {
	      vm._directives.$remove(dirs[i])
	    }
	  }
	}

	/**
	 * Compile the root element of an instance. There are
	 * 3 types of things to process here:
	 * 
	 * 1. props on parent container (child scope)
	 * 2. other attrs on parent container (parent scope)
	 * 3. attrs on the component template root node, if
	 *    replace:true (child scope)
	 *
	 * Also, if this is a block instance, we only need to
	 * compile 1 & 2 here.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function}
	 */

	function compileRoot (el, options) {
	  var containerAttrs = options._containerAttrs
	  var replacerAttrs = options._replacerAttrs
	  var props = options.props
	  var propsLinkFn, parentLinkFn, replacerLinkFn
	  // 1. props
	  propsLinkFn = props && containerAttrs
	    ? compileProps(el, containerAttrs, props)
	    : null
	  // only need to compile other attributes for
	  // non-block instances
	  if (el.nodeType !== 11) {
	    // for components, container and replacer need to be
	    // compiled separately and linked in different scopes.
	    if (options._asComponent) {
	      // 2. container attributes
	      if (containerAttrs) {
	        parentLinkFn = compileDirectives(containerAttrs, options)
	      }
	      if (replacerAttrs) {
	        // 3. replacer attributes
	        replacerLinkFn = compileDirectives(replacerAttrs, options)
	      }
	    } else {
	      // non-component, just compile as a normal element.
	      replacerLinkFn = compileDirectives(el, options)
	    }
	  }
	  return function rootLinkFn (vm, el, host) {
	    // explicitly passing null to props
	    // linkers because they don't need a real element
	    if (propsLinkFn) propsLinkFn(vm, null)
	    if (parentLinkFn) parentLinkFn(vm.$parent, el, host)
	    if (replacerLinkFn) replacerLinkFn(vm, el, host)
	  }
	}

	/**
	 * Compile a node and return a nodeLinkFn based on the
	 * node type.
	 *
	 * @param {Node} node
	 * @param {Object} options
	 * @return {Function|null}
	 */

	function compileNode (node, options) {
	  var type = node.nodeType
	  if (type === 1 && node.tagName !== 'SCRIPT') {
	    return compileElement(node, options)
	  } else if (type === 3 && config.interpolate && node.data.trim()) {
	    return compileTextNode(node, options)
	  } else {
	    return null
	  }
	}

	/**
	 * Compile an element and return a nodeLinkFn.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function|null}
	 */

	function compileElement (el, options) {
	  var hasAttrs = el.hasAttributes()
	  if (hasAttrs && checkTransclusion(el)) {
	    // unwrap textNode
	    if (el.hasAttribute('__vue__wrap')) {
	      el = el.firstChild
	    }
	    return compile(el, options._parent.$options, true, true)
	  }
	  // check element directives
	  var linkFn = checkElementDirectives(el, options)
	  // check terminal direcitves (repeat & if)
	  if (!linkFn && hasAttrs) {
	    linkFn = checkTerminalDirectives(el, options)
	  }
	  // check component
	  if (!linkFn) {
	    linkFn = checkComponent(el, options)
	  }
	  // normal directives
	  if (!linkFn && hasAttrs) {
	    linkFn = compileDirectives(el, options)
	  }
	  // if the element is a textarea, we need to interpolate
	  // its content on initial render.
	  if (el.tagName === 'TEXTAREA') {
	    var realLinkFn = linkFn
	    linkFn = function (vm, el) {
	      el.value = vm.$interpolate(el.value)
	      if (realLinkFn) realLinkFn(vm, el)
	    }
	    linkFn.terminal = true
	  }
	  return linkFn
	}

	/**
	 * Compile a textNode and return a nodeLinkFn.
	 *
	 * @param {TextNode} node
	 * @param {Object} options
	 * @return {Function|null} textNodeLinkFn
	 */

	function compileTextNode (node, options) {
	  var tokens = textParser.parse(node.data)
	  if (!tokens) {
	    return null
	  }
	  var frag = document.createDocumentFragment()
	  var el, token
	  for (var i = 0, l = tokens.length; i < l; i++) {
	    token = tokens[i]
	    el = token.tag
	      ? processTextToken(token, options)
	      : document.createTextNode(token.value)
	    frag.appendChild(el)
	  }
	  return makeTextNodeLinkFn(tokens, frag, options)
	}

	/**
	 * Process a single text token.
	 *
	 * @param {Object} token
	 * @param {Object} options
	 * @return {Node}
	 */

	function processTextToken (token, options) {
	  var el
	  if (token.oneTime) {
	    el = document.createTextNode(token.value)
	  } else {
	    if (token.html) {
	      el = document.createComment('v-html')
	      setTokenType('html')
	    } else {
	      // IE will clean up empty textNodes during
	      // frag.cloneNode(true), so we have to give it
	      // something here...
	      el = document.createTextNode(' ')
	      setTokenType('text')
	    }
	  }
	  function setTokenType (type) {
	    token.type = type
	    token.def = resolveAsset(options, 'directives', type)
	    token.descriptor = dirParser.parse(token.value)[0]
	  }
	  return el
	}

	/**
	 * Build a function that processes a textNode.
	 *
	 * @param {Array<Object>} tokens
	 * @param {DocumentFragment} frag
	 */

	function makeTextNodeLinkFn (tokens, frag) {
	  return function textNodeLinkFn (vm, el) {
	    var fragClone = frag.cloneNode(true)
	    var childNodes = _.toArray(fragClone.childNodes)
	    var token, value, node
	    for (var i = 0, l = tokens.length; i < l; i++) {
	      token = tokens[i]
	      value = token.value
	      if (token.tag) {
	        node = childNodes[i]
	        if (token.oneTime) {
	          value = vm.$eval(value)
	          if (token.html) {
	            _.replace(node, templateParser.parse(value, true))
	          } else {
	            node.data = value
	          }
	        } else {
	          vm._bindDir(token.type, node,
	                      token.descriptor, token.def)
	        }
	      }
	    }
	    _.replace(el, fragClone)
	  }
	}

	/**
	 * Compile a node list and return a childLinkFn.
	 *
	 * @param {NodeList} nodeList
	 * @param {Object} options
	 * @return {Function|undefined}
	 */

	function compileNodeList (nodeList, options) {
	  var linkFns = []
	  var nodeLinkFn, childLinkFn, node
	  for (var i = 0, l = nodeList.length; i < l; i++) {
	    node = nodeList[i]
	    nodeLinkFn = compileNode(node, options)
	    childLinkFn =
	      !(nodeLinkFn && nodeLinkFn.terminal) &&
	      node.tagName !== 'SCRIPT' &&
	      node.hasChildNodes()
	        ? compileNodeList(node.childNodes, options)
	        : null
	    linkFns.push(nodeLinkFn, childLinkFn)
	  }
	  return linkFns.length
	    ? makeChildLinkFn(linkFns)
	    : null
	}

	/**
	 * Make a child link function for a node's childNodes.
	 *
	 * @param {Array<Function>} linkFns
	 * @return {Function} childLinkFn
	 */

	function makeChildLinkFn (linkFns) {
	  return function childLinkFn (vm, nodes, host) {
	    var node, nodeLinkFn, childrenLinkFn
	    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
	      node = nodes[n]
	      nodeLinkFn = linkFns[i++]
	      childrenLinkFn = linkFns[i++]
	      // cache childNodes before linking parent, fix #657
	      var childNodes = _.toArray(node.childNodes)
	      if (nodeLinkFn) {
	        nodeLinkFn(vm, node, host)
	      }
	      if (childrenLinkFn) {
	        childrenLinkFn(vm, childNodes, host)
	      }
	    }
	  }
	}

	/**
	 * Compile param attributes on a root element and return
	 * a props link function.
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Object} attrs
	 * @param {Array} propNames
	 * @return {Function} propsLinkFn
	 */

	// regex to test if a path is "settable"
	// if not the prop binding is automatically one-way.
	var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]\])*$/

	function compileProps (el, attrs, propNames) {
	  var props = []
	  var i = propNames.length
	  var name, value, prop
	  while (i--) {
	    name = propNames[i]
	    if (/[A-Z]/.test(name)) {
	      _.warn(
	        'You seem to be using camelCase for a component prop, ' +
	        'but HTML doesn\'t differentiate between upper and ' +
	        'lower case. You should use hyphen-delimited ' +
	        'attribute names. For more info see ' +
	        'http://vuejs.org/api/options.html#props'
	      )
	    }
	    value = attrs[name]
	    /* jshint eqeqeq:false */
	    if (value != null) {
	      prop = {
	        name: name,
	        raw: value
	      }
	      var tokens = textParser.parse(value)
	      if (tokens) {
	        if (el && el.nodeType === 1) {
	          el.removeAttribute(name)
	        }
	        attrs[name] = null
	        prop.dynamic = true
	        prop.value = textParser.tokensToExp(tokens)
	        prop.oneTime =
	          tokens.length > 1 ||
	          tokens[0].oneTime ||
	          !settablePathRE.test(prop.value)
	      }
	      props.push(prop)
	    }
	  }
	  return makePropsLinkFn(props)
	}

	/**
	 * Build a function that applies props to a vm.
	 *
	 * @param {Array} props
	 * @return {Function} propsLinkFn
	 */

	var dataAttrRE = /^data-/

	function makePropsLinkFn (props) {
	  return function propsLinkFn (vm, el) {
	    var i = props.length
	    var prop, path
	    while (i--) {
	      prop = props[i]
	      // props could contain dashes, which will be
	      // interpreted as minus calculations by the parser
	      // so we need to wrap the path here
	      path = _.camelize(prop.name.replace(dataAttrRE, ''))
	      if (prop.dynamic) {
	        if (vm.$parent) {
	          vm._bindDir('prop', el, {
	            arg: path,
	            expression: prop.value,
	            oneWay: prop.oneTime
	          }, propDef)
	        } else {
	          _.warn(
	            'Cannot bind dynamic prop on a root instance' +
	            ' with no parent: ' + prop.name + '="' +
	            prop.raw + '"'
	          )
	        }
	      } else {
	        // just set once
	        vm.$set(path, prop.raw)
	      }
	    }
	  }
	}

	/**
	 * Check for element directives (custom elements that should
	 * be resovled as terminal directives).
	 *
	 * @param {Element} el
	 * @param {Object} options
	 */

	function checkElementDirectives (el, options) {
	  var tag = el.tagName.toLowerCase()
	  var def = resolveAsset(options, 'elementDirectives', tag)
	  if (def) {
	    return makeTerminalNodeLinkFn(el, tag, '', options, def)
	  }
	}

	/**
	 * Check if an element is a component. If yes, return
	 * a component link function.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function|undefined}
	 */

	function checkComponent (el, options) {
	  var componentId = _.checkComponent(el, options)
	  if (componentId) {
	    var componentLinkFn = function (vm, el, host) {
	      vm._bindDir('component', el, {
	        expression: componentId
	      }, componentDef, host)
	    }
	    componentLinkFn.terminal = true
	    return componentLinkFn
	  }
	}

	/**
	 * Check an element for terminal directives in fixed order.
	 * If it finds one, return a terminal link function.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Function} terminalLinkFn
	 */

	function checkTerminalDirectives (el, options) {
	  if (_.attr(el, 'pre') !== null) {
	    return skip
	  }
	  var value, dirName
	  /* jshint boss: true */
	  for (var i = 0, l = terminalDirectives.length; i < l; i++) {
	    dirName = terminalDirectives[i]
	    if ((value = _.attr(el, dirName)) !== null) {
	      return makeTerminalNodeLinkFn(el, dirName, value, options)
	    }
	  }
	}

	function skip () {}
	skip.terminal = true

	/**
	 * Build a node link function for a terminal directive.
	 * A terminal link function terminates the current
	 * compilation recursion and handles compilation of the
	 * subtree in the directive.
	 *
	 * @param {Element} el
	 * @param {String} dirName
	 * @param {String} value
	 * @param {Object} options
	 * @param {Object} [def]
	 * @return {Function} terminalLinkFn
	 */

	function makeTerminalNodeLinkFn (el, dirName, value, options, def) {
	  var descriptor = dirParser.parse(value)[0]
	  // no need to call resolveAsset since terminal directives
	  // are always internal
	  def = def || options.directives[dirName]
	  var fn = function terminalNodeLinkFn (vm, el, host) {
	    vm._bindDir(dirName, el, descriptor, def, host)
	  }
	  fn.terminal = true
	  return fn
	}

	/**
	 * Compile the directives on an element and return a linker.
	 *
	 * @param {Element|Object} elOrAttrs
	 *        - could be an object of already-extracted
	 *          container attributes.
	 * @param {Object} options
	 * @return {Function}
	 */

	function compileDirectives (elOrAttrs, options) {
	  var attrs = _.isPlainObject(elOrAttrs)
	    ? mapToList(elOrAttrs)
	    : elOrAttrs.attributes
	  var i = attrs.length
	  var dirs = []
	  var attr, name, value, dir, dirName, dirDef
	  while (i--) {
	    attr = attrs[i]
	    name = attr.name
	    value = attr.value
	    if (value === null) continue
	    if (name.indexOf(config.prefix) === 0) {
	      dirName = name.slice(config.prefix.length)
	      dirDef = resolveAsset(options, 'directives', dirName)
	      _.assertAsset(dirDef, 'directive', dirName)
	      if (dirDef) {
	        dirs.push({
	          name: dirName,
	          descriptors: dirParser.parse(value),
	          def: dirDef
	        })
	      }
	    } else if (config.interpolate) {
	      dir = collectAttrDirective(name, value, options)
	      if (dir) {
	        dirs.push(dir)
	      }
	    }
	  }
	  // sort by priority, LOW to HIGH
	  if (dirs.length) {
	    dirs.sort(directiveComparator)
	    return makeNodeLinkFn(dirs)
	  }
	}

	/**
	 * Convert a map (Object) of attributes to an Array.
	 *
	 * @param {Object} map
	 * @return {Array}
	 */

	function mapToList (map) {
	  var list = []
	  for (var key in map) {
	    list.push({
	      name: key,
	      value: map[key]
	    })
	  }
	  return list
	}

	/**
	 * Build a link function for all directives on a single node.
	 *
	 * @param {Array} directives
	 * @return {Function} directivesLinkFn
	 */

	function makeNodeLinkFn (directives) {
	  return function nodeLinkFn (vm, el, host) {
	    // reverse apply because it's sorted low to high
	    var i = directives.length
	    var dir, j, k
	    while (i--) {
	      dir = directives[i]
	      if (dir._link) {
	        // custom link fn
	        dir._link(vm, el)
	      } else {
	        k = dir.descriptors.length
	        for (j = 0; j < k; j++) {
	          vm._bindDir(dir.name, el,
	            dir.descriptors[j], dir.def, host)
	        }
	      }
	    }
	  }
	}

	/**
	 * Check an attribute for potential dynamic bindings,
	 * and return a directive object.
	 *
	 * @param {String} name
	 * @param {String} value
	 * @param {Object} options
	 * @return {Object}
	 */

	function collectAttrDirective (name, value, options) {
	  var tokens = textParser.parse(value)
	  if (tokens) {
	    var def = options.directives.attr
	    var i = tokens.length
	    var allOneTime = true
	    while (i--) {
	      var token = tokens[i]
	      if (token.tag && !token.oneTime) {
	        allOneTime = false
	      }
	    }
	    return {
	      def: def,
	      _link: allOneTime
	        ? function (vm, el) {
	            el.setAttribute(name, vm.$interpolate(value))
	          }
	        : function (vm, el) {
	            var value = textParser.tokensToExp(tokens, vm)
	            var desc = dirParser.parse(name + ':' + value)[0]
	            vm._bindDir('attr', el, desc, def)
	          }
	    }
	  }
	}

	/**
	 * Directive priority sort comparator
	 *
	 * @param {Object} a
	 * @param {Object} b
	 */

	function directiveComparator (a, b) {
	  a = a.def.priority || 0
	  b = b.def.priority || 0
	  return a > b ? 1 : -1
	}

	/**
	 * Check whether an element is transcluded
	 *
	 * @param {Element} el
	 * @return {Boolean}
	 */

	var transcludedFlagAttr = '__vue__transcluded'
	function checkTransclusion (el) {
	  if (el.nodeType === 1 && el.hasAttribute(transcludedFlagAttr)) {
	    el.removeAttribute(transcludedFlagAttr)
	    return true
	  }
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var Cache = __webpack_require__(19)
	var templateCache = new Cache(1000)
	var idSelectorCache = new Cache(1000)

	var map = {
	  _default : [0, '', ''],
	  legend   : [1, '<fieldset>', '</fieldset>'],
	  tr       : [2, '<table><tbody>', '</tbody></table>'],
	  col      : [
	    2,
	    '<table><tbody></tbody><colgroup>',
	    '</colgroup></table>'
	  ]
	}

	map.td =
	map.th = [
	  3,
	  '<table><tbody><tr>',
	  '</tr></tbody></table>'
	]

	map.option =
	map.optgroup = [
	  1,
	  '<select multiple="multiple">',
	  '</select>'
	]

	map.thead =
	map.tbody =
	map.colgroup =
	map.caption =
	map.tfoot = [1, '<table>', '</table>']

	map.g =
	map.defs =
	map.symbol =
	map.use =
	map.image =
	map.text =
	map.circle =
	map.ellipse =
	map.line =
	map.path =
	map.polygon =
	map.polyline =
	map.rect = [
	  1,
	  '<svg ' +
	    'xmlns="http://www.w3.org/2000/svg" ' +
	    'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
	    'xmlns:ev="http://www.w3.org/2001/xml-events"' +
	    'version="1.1">',
	  '</svg>'
	]

	var tagRE = /<([\w:]+)/
	var entityRE = /&\w+;/

	/**
	 * Convert a string template to a DocumentFragment.
	 * Determines correct wrapping by tag types. Wrapping
	 * strategy found in jQuery & component/domify.
	 *
	 * @param {String} templateString
	 * @return {DocumentFragment}
	 */

	function stringToFragment (templateString) {
	  // try a cache hit first
	  var hit = templateCache.get(templateString)
	  if (hit) {
	    return hit
	  }

	  var frag = document.createDocumentFragment()
	  var tagMatch = templateString.match(tagRE)
	  var entityMatch = entityRE.test(templateString)

	  if (!tagMatch && !entityMatch) {
	    // text only, return a single text node.
	    frag.appendChild(
	      document.createTextNode(templateString)
	    )
	  } else {

	    var tag    = tagMatch && tagMatch[1]
	    var wrap   = map[tag] || map._default
	    var depth  = wrap[0]
	    var prefix = wrap[1]
	    var suffix = wrap[2]
	    var node   = document.createElement('div')

	    node.innerHTML = prefix + templateString.trim() + suffix
	    while (depth--) {
	      node = node.lastChild
	    }

	    var child
	    /* jshint boss:true */
	    while (child = node.firstChild) {
	      frag.appendChild(child)
	    }
	  }

	  templateCache.put(templateString, frag)
	  return frag
	}

	/**
	 * Convert a template node to a DocumentFragment.
	 *
	 * @param {Node} node
	 * @return {DocumentFragment}
	 */

	function nodeToFragment (node) {
	  var tag = node.tagName
	  // if its a template tag and the browser supports it,
	  // its content is already a document fragment.
	  if (
	    tag === 'TEMPLATE' &&
	    node.content instanceof DocumentFragment
	  ) {
	    return node.content
	  }
	  // script template
	  if (tag === 'SCRIPT') {
	    return stringToFragment(node.textContent)
	  }
	  // normal node, clone it to avoid mutating the original
	  var clone = exports.clone(node)
	  var frag = document.createDocumentFragment()
	  var child
	  /* jshint boss:true */
	  while (child = clone.firstChild) {
	    frag.appendChild(child)
	  }
	  return frag
	}

	// Test for the presence of the Safari template cloning bug
	// https://bugs.webkit.org/show_bug.cgi?id=137755
	var hasBrokenTemplate = _.inBrowser
	  ? (function () {
	      var a = document.createElement('div')
	      a.innerHTML = '<template>1</template>'
	      return !a.cloneNode(true).firstChild.innerHTML
	    })()
	  : false

	// Test for IE10/11 textarea placeholder clone bug
	var hasTextareaCloneBug = _.inBrowser
	  ? (function () {
	      var t = document.createElement('textarea')
	      t.placeholder = 't'
	      return t.cloneNode(true).value === 't'
	    })()
	  : false

	/**
	 * 1. Deal with Safari cloning nested <template> bug by
	 *    manually cloning all template instances.
	 * 2. Deal with IE10/11 textarea placeholder bug by setting
	 *    the correct value after cloning.
	 *
	 * @param {Element|DocumentFragment} node
	 * @return {Element|DocumentFragment}
	 */

	exports.clone = function (node) {
	  var res = node.cloneNode(true)
	  var i, original, cloned
	  /* istanbul ignore if */
	  if (hasBrokenTemplate) {
	    original = node.querySelectorAll('template')
	    if (original.length) {
	      cloned = res.querySelectorAll('template')
	      i = cloned.length
	      while (i--) {
	        cloned[i].parentNode.replaceChild(
	          original[i].cloneNode(true),
	          cloned[i]
	        )
	      }
	    }
	  }
	  /* istanbul ignore if */
	  if (hasTextareaCloneBug) {
	    if (node.tagName === 'TEXTAREA') {
	      res.value = node.value
	    } else {
	      original = node.querySelectorAll('textarea')
	      if (original.length) {
	        cloned = res.querySelectorAll('textarea')
	        i = cloned.length
	        while (i--) {
	          cloned[i].value = original[i].value
	        }
	      }
	    }
	  }
	  return res
	}

	/**
	 * Process the template option and normalizes it into a
	 * a DocumentFragment that can be used as a partial or a
	 * instance template.
	 *
	 * @param {*} template
	 *    Possible values include:
	 *    - DocumentFragment object
	 *    - Node object of type Template
	 *    - id selector: '#some-template-id'
	 *    - template string: '<div><span>{{msg}}</span></div>'
	 * @param {Boolean} clone
	 * @param {Boolean} noSelector
	 * @return {DocumentFragment|undefined}
	 */

	exports.parse = function (template, clone, noSelector) {
	  var node, frag

	  // if the template is already a document fragment,
	  // do nothing
	  if (template instanceof DocumentFragment) {
	    return clone
	      ? template.cloneNode(true)
	      : template
	  }

	  if (typeof template === 'string') {
	    // id selector
	    if (!noSelector && template.charAt(0) === '#') {
	      // id selector can be cached too
	      frag = idSelectorCache.get(template)
	      if (!frag) {
	        node = document.getElementById(template.slice(1))
	        if (node) {
	          frag = nodeToFragment(node)
	          // save selector to cache
	          idSelectorCache.put(template, frag)
	        }
	      }
	    } else {
	      // normal string template
	      frag = stringToFragment(template)
	    }
	  } else if (template.nodeType) {
	    // a direct node
	    frag = nodeToFragment(template)
	  }

	  return frag && clone
	    ? exports.clone(frag)
	    : frag
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var Watcher = __webpack_require__(12)
	var identRE = __webpack_require__(18).identRE

	module.exports = {

	  bind: function () {

	    var child = this.vm
	    var parent = child.$parent
	    var childKey = this.arg
	    var parentKey = this.expression

	    if (!identRE.test(childKey)) {
	      _.warn(
	        'Invalid prop key: "' + childKey + '". Prop keys ' +
	        'must be valid identifiers.'
	      )
	    }

	    // simple lock to avoid circular updates.
	    // without this it would stabilize too, but this makes
	    // sure it doesn't cause other watchers to re-evaluate.
	    var locked = false
	    var lock = function () {
	      locked = true
	      _.nextTick(unlock)
	    }
	    var unlock = function () {
	      locked = false
	    }

	    this.parentWatcher = new Watcher(
	      parent,
	      parentKey,
	      function (val) {
	        if (!locked) {
	          lock()
	          // all props have been initialized already
	          child[childKey] = val
	        }
	      }
	    )
	    
	    // set the child initial value first, before setting
	    // up the child watcher to avoid triggering it
	    // immediately.
	    child.$set(childKey, this.parentWatcher.value)

	    // only setup two-way binding if this is not a one-way
	    // binding.
	    if (!this._descriptor.oneWay) {
	      this.childWatcher = new Watcher(
	        child,
	        childKey,
	        function (val) {
	          if (!locked) {
	            lock()
	            parent.$set(parentKey, val)
	          }
	        }
	      )
	    }
	  },

	  unbind: function () {
	    if (this.parentWatcher) {
	      this.parentWatcher.teardown()
	    }
	    if (this.childWatcher) {
	      this.childWatcher.teardown()
	    }
	  }

	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var templateParser = __webpack_require__(24)

	module.exports = {

	  isLiteral: true,

	  /**
	   * Setup. Two possible usages:
	   *
	   * - static:
	   *   v-component="comp"
	   *
	   * - dynamic:
	   *   v-component="{{currentView}}"
	   */

	  bind: function () {
	    if (!this.el.__vue__) {
	      // create a ref anchor
	      this.anchor = _.createAnchor('v-component')
	      _.replace(this.el, this.anchor)
	      // check keep-alive options.
	      // If yes, instead of destroying the active vm when
	      // hiding (v-if) or switching (dynamic literal) it,
	      // we simply remove it from the DOM and save it in a
	      // cache object, with its constructor id as the key.
	      this.keepAlive = this._checkParam('keep-alive') != null
	      // check ref
	      this.refID = _.attr(this.el, 'ref')
	      if (this.keepAlive) {
	        this.cache = {}
	      }
	      // check inline-template
	      if (this._checkParam('inline-template') !== null) {
	        // extract inline template as a DocumentFragment
	        this.template = _.extractContent(this.el, true)
	      }
	      // component resolution related state
	      this._pendingCb =
	      this.ctorId =
	      this.Ctor = null
	      // if static, build right now.
	      if (!this._isDynamicLiteral) {
	        this.resolveCtor(this.expression, _.bind(function () {
	          var child = this.build()
	          child.$before(this.anchor)
	          this.setCurrent(child)
	        }, this))
	      } else {
	        // check dynamic component params
	        this.readyEvent = this._checkParam('wait-for')
	        this.transMode = this._checkParam('transition-mode')
	      }
	    } else {
	      _.warn(
	        'v-component="' + this.expression + '" cannot be ' +
	        'used on an already mounted instance.'
	      )
	    }
	  },

	  /**
	   * Public update, called by the watcher in the dynamic
	   * literal scenario, e.g. v-component="{{view}}"
	   */

	  update: function (value) {
	    this.realUpdate(value)
	  },

	  /**
	   * Switch dynamic components. May resolve the component
	   * asynchronously, and perform transition based on
	   * specified transition mode. Accepts an async callback
	   * which is called when the transition ends. (This is
	   * exposed for vue-router)
	   *
	   * @param {String} value
	   * @param {Function} [cb]
	   */

	  realUpdate: function (value, cb) {
	    this.invalidatePending()
	    if (!value) {
	      // just remove current
	      this.unbuild()
	      this.remove(this.childVM, cb)
	      this.unsetCurrent()
	    } else {
	      this.resolveCtor(value, _.bind(function () {
	        this.unbuild()
	        var newComponent = this.build()
	        var self = this
	        if (this.readyEvent) {
	          newComponent.$once(this.readyEvent, function () {
	            self.swapTo(newComponent, cb)
	          })
	        } else {
	          this.swapTo(newComponent, cb)
	        }
	      }, this))
	    }
	  },

	  /**
	   * Resolve the component constructor to use when creating
	   * the child vm.
	   */

	  resolveCtor: function (id, cb) {
	    var self = this
	    this._pendingCb = _.cancellable(function (ctor) {
	      self.ctorId = id
	      self.Ctor = ctor
	      cb()
	    })
	    this.vm._resolveComponent(id, this._pendingCb)
	  },

	  /**
	   * When the component changes or unbinds before an async
	   * constructor is resolved, we need to invalidate its
	   * pending callback.
	   */

	  invalidatePending: function () {
	    if (this._pendingCb) {
	      this._pendingCb.cancel()
	      this._pendingCb = null
	    }
	  },

	  /**
	   * Instantiate/insert a new child vm.
	   * If keep alive and has cached instance, insert that
	   * instance; otherwise build a new one and cache it.
	   *
	   * @return {Vue} - the created instance
	   */

	  build: function () {
	    if (this.keepAlive) {
	      var cached = this.cache[this.ctorId]
	      if (cached) {
	        return cached
	      }
	    }
	    var vm = this.vm
	    var el = templateParser.clone(this.el)
	    if (this.Ctor) {
	      var child = vm.$addChild({
	        el: el,
	        template: this.template,
	        _asComponent: true,
	        _host: this._host
	      }, this.Ctor)
	      if (this.keepAlive) {
	        this.cache[this.ctorId] = child
	      }
	      return child
	    }
	  },

	  /**
	   * Teardown the current child, but defers cleanup so
	   * that we can separate the destroy and removal steps.
	   */

	  unbuild: function () {
	    var child = this.childVM
	    if (!child || this.keepAlive) {
	      return
	    }
	    // the sole purpose of `deferCleanup` is so that we can
	    // "deactivate" the vm right now and perform DOM removal
	    // later.
	    child.$destroy(false, true)
	  },

	  /**
	   * Remove current destroyed child and manually do
	   * the cleanup after removal.
	   *
	   * @param {Function} cb
	   */

	  remove: function (child, cb) {
	    var keepAlive = this.keepAlive
	    if (child) {
	      child.$remove(function () {
	        if (!keepAlive) child._cleanup()
	        if (cb) cb()
	      })
	    } else if (cb) {
	      cb()
	    }
	  },

	  /**
	   * Actually swap the components, depending on the
	   * transition mode. Defaults to simultaneous.
	   *
	   * @param {Vue} target
	   * @param {Function} [cb]
	   */

	  swapTo: function (target, cb) {
	    var self = this
	    var current = this.childVM
	    this.unsetCurrent()
	    this.setCurrent(target)
	    switch (self.transMode) {
	      case 'in-out':
	        target.$before(self.anchor, function () {
	          self.remove(current, cb)
	        })
	        break
	      case 'out-in':
	        self.remove(current, function () {
	          target.$before(self.anchor, cb)
	        })
	        break
	      default:
	        self.remove(current)
	        target.$before(self.anchor, cb)
	    }
	  },

	  /**
	   * Set childVM and parent ref
	   */
	  
	  setCurrent: function (child) {
	    this.childVM = child
	    var refID = child._refID || this.refID
	    if (refID) {
	      this.vm.$[refID] = child
	    }
	  },

	  /**
	   * Unset childVM and parent ref
	   */

	  unsetCurrent: function () {
	    var child = this.childVM
	    this.childVM = null
	    var refID = (child && child._refID) || this.refID
	    if (refID) {
	      this.vm.$[refID] = null
	    }
	  },

	  /**
	   * Unbind.
	   */

	  unbind: function () {
	    this.invalidatePending()
	    this.unbuild()
	    // destroy all keep-alive cached instances
	    if (this.cache) {
	      for (var key in this.cache) {
	        this.cache[key].$destroy()
	      }
	      this.cache = null
	    }
	  }

	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var config = __webpack_require__(5)
	var templateParser = __webpack_require__(24)
	var transcludedFlagAttr = '__vue__transcluded'

	/**
	 * Process an element or a DocumentFragment based on a
	 * instance option object. This allows us to transclude
	 * a template node/fragment before the instance is created,
	 * so the processed fragment can then be cloned and reused
	 * in v-repeat.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Element|DocumentFragment}
	 */

	module.exports = function transclude (el, options) {
	  // extract container attributes to pass them down
	  // to compiler, because they need to be compiled in
	  // parent scope. we are mutating the options object here
	  // assuming the same object will be used for compile
	  // right after this.
	  if (options) {
	    options._containerAttrs = extractAttrs(el)
	  }
	  // Mark content nodes and attrs so that the compiler
	  // knows they should be compiled in parent scope.
	  if (options && options._asComponent) {
	    var i = el.childNodes.length
	    while (i--) {
	      var node = el.childNodes[i]
	      if (node.nodeType === 1) {
	        node.setAttribute(transcludedFlagAttr, '')
	      } else if (node.nodeType === 3 && node.data.trim()) {
	        // wrap transcluded textNodes in spans, because
	        // raw textNodes can't be persisted through clones
	        // by attaching attributes.
	        var wrapper = document.createElement('span')
	        wrapper.textContent = node.data
	        wrapper.setAttribute('__vue__wrap', '')
	        wrapper.setAttribute(transcludedFlagAttr, '')
	        el.replaceChild(wrapper, node)
	      }
	    }
	  }
	  // for template tags, what we want is its content as
	  // a documentFragment (for block instances)
	  if (el.tagName === 'TEMPLATE') {
	    el = templateParser.parse(el)
	  }
	  if (options && options.template) {
	    el = transcludeTemplate(el, options)
	  }
	  if (el instanceof DocumentFragment) {
	    // anchors for block instance
	    // passing in `persist: true` to avoid them being
	    // discarded by IE during template cloning
	    _.prepend(_.createAnchor('v-start', true), el)
	    el.appendChild(_.createAnchor('v-end', true))
	  }
	  return el
	}

	/**
	 * Process the template option.
	 * If the replace option is true this will swap the $el.
	 *
	 * @param {Element} el
	 * @param {Object} options
	 * @return {Element|DocumentFragment}
	 */

	function transcludeTemplate (el, options) {
	  var template = options.template
	  var frag = templateParser.parse(template, true)
	  if (!frag) {
	    _.warn('Invalid template option: ' + template)
	  } else {
	    var rawContent = options._content || _.extractContent(el)
	    var replacer = frag.firstChild
	    if (options.replace) {
	      if (
	        frag.childNodes.length > 1 ||
	        replacer.nodeType !== 1 ||
	        // when root node has v-repeat, the instance ends up
	        // having multiple top-level nodes, thus becoming a
	        // block instance. (#835)
	        replacer.hasAttribute(config.prefix + 'repeat')
	      ) {
	        transcludeContent(frag, rawContent)
	        return frag
	      } else {
	        options._replacerAttrs = extractAttrs(replacer)
	        mergeAttrs(el, replacer)
	        transcludeContent(replacer, rawContent)
	        return replacer
	      }
	    } else {
	      el.appendChild(frag)
	      transcludeContent(el, rawContent)
	      return el
	    }
	  }
	}

	/**
	 * Resolve <content> insertion points mimicking the behavior
	 * of the Shadow DOM spec:
	 *
	 *   http://w3c.github.io/webcomponents/spec/shadow/#insertion-points
	 *
	 * @param {Element|DocumentFragment} el
	 * @param {Element} raw
	 */

	function transcludeContent (el, raw) {
	  var outlets = getOutlets(el)
	  var i = outlets.length
	  if (!i) return
	  var outlet, select, selected, j, main

	  function isDirectChild (node) {
	    return node.parentNode === raw
	  }

	  // first pass, collect corresponding content
	  // for each outlet.
	  while (i--) {
	    outlet = outlets[i]
	    if (raw) {
	      select = outlet.getAttribute('select')
	      if (select) {  // select content
	        selected = raw.querySelectorAll(select)
	        if (selected.length) {
	          // according to Shadow DOM spec, `select` can
	          // only select direct children of the host node.
	          // enforcing this also fixes #786.
	          selected = [].filter.call(selected, isDirectChild)
	        }
	        outlet.content = selected.length
	          ? selected
	          : _.toArray(outlet.childNodes)
	      } else { // default content
	        main = outlet
	      }
	    } else { // fallback content
	      outlet.content = _.toArray(outlet.childNodes)
	    }
	  }
	  // second pass, actually insert the contents
	  for (i = 0, j = outlets.length; i < j; i++) {
	    outlet = outlets[i]
	    if (outlet !== main) {
	      insertContentAt(outlet, outlet.content)
	    }
	  }
	  // finally insert the main content
	  if (main) {
	    insertContentAt(main, _.toArray(raw.childNodes))
	  }
	}

	/**
	 * Get <content> outlets from the element/list
	 *
	 * @param {Element|Array} el
	 * @return {Array}
	 */

	var concat = [].concat
	function getOutlets (el) {
	  return _.isArray(el)
	    ? concat.apply([], el.map(getOutlets))
	    : el.querySelectorAll
	      ? _.toArray(el.querySelectorAll('content'))
	      : []
	}

	/**
	 * Insert an array of nodes at outlet,
	 * then remove the outlet.
	 *
	 * @param {Element} outlet
	 * @param {Array} contents
	 */

	function insertContentAt (outlet, contents) {
	  // not using util DOM methods here because
	  // parentNode can be cached
	  var parent = outlet.parentNode
	  for (var i = 0, j = contents.length; i < j; i++) {
	    parent.insertBefore(contents[i], outlet)
	  }
	  parent.removeChild(outlet)
	}

	/**
	 * Helper to extract a component container's attribute names
	 * into a map. The resulting map will be used in compiler to
	 * determine whether an attribute is transcluded.
	 *
	 * @param {Element} el
	 * @return {Object}
	 */

	function extractAttrs (el) {
	  if (el.nodeType === 1 && el.hasAttributes()) {
	    var attrs = el.attributes
	    var res = {}
	    var i = attrs.length
	    while (i--) {
	      res[attrs[i].name] = attrs[i].value
	    }
	    return res
	  }
	}

	/**
	 * Merge the attributes of two elements, and make sure
	 * the class names are merged properly.
	 *
	 * @param {Element} from
	 * @param {Element} to
	 */

	function mergeAttrs (from, to) {
	  var attrs = from.attributes
	  var i = attrs.length
	  var name, value
	  while (i--) {
	    name = attrs[i].name
	    value = attrs[i].value
	    if (!to.hasAttribute(name)) {
	      to.setAttribute(name, value)
	    } else if (name === 'class') {
	      to.className = to.className + ' ' + value
	    }
	  }
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var config = __webpack_require__(5)

	/**
	 * Expose useful internals
	 */

	exports.util = _
	exports.nextTick = _.nextTick
	exports.config = __webpack_require__(5)

	exports.compiler = {
	  compile: __webpack_require__(23),
	  transclude: __webpack_require__(27)
	}

	exports.parsers = {
	  path: __webpack_require__(18),
	  text: __webpack_require__(21),
	  template: __webpack_require__(24),
	  directive: __webpack_require__(22),
	  expression: __webpack_require__(17)
	}

	/**
	 * Each instance constructor, including Vue, has a unique
	 * cid. This enables us to create wrapped "child
	 * constructors" for prototypal inheritance and cache them.
	 */

	exports.cid = 0
	var cid = 1

	/**
	 * Class inehritance
	 *
	 * @param {Object} extendOptions
	 */

	exports.extend = function (extendOptions) {
	  extendOptions = extendOptions || {}
	  var Super = this
	  var Sub = createClass(
	    extendOptions.name ||
	    Super.options.name ||
	    'VueComponent'
	  )
	  Sub.prototype = Object.create(Super.prototype)
	  Sub.prototype.constructor = Sub
	  Sub.cid = cid++
	  Sub.options = _.mergeOptions(
	    Super.options,
	    extendOptions
	  )
	  Sub['super'] = Super
	  // allow further extension
	  Sub.extend = Super.extend
	  // create asset registers, so extended classes
	  // can have their private assets too.
	  createAssetRegisters(Sub)
	  return Sub
	}

	/**
	 * A function that returns a sub-class constructor with the
	 * given name. This gives us much nicer output when
	 * logging instances in the console.
	 *
	 * @param {String} name
	 * @return {Function}
	 */

	function createClass (name) {
	  return new Function(
	    'return function ' + _.classify(name) +
	    ' (options) { this._init(options) }'
	  )()
	}

	/**
	 * Plugin system
	 *
	 * @param {Object} plugin
	 */

	exports.use = function (plugin) {
	  // additional parameters
	  var args = _.toArray(arguments, 1)
	  args.unshift(this)
	  if (typeof plugin.install === 'function') {
	    plugin.install.apply(plugin, args)
	  } else {
	    plugin.apply(null, args)
	  }
	  return this
	}

	/**
	 * Define asset registration methods on a constructor.
	 *
	 * @param {Function} Constructor
	 */

	function createAssetRegisters (Constructor) {

	  /* Asset registration methods share the same signature:
	   *
	   * @param {String} id
	   * @param {*} definition
	   */

	  config._assetTypes.forEach(function (type) {
	    Constructor[type] = function (id, definition) {
	      if (!definition) {
	        return this.options[type + 's'][id]
	      } else {
	        this.options[type + 's'][id] = definition
	      }
	    }
	  })

	  /**
	   * Component registration needs to automatically invoke
	   * Vue.extend on object values.
	   *
	   * @param {String} id
	   * @param {Object|Function} definition
	   */

	  Constructor.component = function (id, definition) {
	    if (!definition) {
	      return this.options.components[id]
	    } else {
	      if (_.isPlainObject(definition)) {
	        definition.name = id
	        definition = _.Vue.extend(definition)
	      }
	      this.options.components[id] = definition
	    }
	  }
	}

	createAssetRegisters(exports)

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// manipulation directives
	exports.text       = __webpack_require__(30)
	exports.html       = __webpack_require__(31)
	exports.attr       = __webpack_require__(32)
	exports.show       = __webpack_require__(33)
	exports['class']   = __webpack_require__(35)
	exports.el         = __webpack_require__(36)
	exports.ref        = __webpack_require__(37)
	exports.cloak      = __webpack_require__(38)
	exports.style      = __webpack_require__(39)
	exports.transition = __webpack_require__(40)

	// event listener directives
	exports.on         = __webpack_require__(43)
	exports.model      = __webpack_require__(44)

	// logic control directives
	exports.repeat     = __webpack_require__(49)
	exports['if']      = __webpack_require__(50)

	// child vm communication directives
	exports.events     = __webpack_require__(51)

	// internal directives that should not be used directly
	// but we still want to expose them for advanced usage.
	exports._component = __webpack_require__(26)
	exports._prop      = __webpack_require__(25)

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	module.exports = {

	  bind: function () {
	    this.attr = this.el.nodeType === 3
	      ? 'nodeValue'
	      : 'textContent'
	  },

	  update: function (value) {
	    this.el[this.attr] = _.toString(value)
	  }
	  
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var templateParser = __webpack_require__(24)

	module.exports = {

	  bind: function () {
	    // a comment node means this is a binding for
	    // {{{ inline unescaped html }}}
	    if (this.el.nodeType === 8) {
	      // hold nodes
	      this.nodes = []
	      // replace the placeholder with proper anchor
	      this.anchor = _.createAnchor('v-html')
	      _.replace(this.el, this.anchor)
	    }
	  },

	  update: function (value) {
	    value = _.toString(value)
	    if (this.nodes) {
	      this.swap(value)
	    } else {
	      this.el.innerHTML = value
	    }
	  },

	  swap: function (value) {
	    // remove old nodes
	    var i = this.nodes.length
	    while (i--) {
	      _.remove(this.nodes[i])
	    }
	    // convert new value to a fragment
	    // do not attempt to retrieve from id selector
	    var frag = templateParser.parse(value, true, true)
	    // save a reference to these nodes so we can remove later
	    this.nodes = _.toArray(frag.childNodes)
	    _.before(frag, this.anchor)
	  }

	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// xlink
	var xlinkNS = 'http://www.w3.org/1999/xlink'
	var xlinkRE = /^xlink:/

	module.exports = {

	  priority: 850,

	  bind: function () {
	    var name = this.arg
	    this.update = xlinkRE.test(name)
	      ? xlinkHandler
	      : defaultHandler
	  }

	}

	function defaultHandler (value) {
	  if (value || value === 0) {
	    this.el.setAttribute(this.arg, value)
	  } else {
	    this.el.removeAttribute(this.arg)
	  }
	}

	function xlinkHandler (value) {
	  if (value != null) {
	    this.el.setAttributeNS(xlinkNS, this.arg, value)
	  } else {
	    this.el.removeAttributeNS(xlinkNS, 'href')
	  }
	}

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var transition = __webpack_require__(34)

	module.exports = function (value) {
	  var el = this.el
	  transition.apply(el, value ? 1 : -1, function () {
	    el.style.display = value ? '' : 'none'
	  }, this.vm)
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	/**
	 * Append with transition.
	 *
	 * @oaram {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */

	exports.append = function (el, target, vm, cb) {
	  apply(el, 1, function () {
	    target.appendChild(el)
	  }, vm, cb)
	}

	/**
	 * InsertBefore with transition.
	 *
	 * @oaram {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */

	exports.before = function (el, target, vm, cb) {
	  apply(el, 1, function () {
	    _.before(el, target)
	  }, vm, cb)
	}

	/**
	 * Remove with transition.
	 *
	 * @oaram {Element} el
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */

	exports.remove = function (el, vm, cb) {
	  apply(el, -1, function () {
	    _.remove(el)
	  }, vm, cb)
	}

	/**
	 * Remove by appending to another parent with transition.
	 * This is only used in block operations.
	 *
	 * @oaram {Element} el
	 * @param {Element} target
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */

	exports.removeThenAppend = function (el, target, vm, cb) {
	  apply(el, -1, function () {
	    target.appendChild(el)
	  }, vm, cb)
	}

	/**
	 * Append the childNodes of a fragment to target.
	 *
	 * @param {DocumentFragment} block
	 * @param {Node} target
	 * @param {Vue} vm
	 */

	exports.blockAppend = function (block, target, vm) {
	  var nodes = _.toArray(block.childNodes)
	  for (var i = 0, l = nodes.length; i < l; i++) {
	    exports.before(nodes[i], target, vm)
	  }
	}

	/**
	 * Remove a block of nodes between two edge nodes.
	 *
	 * @param {Node} start
	 * @param {Node} end
	 * @param {Vue} vm
	 */

	exports.blockRemove = function (start, end, vm) {
	  var node = start.nextSibling
	  var next
	  while (node !== end) {
	    next = node.nextSibling
	    exports.remove(node, vm)
	    node = next
	  }
	}

	/**
	 * Apply transitions with an operation callback.
	 *
	 * @oaram {Element} el
	 * @param {Number} direction
	 *                  1: enter
	 *                 -1: leave
	 * @param {Function} op - the actual DOM operation
	 * @param {Vue} vm
	 * @param {Function} [cb]
	 */

	var apply = exports.apply = function (el, direction, op, vm, cb) {
	  var transition = el.__v_trans
	  if (
	    !transition ||
	    // skip if there are no js hooks and CSS transition is
	    // not supported
	    (!transition.hooks && !_.transitionEndEvent) ||
	    // skip transitions for initial compile
	    !vm._isCompiled ||
	    // if the vm is being manipulated by a parent directive
	    // during the parent's compilation phase, skip the
	    // animation.
	    (vm.$parent && !vm.$parent._isCompiled)
	  ) {
	    op()
	    if (cb) cb()
	    return
	  }
	  var action = direction > 0 ? 'enter' : 'leave'
	  transition[action](op, cb)
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var addClass = _.addClass
	var removeClass = _.removeClass

	module.exports = function (value) {
	  if (this.arg) {
	    var method = value ? addClass : removeClass
	    method(this.el, this.arg)
	  } else {
	    if (this.lastVal) {
	      removeClass(this.el, this.lastVal)
	    }
	    if (value) {
	      addClass(this.el, value)
	      this.lastVal = value
	    }
	  }
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {

	  isLiteral: true,

	  bind: function () {
	    this.vm.$$[this.expression] = this.el
	  },

	  unbind: function () {
	    delete this.vm.$$[this.expression]
	  }
	  
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	module.exports = {

	  isLiteral: true,

	  bind: function () {
	    var vm = this.el.__vue__
	    if (!vm) {
	      _.warn(
	        'v-ref should only be used on a component root element.'
	      )
	      return
	    }
	    // If we get here, it means this is a `v-ref` on a
	    // child, because parent scope `v-ref` is stripped in
	    // `v-component` already. So we just record our own ref
	    // here - it will overwrite parent ref in `v-component`,
	    // if any.
	    vm._refID = this.expression
	  }
	  
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(5)

	module.exports = {

	  bind: function () {
	    var el = this.el
	    this.vm.$once('hook:compiled', function () {
	      el.removeAttribute(config.prefix + 'cloak')
	    })
	  }

	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var prefixes = ['-webkit-', '-moz-', '-ms-']
	var camelPrefixes = ['Webkit', 'Moz', 'ms']
	var importantRE = /!important;?$/
	var camelRE = /([a-z])([A-Z])/g
	var testEl = null
	var propCache = {}

	module.exports = {

	  deep: true,

	  update: function (value) {
	    if (this.arg) {
	      this.setProp(this.arg, value)
	    } else {
	      if (typeof value === 'object') {
	        // cache object styles so that only changed props
	        // are actually updated.
	        if (!this.cache) this.cache = {}
	        for (var prop in value) {
	          this.setProp(prop, value[prop])
	          /* jshint eqeqeq: false */
	          if (value[prop] != this.cache[prop]) {
	            this.cache[prop] = value[prop]
	            this.setProp(prop, value[prop])
	          }
	        }
	      } else {
	        this.el.style.cssText = value
	      }
	    }
	  },

	  setProp: function (prop, value) {
	    prop = normalize(prop)
	    if (!prop) return // unsupported prop
	    // cast possible numbers/booleans into strings
	    if (value != null) value += ''
	    if (value) {
	      var isImportant = importantRE.test(value)
	        ? 'important'
	        : ''
	      if (isImportant) {
	        value = value.replace(importantRE, '').trim()
	      }
	      this.el.style.setProperty(prop, value, isImportant)
	    } else {
	      this.el.style.removeProperty(prop)
	    }
	  }

	}

	/**
	 * Normalize a CSS property name.
	 * - cache result
	 * - auto prefix
	 * - camelCase -> dash-case
	 *
	 * @param {String} prop
	 * @return {String}
	 */

	function normalize (prop) {
	  if (propCache[prop]) {
	    return propCache[prop]
	  }
	  var res = prefix(prop)
	  propCache[prop] = propCache[res] = res
	  return res
	}

	/**
	 * Auto detect the appropriate prefix for a CSS property.
	 * https://gist.github.com/paulirish/523692
	 *
	 * @param {String} prop
	 * @return {String}
	 */

	function prefix (prop) {
	  prop = prop.replace(camelRE, '$1-$2').toLowerCase()
	  var camel = _.camelize(prop)
	  var upper = camel.charAt(0).toUpperCase() + camel.slice(1)
	  if (!testEl) {
	    testEl = document.createElement('div')
	  }
	  if (camel in testEl.style) {
	    return prop
	  }
	  var i = prefixes.length
	  var prefixed
	  while (i--) {
	    prefixed = camelPrefixes[i] + upper
	    if (prefixed in testEl.style) {
	      return prefixes[i] + prop
	    }
	  }
	}

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var Transition = __webpack_require__(41)

	module.exports = {

	  priority: 1000,
	  isLiteral: true,

	  bind: function () {
	    if (!this._isDynamicLiteral) {
	      this.update(this.expression)
	    }
	  },

	  update: function (id, oldId) {
	    var el = this.el
	    var vm = this.el.__vue__ || this.vm
	    var hooks = _.resolveAsset(vm.$options, 'transitions', id)
	    id = id || 'v'
	    el.__v_trans = new Transition(el, id, hooks, vm)
	    if (oldId) {
	      _.removeClass(el, oldId + '-transition')
	    }
	    _.addClass(el, id + '-transition')
	  }

	}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var queue = __webpack_require__(42)
	var addClass = _.addClass
	var removeClass = _.removeClass
	var transitionEndEvent = _.transitionEndEvent
	var animationEndEvent = _.animationEndEvent
	var transDurationProp = _.transitionProp + 'Duration'
	var animDurationProp = _.animationProp + 'Duration'
	var doc = typeof document === 'undefined' ? null : document

	var TYPE_TRANSITION = 1
	var TYPE_ANIMATION = 2

	/**
	 * A Transition object that encapsulates the state and logic
	 * of the transition.
	 *
	 * @param {Element} el
	 * @param {String} id
	 * @param {Object} hooks
	 * @param {Vue} vm
	 */

	function Transition (el, id, hooks, vm) {
	  this.el = el
	  this.enterClass = id + '-enter'
	  this.leaveClass = id + '-leave'
	  this.hooks = hooks
	  this.vm = vm
	  // async state
	  this.pendingCssEvent =
	  this.pendingCssCb =
	  this.jsCancel =
	  this.pendingJsCb =
	  this.op =
	  this.cb = null
	  this.typeCache = {}
	  // bind
	  var self = this
	  ;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone']
	    .forEach(function (m) {
	      self[m] = _.bind(self[m], self)
	    })
	}

	var p = Transition.prototype

	/**
	 * Start an entering transition.
	 *
	 * 1. enter transition triggered
	 * 2. call beforeEnter hook
	 * 3. add enter class
	 * 4. insert/show element
	 * 5. call enter hook (with possible explicit js callback)
	 * 6. reflow
	 * 7. based on transition type:
	 *    - transition:
	 *        remove class now, wait for transitionend,
	 *        then done if there's no explicit js callback.
	 *    - animation:
	 *        wait for animationend, remove class,
	 *        then done if there's no explicit js callback.
	 *    - no css transition:
	 *        done now if there's no explicit js callback.
	 * 8. wait for either done or js callback, then call
	 *    afterEnter hook.
	 *
	 * @param {Function} op - insert/show the element
	 * @param {Function} [cb]
	 */

	p.enter = function (op, cb) {
	  this.cancelPending()
	  this.callHook('beforeEnter')
	  this.cb = cb
	  addClass(this.el, this.enterClass)
	  op()
	  this.callHookWithCb('enter')
	  queue.push(this.enterNextTick)
	}

	/**
	 * The "nextTick" phase of an entering transition, which is
	 * to be pushed into a queue and executed after a reflow so
	 * that removing the class can trigger a CSS transition.
	 */

	p.enterNextTick = function () {
	  var type = this.getCssTransitionType(this.enterClass)
	  var enterDone = this.enterDone
	  if (type === TYPE_TRANSITION) {
	    // trigger transition by removing enter class now
	    removeClass(this.el, this.enterClass)
	    this.setupCssCb(transitionEndEvent, enterDone)
	  } else if (type === TYPE_ANIMATION) {
	    this.setupCssCb(animationEndEvent, enterDone)
	  } else if (!this.pendingJsCb) {
	    enterDone()
	  }
	}

	/**
	 * The "cleanup" phase of an entering transition.
	 */

	p.enterDone = function () {
	  this.jsCancel = this.pendingJsCb = null
	  removeClass(this.el, this.enterClass)
	  this.callHook('afterEnter')
	  if (this.cb) this.cb()
	}

	/**
	 * Start a leaving transition.
	 *
	 * 1. leave transition triggered.
	 * 2. call beforeLeave hook
	 * 3. add leave class (trigger css transition)
	 * 4. call leave hook (with possible explicit js callback)
	 * 5. reflow if no explicit js callback is provided
	 * 6. based on transition type:
	 *    - transition or animation:
	 *        wait for end event, remove class, then done if
	 *        there's no explicit js callback.
	 *    - no css transition: 
	 *        done if there's no explicit js callback.
	 * 7. wait for either done or js callback, then call
	 *    afterLeave hook.
	 *
	 * @param {Function} op - remove/hide the element
	 * @param {Function} [cb]
	 */

	p.leave = function (op, cb) {
	  this.cancelPending()
	  this.callHook('beforeLeave')
	  this.op = op
	  this.cb = cb
	  addClass(this.el, this.leaveClass)
	  this.callHookWithCb('leave')
	  // only need to do leaveNextTick if there's no explicit
	  // js callback
	  if (!this.pendingJsCb) {
	    queue.push(this.leaveNextTick)
	  }
	}

	/**
	 * The "nextTick" phase of a leaving transition.
	 */

	p.leaveNextTick = function () {
	  var type = this.getCssTransitionType(this.leaveClass)
	  if (type) {
	    var event = type === TYPE_TRANSITION
	      ? transitionEndEvent
	      : animationEndEvent
	    this.setupCssCb(event, this.leaveDone)
	  } else {
	    this.leaveDone()
	  }
	}

	/**
	 * The "cleanup" phase of a leaving transition.
	 */

	p.leaveDone = function () {
	  this.op()
	  removeClass(this.el, this.leaveClass)
	  this.callHook('afterLeave')
	  if (this.cb) this.cb()
	}

	/**
	 * Cancel any pending callbacks from a previously running
	 * but not finished transition.
	 */

	p.cancelPending = function () {
	  this.op = this.cb = null
	  var hasPending = false
	  if (this.pendingCssCb) {
	    hasPending = true
	    _.off(this.el, this.pendingCssEvent, this.pendingCssCb)
	    this.pendingCssEvent = this.pendingCssCb = null
	  }
	  if (this.pendingJsCb) {
	    hasPending = true
	    this.pendingJsCb.cancel()
	    this.pendingJsCb = null
	  }
	  if (hasPending) {
	    removeClass(this.el, this.enterClass)
	    removeClass(this.el, this.leaveClass)
	  }
	  if (this.jsCancel) {
	    this.jsCancel.call(null)
	    this.jsCancel = null
	  }
	}

	/**
	 * Call a user-provided synchronous hook function.
	 *
	 * @param {String} type
	 */

	p.callHook = function (type) {
	  if (this.hooks && this.hooks[type]) {
	    this.hooks[type].call(this.vm, this.el)
	  }
	}

	/**
	 * Call a user-provided, potentially-async hook function.
	 * We check for the length of arguments to see if the hook
	 * expects a `done` callback. If true, the transition's end
	 * will be determined by when the user calls that callback;
	 * otherwise, the end is determined by the CSS transition or
	 * animation.
	 *
	 * @param {String} type
	 */

	p.callHookWithCb = function (type) {
	  var hook = this.hooks && this.hooks[type]
	  if (hook) {
	    if (hook.length > 1) {
	      this.pendingJsCb = _.cancellable(this[type + 'Done'])
	    }
	    this.jsCancel = hook.call(this.vm, this.el, this.pendingJsCb)
	  }
	}

	/**
	 * Get an element's transition type based on the
	 * calculated styles.
	 *
	 * @param {String} className
	 * @return {Number}
	 */

	p.getCssTransitionType = function (className) {
	  // skip CSS transitions if page is not visible -
	  // this solves the issue of transitionend events not
	  // firing until the page is visible again.
	  // pageVisibility API is supported in IE10+, same as
	  // CSS transitions.
	  /* istanbul ignore if */
	  if (!transitionEndEvent || (doc && doc.hidden)) {
	    return
	  }
	  var type = this.typeCache[className]
	  if (type) return type
	  var inlineStyles = this.el.style
	  var computedStyles = window.getComputedStyle(this.el)
	  var transDuration =
	    inlineStyles[transDurationProp] ||
	    computedStyles[transDurationProp]
	  if (transDuration && transDuration !== '0s') {
	    type = TYPE_TRANSITION
	  } else {
	    var animDuration =
	      inlineStyles[animDurationProp] ||
	      computedStyles[animDurationProp]
	    if (animDuration && animDuration !== '0s') {
	      type = TYPE_ANIMATION
	    }
	  }
	  if (type) {
	    this.typeCache[className] = type
	  }
	  return type
	}

	/**
	 * Setup a CSS transitionend/animationend callback.
	 *
	 * @param {String} event
	 * @param {Function} cb
	 */

	p.setupCssCb = function (event, cb) {
	  this.pendingCssEvent = event
	  var self = this
	  var el = this.el
	  var onEnd = this.pendingCssCb = function (e) {
	    if (e.target === el) {
	      _.off(el, event, onEnd)
	      self.pendingCssEvent = self.pendingCssCb = null
	      if (!self.pendingJsCb && cb) {
	        cb()
	      }
	    }
	  }
	  _.on(el, event, onEnd)
	}

	module.exports = Transition

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var queue = []
	var queued = false

	/**
	 * Push a job into the queue.
	 *
	 * @param {Function} job
	 */

	exports.push = function (job) {
	  queue.push(job)
	  if (!queued) {
	    queued = true
	    _.nextTick(flush)
	  }
	}

	/**
	 * Flush the queue, and do one forced reflow before
	 * triggering transitions.
	 */

	function flush () {
	  // Force layout
	  var f = document.documentElement.offsetHeight
	  for (var i = 0; i < queue.length; i++) {
	    queue[i]()
	  }
	  queue = []
	  queued = false
	  // dummy return, so js linters don't complain about
	  // unused variable f
	  return f
	}

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	module.exports = {

	  acceptStatement: true,
	  priority: 700,

	  bind: function () {
	    // deal with iframes
	    if (
	      this.el.tagName === 'IFRAME' &&
	      this.arg !== 'load'
	    ) {
	      var self = this
	      this.iframeBind = function () {
	        _.on(self.el.contentWindow, self.arg, self.handler)
	      }
	      _.on(this.el, 'load', this.iframeBind)
	    }
	  },

	  update: function (handler) {
	    if (typeof handler !== 'function') {
	      _.warn(
	        'Directive "v-on:' + this.expression + '" ' +
	        'expects a function value.'
	      )
	      return
	    }
	    this.reset()
	    var vm = this.vm
	    this.handler = function (e) {
	      e.targetVM = vm
	      vm.$event = e
	      var res = handler(e)
	      vm.$event = null
	      return res
	    }
	    if (this.iframeBind) {
	      this.iframeBind()
	    } else {
	      _.on(this.el, this.arg, this.handler)
	    }
	  },

	  reset: function () {
	    var el = this.iframeBind
	      ? this.el.contentWindow
	      : this.el
	    if (this.handler) {
	      _.off(el, this.arg, this.handler)
	    }
	  },

	  unbind: function () {
	    this.reset()
	    _.off(this.el, 'load', this.iframeBind)
	  }
	}

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	var handlers = {
	  text: __webpack_require__(45),
	  radio: __webpack_require__(46),
	  select: __webpack_require__(47),
	  checkbox: __webpack_require__(48)
	}

	module.exports = {

	  priority: 800,
	  twoWay: true,
	  handlers: handlers,

	  /**
	   * Possible elements:
	   *   <select>
	   *   <textarea>
	   *   <input type="*">
	   *     - text
	   *     - checkbox
	   *     - radio
	   *     - number
	   *     - TODO: more types may be supplied as a plugin
	   */

	  bind: function () {
	    // friendly warning...
	    this.checkFilters()
	    if (this.hasRead && !this.hasWrite) {
	      _.warn(
	        'It seems you are using a read-only filter with ' +
	        'v-model. You might want to use a two-way filter ' +
	        'to ensure correct behavior.'
	      )
	    }
	    var el = this.el
	    var tag = el.tagName
	    var handler
	    if (tag === 'INPUT') {
	      handler = handlers[el.type] || handlers.text
	    } else if (tag === 'SELECT') {
	      handler = handlers.select
	    } else if (tag === 'TEXTAREA') {
	      handler = handlers.text
	    } else {
	      _.warn('v-model does not support element type: ' + tag)
	      return
	    }
	    handler.bind.call(this)
	    this.update = handler.update
	    this.unbind = handler.unbind
	  },

	  /**
	   * Check read/write filter stats.
	   */

	  checkFilters: function () {
	    var filters = this.filters
	    if (!filters) return
	    var i = filters.length
	    while (i--) {
	      var filter = _.resolveAsset(this.vm.$options, 'filters', filters[i].name)
	      if (typeof filter === 'function' || filter.read) {
	        this.hasRead = true
	      } else if (filter.write) {
	        this.hasWrite = true
	      }
	    }
	  }

	}

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	module.exports = {

	  bind: function () {
	    var self = this
	    var el = this.el

	    // check params
	    // - lazy: update model on "change" instead of "input"
	    var lazy = this._checkParam('lazy') != null
	    // - number: cast value into number when updating model.
	    var number = this._checkParam('number') != null
	    // - debounce: debounce the input listener
	    var debounce = parseInt(this._checkParam('debounce'), 10)

	    // handle composition events.
	    //   http://blog.evanyou.me/2014/01/03/composition-event/
	    // skip this for Android because it handles composition
	    // events quite differently. Android doesn't trigger
	    // composition events for language input methods e.g.
	    // Chinese, but instead triggers them for spelling
	    // suggestions... (see Discussion/#162)
	    var composing = false
	    if (!_.isAndroid) {
	      this.onComposeStart = function () {
	        composing = true
	      }
	      this.onComposeEnd = function () {
	        composing = false
	        // in IE11 the "compositionend" event fires AFTER
	        // the "input" event, so the input handler is blocked
	        // at the end... have to call it here.
	        self.listener()
	      }
	      _.on(el,'compositionstart', this.onComposeStart)
	      _.on(el,'compositionend', this.onComposeEnd)
	    }

	    function syncToModel () {
	      var val = number
	        ? _.toNumber(el.value)
	        : el.value
	      self.set(val)
	    }

	    // if the directive has filters, we need to
	    // record cursor position and restore it after updating
	    // the input with the filtered value.
	    // also force update for type="range" inputs to enable
	    // "lock in range" (see #506)
	    if (this.hasRead || el.type === 'range') {
	      this.listener = function () {
	        if (composing) return
	        var charsOffset
	        // some HTML5 input types throw error here
	        try {
	          // record how many chars from the end of input
	          // the cursor was at
	          charsOffset = el.value.length - el.selectionStart
	        } catch (e) {}
	        // Fix IE10/11 infinite update cycle
	        // https://github.com/yyx990803/vue/issues/592
	        /* istanbul ignore if */
	        if (charsOffset < 0) {
	          return
	        }
	        syncToModel()
	        _.nextTick(function () {
	          // force a value update, because in
	          // certain cases the write filters output the
	          // same result for different input values, and
	          // the Observer set events won't be triggered.
	          var newVal = self._watcher.value
	          self.update(newVal)
	          if (charsOffset != null) {
	            var cursorPos =
	              _.toString(newVal).length - charsOffset
	            el.setSelectionRange(cursorPos, cursorPos)
	          }
	        })
	      }
	    } else {
	      this.listener = function () {
	        if (composing) return
	        syncToModel()
	      }
	    }

	    if (debounce) {
	      this.listener = _.debounce(this.listener, debounce)
	    }

	    // Now attach the main listener

	    this.event = lazy ? 'change' : 'input'
	    // Support jQuery events, since jQuery.trigger() doesn't
	    // trigger native events in some cases and some plugins
	    // rely on $.trigger()
	    // 
	    // We want to make sure if a listener is attached using
	    // jQuery, it is also removed with jQuery, that's why
	    // we do the check for each directive instance and
	    // store that check result on itself. This also allows
	    // easier test coverage control by unsetting the global
	    // jQuery variable in tests.
	    this.hasjQuery = typeof jQuery === 'function'
	    if (this.hasjQuery) {
	      jQuery(el).on(this.event, this.listener)
	    } else {
	      _.on(el, this.event, this.listener)
	    }

	    // IE9 doesn't fire input event on backspace/del/cut
	    if (!lazy && _.isIE9) {
	      this.onCut = function () {
	        _.nextTick(self.listener)
	      }
	      this.onDel = function (e) {
	        if (e.keyCode === 46 || e.keyCode === 8) {
	          self.listener()
	        }
	      }
	      _.on(el, 'cut', this.onCut)
	      _.on(el, 'keyup', this.onDel)
	    }

	    // set initial value if present
	    if (
	      el.hasAttribute('value') ||
	      (el.tagName === 'TEXTAREA' && el.value.trim())
	    ) {
	      this._initValue = number
	        ? _.toNumber(el.value)
	        : el.value
	    }
	  },

	  update: function (value) {
	    this.el.value = _.toString(value)
	  },

	  unbind: function () {
	    var el = this.el
	    if (this.hasjQuery) {
	      jQuery(el).off(this.event, this.listener)
	    } else {
	      _.off(el, this.event, this.listener)
	    }
	    if (this.onComposeStart) {
	      _.off(el, 'compositionstart', this.onComposeStart)
	      _.off(el, 'compositionend', this.onComposeEnd)
	    }
	    if (this.onCut) {
	      _.off(el,'cut', this.onCut)
	      _.off(el,'keyup', this.onDel)
	    }
	  }
	}

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	module.exports = {

	  bind: function () {
	    var self = this
	    var el = this.el
	    this.listener = function () {
	      self.set(el.value)
	    }
	    _.on(el, 'change', this.listener)
	    if (el.checked) {
	      this._initValue = el.value
	    }
	  },

	  update: function (value) {
	    /* jshint eqeqeq: false */
	    this.el.checked = value == this.el.value
	  },

	  unbind: function () {
	    _.off(this.el, 'change', this.listener)
	  }

	}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var Watcher = __webpack_require__(12)
	var dirParser = __webpack_require__(22)

	module.exports = {

	  bind: function () {
	    var self = this
	    var el = this.el
	    // check options param
	    var optionsParam = this._checkParam('options')
	    if (optionsParam) {
	      initOptions.call(this, optionsParam)
	    }
	    this.number = this._checkParam('number') != null
	    this.multiple = el.hasAttribute('multiple')
	    this.listener = function () {
	      var value = self.multiple
	        ? getMultiValue(el)
	        : el.value
	      value = self.number
	        ? _.isArray(value)
	          ? value.map(_.toNumber)
	          : _.toNumber(value)
	        : value
	      self.set(value)
	    }
	    _.on(el, 'change', this.listener)
	    checkInitialValue.call(this)
	  },

	  update: function (value) {
	    /* jshint eqeqeq: false */
	    var el = this.el
	    el.selectedIndex = -1
	    var multi = this.multiple && _.isArray(value)
	    var options = el.options
	    var i = options.length
	    var option
	    while (i--) {
	      option = options[i]
	      option.selected = multi
	        ? indexOf(value, option.value) > -1
	        : value == option.value
	    }
	  },

	  unbind: function () {
	    _.off(this.el, 'change', this.listener)
	    if (this.optionWatcher) {
	      this.optionWatcher.teardown()
	    }
	  }

	}

	/**
	 * Initialize the option list from the param.
	 *
	 * @param {String} expression
	 */

	function initOptions (expression) {
	  var self = this
	  var descriptor = dirParser.parse(expression)[0]
	  function optionUpdateWatcher (value) {
	    if (_.isArray(value)) {
	      self.el.innerHTML = ''
	      buildOptions(self.el, value)
	      if (self._watcher) {
	        self.update(self._watcher.value)
	      }
	    } else {
	      _.warn('Invalid options value for v-model: ' + value)
	    }
	  }
	  this.optionWatcher = new Watcher(
	    this.vm,
	    descriptor.expression,
	    optionUpdateWatcher,
	    {
	      deep: true,
	      filters: descriptor.filters
	    }
	  )
	  // update with initial value
	  optionUpdateWatcher(this.optionWatcher.value)
	}

	/**
	 * Build up option elements. IE9 doesn't create options
	 * when setting innerHTML on <select> elements, so we have
	 * to use DOM API here.
	 *
	 * @param {Element} parent - a <select> or an <optgroup>
	 * @param {Array} options
	 */

	function buildOptions (parent, options) {
	  var op, el
	  for (var i = 0, l = options.length; i < l; i++) {
	    op = options[i]
	    if (!op.options) {
	      el = document.createElement('option')
	      if (typeof op === 'string') {
	        el.text = el.value = op
	      } else {
	        /* jshint eqeqeq: false */
	        if (op.value != null) {
	          el.value = op.value
	        }
	        el.text = op.text || op.value || ''
	        if (op.disabled) {
	          el.disabled = true
	        }
	      }
	    } else {
	      el = document.createElement('optgroup')
	      el.label = op.label
	      buildOptions(el, op.options)
	    }
	    parent.appendChild(el)
	  }
	}

	/**
	 * Check the initial value for selected options.
	 */

	function checkInitialValue () {
	  var initValue
	  var options = this.el.options
	  for (var i = 0, l = options.length; i < l; i++) {
	    if (options[i].hasAttribute('selected')) {
	      if (this.multiple) {
	        (initValue || (initValue = []))
	          .push(options[i].value)
	      } else {
	        initValue = options[i].value
	      }
	    }
	  }
	  if (typeof initValue !== 'undefined') {
	    this._initValue = this.number
	      ? _.toNumber(initValue)
	      : initValue
	  }
	}

	/**
	 * Helper to extract a value array for select[multiple]
	 *
	 * @param {SelectElement} el
	 * @return {Array}
	 */

	function getMultiValue (el) {
	  return Array.prototype.filter
	    .call(el.options, filterSelected)
	    .map(getOptionValue)
	}

	function filterSelected (op) {
	  return op.selected
	}

	function getOptionValue (op) {
	  return op.value || op.text
	}

	/**
	 * Native Array.indexOf uses strict equal, but in this
	 * case we need to match string/numbers with soft equal.
	 *
	 * @param {Array} arr
	 * @param {*} val
	 */

	function indexOf (arr, val) {
	  /* jshint eqeqeq: false */
	  var i = arr.length
	  while (i--) {
	    if (arr[i] == val) return i
	  }
	  return -1
	}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	module.exports = {

	  bind: function () {
	    var self = this
	    var el = this.el
	    this.listener = function () {
	      self.set(el.checked)
	    }
	    _.on(el, 'change', this.listener)
	    if (el.checked) {
	      this._initValue = el.checked
	    }
	  },

	  update: function (value) {
	    this.el.checked = !!value
	  },

	  unbind: function () {
	    _.off(this.el, 'change', this.listener)
	  }

	}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var isObject = _.isObject
	var isPlainObject = _.isPlainObject
	var textParser = __webpack_require__(21)
	var expParser = __webpack_require__(17)
	var templateParser = __webpack_require__(24)
	var compile = __webpack_require__(23)
	var transclude = __webpack_require__(27)
	var uid = 0

	// async component resolution states
	var UNRESOLVED = 0
	var PENDING = 1
	var RESOLVED = 2
	var ABORTED = 3

	module.exports = {

	  /**
	   * Setup.
	   */

	  bind: function () {
	    // uid as a cache identifier
	    this.id = '__v_repeat_' + (++uid)
	    // setup anchor node
	    this.anchor = _.createAnchor('v-repeat')
	    _.replace(this.el, this.anchor)
	    // check if this is a block repeat
	    this.template = this.el.tagName === 'TEMPLATE'
	      ? templateParser.parse(this.el, true)
	      : this.el
	    // check other directives that need to be handled
	    // at v-repeat level
	    this.checkIf()
	    this.checkRef()
	    this.checkComponent()
	    // check for trackby param
	    this.idKey =
	      this._checkParam('track-by') ||
	      this._checkParam('trackby') // 0.11.0 compat
	    this.cache = Object.create(null)
	  },

	  /**
	   * Warn against v-if usage.
	   */

	  checkIf: function () {
	    if (_.attr(this.el, 'if') !== null) {
	      _.warn(
	        'Don\'t use v-if with v-repeat. ' +
	        'Use v-show or the "filterBy" filter instead.'
	      )
	    }
	  },

	  /**
	   * Check if v-ref/ v-el is also present.
	   */

	  checkRef: function () {
	    var refID = _.attr(this.el, 'ref')
	    this.refID = refID
	      ? this.vm.$interpolate(refID)
	      : null
	    var elId = _.attr(this.el, 'el')
	    this.elId = elId
	      ? this.vm.$interpolate(elId)
	      : null
	  },

	  /**
	   * Check the component constructor to use for repeated
	   * instances. If static we resolve it now, otherwise it
	   * needs to be resolved at build time with actual data.
	   */

	  checkComponent: function () {
	    this.componentState = UNRESOLVED
	    var options = this.vm.$options
	    var id = _.checkComponent(this.el, options)
	    if (!id) {
	      // default constructor
	      this.Ctor = _.Vue
	      // inline repeats should inherit
	      this.inherit = true
	      // important: transclude with no options, just
	      // to ensure block start and block end
	      this.template = transclude(this.template)
	      var copy = _.extend({}, options)
	      copy._asComponent = false
	      this._linkFn = compile(this.template, copy)
	    } else {
	      this.Ctor = null
	      this.asComponent = true
	      // check inline-template
	      if (this._checkParam('inline-template') !== null) {
	        // extract inline template as a DocumentFragment
	        this.inlineTempalte = _.extractContent(this.el, true)
	      }
	      var tokens = textParser.parse(id)
	      if (tokens) {
	        // dynamic component to be resolved later
	        var ctorExp = textParser.tokensToExp(tokens)
	        this.ctorGetter = expParser.parse(ctorExp).get
	      } else {
	        // static
	        this.componentId = id
	        this.pendingData = null
	      }
	    }
	  },

	  resolveComponent: function () {
	    this.componentState = PENDING
	    this.vm._resolveComponent(this.componentId, _.bind(function (Ctor) {
	      if (this.componentState === ABORTED) {
	        return
	      }
	      this.Ctor = Ctor
	      var merged = _.mergeOptions(Ctor.options, {}, {
	        $parent: this.vm
	      })
	      merged.template = this.inlineTempalte || merged.template
	      merged._asComponent = true
	      merged._parent = this.vm
	      this.template = transclude(this.template, merged)
	      // Important: mark the template as a root node so that
	      // custom element components don't get compiled twice.
	      // fixes #822
	      this.template.__vue__ = true
	      this._linkFn = compile(this.template, merged)
	      this.componentState = RESOLVED
	      this.realUpdate(this.pendingData)
	      this.pendingData = null
	    }, this))
	  },

	    /**
	   * Resolve a dynamic component to use for an instance.
	   * The tricky part here is that there could be dynamic
	   * components depending on instance data.
	   *
	   * @param {Object} data
	   * @param {Object} meta
	   * @return {Function}
	   */

	  resolveDynamicComponent: function (data, meta) {
	    // create a temporary context object and copy data
	    // and meta properties onto it.
	    // use _.define to avoid accidentally overwriting scope
	    // properties.
	    var context = Object.create(this.vm)
	    var key
	    for (key in data) {
	      _.define(context, key, data[key])
	    }
	    for (key in meta) {
	      _.define(context, key, meta[key])
	    }
	    var id = this.ctorGetter.call(context, context)
	    var Ctor = _.resolveAsset(this.vm.$options, 'components', id)
	    _.assertAsset(Ctor, 'component', id)
	    if (!Ctor.options) {
	      _.warn(
	        'Async resolution is not supported for v-repeat ' +
	        '+ dynamic component. (component: ' + id + ')'
	      )
	      return _.Vue
	    }
	    return Ctor
	  },

	  /**
	   * Update.
	   * This is called whenever the Array mutates. If we have
	   * a component, we might need to wait for it to resolve
	   * asynchronously.
	   *
	   * @param {Array|Number|String} data
	   */

	  update: function (data) {
	    if (this.componentId) {
	      var state = this.componentState
	      if (state === UNRESOLVED) {
	        this.pendingData = data
	        // once resolved, it will call realUpdate
	        this.resolveComponent()
	      } else if (state === PENDING) {
	        this.pendingData = data
	      } else if (state === RESOLVED) {
	        this.realUpdate(data)
	      }
	    } else {
	      this.realUpdate(data)
	    }
	  },

	  /**
	   * The real update that actually modifies the DOM.
	   *
	   * @param {Array|Number|String} data
	   */

	  realUpdate: function (data) {
	    this.vms = this.diff(data, this.vms)
	    // update v-ref
	    if (this.refID) {
	      this.vm.$[this.refID] = this.vms
	    }
	    if (this.elId) {
	      this.vm.$$[this.elId] = this.vms.map(function (vm) {
	        return vm.$el
	      })
	    }
	  },

	  /**
	   * Diff, based on new data and old data, determine the
	   * minimum amount of DOM manipulations needed to make the
	   * DOM reflect the new data Array.
	   *
	   * The algorithm diffs the new data Array by storing a
	   * hidden reference to an owner vm instance on previously
	   * seen data. This allows us to achieve O(n) which is
	   * better than a levenshtein distance based algorithm,
	   * which is O(m * n).
	   *
	   * @param {Array} data
	   * @param {Array} oldVms
	   * @return {Array}
	   */

	  diff: function (data, oldVms) {
	    var idKey = this.idKey
	    var converted = this.converted
	    var anchor = this.anchor
	    var alias = this.arg
	    var init = !oldVms
	    var vms = new Array(data.length)
	    var obj, raw, vm, i, l
	    // First pass, go through the new Array and fill up
	    // the new vms array. If a piece of data has a cached
	    // instance for it, we reuse it. Otherwise build a new
	    // instance.
	    for (i = 0, l = data.length; i < l; i++) {
	      obj = data[i]
	      raw = converted ? obj.$value : obj
	      vm = !init && this.getVm(raw, i, converted ? obj.$key : null)
	      if (vm) { // reusable instance
	        vm._reused = true
	        vm.$index = i // update $index
	        // update data for track-by or object repeat,
	        // since in these two cases the data is replaced
	        // rather than mutated.
	        if (idKey || converted) {
	          if (alias) {
	            vm[alias] = raw
	          } else if (_.isPlainObject(raw)) {
	            vm.$data = raw
	          } else {
	            vm.$value = raw
	          }
	        }
	      } else { // new instance
	        vm = this.build(obj, i, true)
	        // the _new flag is used in the second pass for
	        // vm cache retrival, but if this is the init phase
	        // the flag can just be set to false directly.
	        vm._new = !init
	        vm._reused = false
	      }
	      vms[i] = vm
	      // insert if this is first run
	      if (init) {
	        vm.$before(anchor)
	      }
	    }
	    // if this is the first run, we're done.
	    if (init) {
	      return vms
	    }
	    // Second pass, go through the old vm instances and
	    // destroy those who are not reused (and remove them
	    // from cache)
	    for (i = 0, l = oldVms.length; i < l; i++) {
	      vm = oldVms[i]
	      if (!vm._reused) {
	        this.uncacheVm(vm)
	        vm.$destroy(true)
	      }
	    }
	    // final pass, move/insert new instances into the
	    // right place. We're going in reverse here because
	    // insertBefore relies on the next sibling to be
	    // resolved.
	    var targetNext, currentNext
	    i = vms.length
	    while (i--) {
	      vm = vms[i]
	      // this is the vm that we should be in front of
	      targetNext = vms[i + 1]
	      if (!targetNext) {
	        // This is the last item. If it's reused then
	        // everything else will eventually be in the right
	        // place, so no need to touch it. Otherwise, insert
	        // it.
	        if (!vm._reused) {
	          vm.$before(anchor)
	        }
	      } else {
	        var nextEl = targetNext.$el
	        if (vm._reused) {
	          // this is the vm we are actually in front of
	          currentNext = findNextVm(vm, anchor)
	          // we only need to move if we are not in the right
	          // place already.
	          if (currentNext !== targetNext) {
	            vm.$before(nextEl, null, false)
	          }
	        } else {
	          // new instance, insert to existing next
	          vm.$before(nextEl)
	        }
	      }
	      vm._new = false
	      vm._reused = false
	    }
	    return vms
	  },

	  /**
	   * Build a new instance and cache it.
	   *
	   * @param {Object} data
	   * @param {Number} index
	   * @param {Boolean} needCache
	   */

	  build: function (data, index, needCache) {
	    var meta = { $index: index }
	    if (this.converted) {
	      meta.$key = data.$key
	    }
	    var raw = this.converted ? data.$value : data
	    var alias = this.arg
	    if (alias) {
	      data = {}
	      data[alias] = raw
	    } else if (!isPlainObject(raw)) {
	      // non-object values
	      data = {}
	      meta.$value = raw
	    } else {
	      // default
	      data = raw
	    }
	    // resolve constructor
	    var Ctor = this.Ctor || this.resolveDynamicComponent(data, meta)
	    var vm = this.vm.$addChild({
	      el: templateParser.clone(this.template),
	      _asComponent: this.asComponent,
	      _host: this._host,
	      _linkFn: this._linkFn,
	      _meta: meta,
	      data: data,
	      inherit: this.inherit,
	      template: this.inlineTempalte
	    }, Ctor)
	    // flag this instance as a repeat instance
	    // so that we can skip it in vm._digest
	    vm._repeat = true
	    // cache instance
	    if (needCache) {
	      this.cacheVm(raw, vm, index, this.converted ? meta.$key : null)
	    }
	    // sync back changes for two-way bindings of primitive values
	    var type = typeof raw
	    var dir = this
	    if (
	      this.rawType === 'object' &&
	      (type === 'string' || type === 'number')
	    ) {
	      vm.$watch(alias || '$value', function (val) {
	        dir._withLock(function () {
	          if (dir.converted) {
	            dir.rawValue[vm.$key] = val
	          } else {
	            dir.rawValue.$set(vm.$index, val)
	          }
	        })
	      })
	    }
	    return vm
	  },

	  /**
	   * Unbind, teardown everything
	   */

	  unbind: function () {
	    this.componentState = ABORTED
	    if (this.refID) {
	      this.vm.$[this.refID] = null
	    }
	    if (this.vms) {
	      var i = this.vms.length
	      var vm
	      while (i--) {
	        vm = this.vms[i]
	        this.uncacheVm(vm)
	        vm.$destroy()
	      }
	    }
	  },

	  /**
	   * Cache a vm instance based on its data.
	   *
	   * If the data is an object, we save the vm's reference on
	   * the data object as a hidden property. Otherwise we
	   * cache them in an object and for each primitive value
	   * there is an array in case there are duplicates.
	   *
	   * @param {Object} data
	   * @param {Vue} vm
	   * @param {Number} index
	   * @param {String} [key]
	   */

	  cacheVm: function (data, vm, index, key) {
	    var idKey = this.idKey
	    var cache = this.cache
	    var id
	    if (key || idKey) {
	      id = idKey
	        ? idKey === '$index'
	          ? index
	          : data[idKey]
	        : key
	      if (!cache[id]) {
	        cache[id] = vm
	      } else {
	        _.warn('Duplicate track-by key in v-repeat: ' + id)
	      }
	    } else if (isObject(data)) {
	      id = this.id
	      if (data.hasOwnProperty(id)) {
	        if (data[id] === null) {
	          data[id] = vm
	        } else {
	          _.warn(
	            'Duplicate objects are not supported in v-repeat ' +
	            'when using components or transitions.'
	          )
	        }
	      } else {
	        _.define(data, id, vm)
	      }
	    } else {
	      if (!cache[data]) {
	        cache[data] = [vm]
	      } else {
	        cache[data].push(vm)
	      }
	    }
	    vm._raw = data
	  },

	  /**
	   * Try to get a cached instance from a piece of data.
	   *
	   * @param {Object} data
	   * @param {Number} index
	   * @param {String} [key]
	   * @return {Vue|undefined}
	   */

	  getVm: function (data, index, key) {
	    var idKey = this.idKey
	    if (key || idKey) {
	      var id = idKey
	        ? idKey === '$index'
	          ? index
	          : data[idKey]
	        : key
	      return this.cache[id]
	    } else if (isObject(data)) {
	      return data[this.id]
	    } else {
	      var cached = this.cache[data]
	      if (cached) {
	        var i = 0
	        var vm = cached[i]
	        // since duplicated vm instances might be a reused
	        // one OR a newly created one, we need to return the
	        // first instance that is neither of these.
	        while (vm && (vm._reused || vm._new)) {
	          vm = cached[++i]
	        }
	        return vm
	      }
	    }
	  },

	  /**
	   * Delete a cached vm instance.
	   *
	   * @param {Vue} vm
	   */

	  uncacheVm: function (vm) {
	    var data = vm._raw
	    var idKey = this.idKey
	    var convertedKey = vm.$key
	    if (idKey || convertedKey) {
	      var id = idKey
	        ? idKey === '$index'
	          ? vm.$index
	          : data[idKey]
	        : convertedKey
	      this.cache[id] = null
	    } else if (isObject(data)) {
	      data[this.id] = null
	      vm._raw = null
	    } else {
	      this.cache[data].pop()
	    }
	  },

	  /**
	   * Pre-process the value before piping it through the
	   * filters, and convert non-Array objects to arrays.
	   *
	   * This function will be bound to this directive instance
	   * and passed into the watcher.
	   *
	   * @param {*} value
	   * @return {Array}
	   * @private
	   */

	  _preProcess: function (value) {
	    // regardless of type, store the un-filtered raw value.
	    this.rawValue = value
	    var type = this.rawType = typeof value
	    if (!isPlainObject(value)) {
	      this.converted = false
	      if (type === 'number') {
	        value = range(value)
	      } else if (type === 'string') {
	        value = _.toArray(value)
	      }
	      return value || []
	    } else {
	      // convert plain object to array.
	      var keys = Object.keys(value)
	      var i = keys.length
	      var res = new Array(i)
	      var key
	      while (i--) {
	        key = keys[i]
	        res[i] = {
	          $key: key,
	          $value: value[key]
	        }
	      }
	      this.converted = true
	      return res
	    }
	  }

	}

	/**
	 * Helper to find the next element that is an instance
	 * root node. This is necessary because a destroyed vm's
	 * element could still be lingering in the DOM before its
	 * leaving transition finishes, but its __vue__ reference
	 * should have been removed so we can skip them.
	 *
	 * @param {Vue} vm
	 * @param {Comment|Text} anchor
	 * @return {Vue}
	 */

	function findNextVm (vm, anchor) {
	  var el = (vm._blockEnd || vm.$el).nextSibling
	  while (!el.__vue__ && el !== anchor) {
	    el = el.nextSibling
	  }
	  return el.__vue__
	}

	/**
	 * Create a range array from given number.
	 *
	 * @param {Number} n
	 * @return {Array}
	 */

	function range (n) {
	  var i = -1
	  var ret = new Array(n)
	  while (++i < n) {
	    ret[i] = i
	  }
	  return ret
	}

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var compile = __webpack_require__(23)
	var templateParser = __webpack_require__(24)
	var transition = __webpack_require__(34)

	module.exports = {

	  bind: function () {
	    var el = this.el
	    if (!el.__vue__) {
	      this.start = _.createAnchor('v-if-start')
	      this.end = _.createAnchor('v-if-end')
	      _.replace(el, this.end)
	      _.before(this.start, this.end)
	      if (el.tagName === 'TEMPLATE') {
	        this.template = templateParser.parse(el, true)
	      } else {
	        this.template = document.createDocumentFragment()
	        this.template.appendChild(templateParser.clone(el))
	      }
	      // compile the nested partial
	      this.linker = compile(
	        this.template,
	        this.vm.$options,
	        true
	      )
	    } else {
	      this.invalid = true
	      _.warn(
	        'v-if="' + this.expression + '" cannot be ' +
	        'used on an already mounted instance.'
	      )
	    }
	  },

	  update: function (value) {
	    if (this.invalid) return
	    if (value) {
	      // avoid duplicate compiles, since update() can be
	      // called with different truthy values
	      if (!this.unlink) {
	        this.compile()
	      }
	    } else {
	      this.teardown()
	    }
	  },

	  compile: function () {
	    var vm = this.vm
	    var frag = templateParser.clone(this.template)
	    // the linker is not guaranteed to be present because
	    // this function might get called by v-partial 
	    this.unlink = this.linker(vm, frag)
	    transition.blockAppend(frag, this.end, vm)
	    // call attached for all the child components created
	    // during the compilation
	    if (_.inDoc(vm.$el)) {
	      var children = this.getContainedComponents()
	      if (children) children.forEach(callAttach)
	    }
	  },

	  teardown: function () {
	    if (!this.unlink) return
	    // collect children beforehand
	    var children
	    if (_.inDoc(this.vm.$el)) {
	      children = this.getContainedComponents()
	    }
	    transition.blockRemove(this.start, this.end, this.vm)
	    if (children) children.forEach(callDetach)
	    this.unlink()
	    this.unlink = null
	  },

	  getContainedComponents: function () {
	    var vm = this.vm
	    var start = this.start.nextSibling
	    var end = this.end
	    var selfCompoents =
	      vm._children.length &&
	      vm._children.filter(contains)
	    var transComponents =
	      vm._transCpnts &&
	      vm._transCpnts.filter(contains)

	    function contains (c) {
	      var cur = start
	      var next
	      while (next !== end) {
	        next = cur.nextSibling
	        if (cur.contains(c.$el)) {
	          return true
	        }
	        cur = next
	      }
	      return false
	    }

	    return selfCompoents
	      ? transComponents
	        ? selfCompoents.concat(transComponents)
	        : selfCompoents
	      : transComponents
	  },

	  unbind: function () {
	    if (this.unlink) this.unlink()
	  }

	}

	function callAttach (child) {
	  if (!child._isAttached) {
	    child._callHook('attached')
	  }
	}

	function callDetach (child) {
	  if (child._isAttached) {
	    child._callHook('detached')
	  }
	}

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	module.exports = {

	  acceptStatement: true,

	  bind: function () {
	    var child = this.el.__vue__
	    if (!child || this.vm !== child.$parent) {
	      _.warn(
	        '`v-events` should only be used on a child component ' +
	        'from the parent template.'
	      )
	      return
	    }
	  },

	  update: function (handler, oldHandler) {
	    if (typeof handler !== 'function') {
	      _.warn(
	        'Directive "v-events:' + this.expression + '" ' +
	        'expects a function value.'
	      )
	      return
	    }
	    var child = this.el.__vue__
	    if (oldHandler) {
	      child.$off(this.arg, oldHandler)
	    }
	    child.$on(this.arg, handler)
	  }

	  // when child is destroyed, all events are turned off,
	  // so no need for unbind here.

	}

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	/**
	 * Stringify value.
	 *
	 * @param {Number} indent
	 */

	exports.json = {
	  read: function (value, indent) {
	    return typeof value === 'string'
	      ? value
	      : JSON.stringify(value, null, Number(indent) || 2)
	  },
	  write: function (value) {
	    try {
	      return JSON.parse(value)
	    } catch (e) {
	      return value
	    }
	  }
	}

	/**
	 * 'abc' => 'Abc'
	 */

	exports.capitalize = function (value) {
	  if (!value && value !== 0) return ''
	  value = value.toString()
	  return value.charAt(0).toUpperCase() + value.slice(1)
	}

	/**
	 * 'abc' => 'ABC'
	 */

	exports.uppercase = function (value) {
	  return (value || value === 0)
	    ? value.toString().toUpperCase()
	    : ''
	}

	/**
	 * 'AbC' => 'abc'
	 */

	exports.lowercase = function (value) {
	  return (value || value === 0)
	    ? value.toString().toLowerCase()
	    : ''
	}

	/**
	 * 12345 => $12,345.00
	 *
	 * @param {String} sign
	 */

	var digitsRE = /(\d{3})(?=\d)/g

	exports.currency = function (value, sign) {
	  value = parseFloat(value)
	  if (!isFinite(value) || (!value && value !== 0)) return ''
	  sign = sign || '$'
	  var s = Math.floor(Math.abs(value)).toString(),
	    i = s.length % 3,
	    h = i > 0
	      ? (s.slice(0, i) + (s.length > 3 ? ',' : ''))
	      : '',
	    v = Math.abs(parseInt((value * 100) % 100, 10)),
	    f = '.' + (v < 10 ? ('0' + v) : v)
	  return (value < 0 ? '-' : '') +
	    sign + h + s.slice(i).replace(digitsRE, '$1,') + f
	}

	/**
	 * 'item' => 'items'
	 *
	 * @params
	 *  an array of strings corresponding to
	 *  the single, double, triple ... forms of the word to
	 *  be pluralized. When the number to be pluralized
	 *  exceeds the length of the args, it will use the last
	 *  entry in the array.
	 *
	 *  e.g. ['single', 'double', 'triple', 'multiple']
	 */

	exports.pluralize = function (value) {
	  var args = _.toArray(arguments, 1)
	  return args.length > 1
	    ? (args[value % 10 - 1] || args[args.length - 1])
	    : (args[0] + (value === 1 ? '' : 's'))
	}

	/**
	 * A special filter that takes a handler function,
	 * wraps it so it only gets triggered on specific
	 * keypresses. v-on only.
	 *
	 * @param {String} key
	 */

	var keyCodes = {
	  enter    : 13,
	  tab      : 9,
	  'delete' : 46,
	  up       : 38,
	  left     : 37,
	  right    : 39,
	  down     : 40,
	  esc      : 27
	}

	exports.key = function (handler, key) {
	  if (!handler) return
	  var code = keyCodes[key]
	  if (!code) {
	    code = parseInt(key, 10)
	  }
	  return function (e) {
	    if (e.keyCode === code) {
	      return handler.call(this, e)
	    }
	  }
	}

	// expose keycode hash
	exports.key.keyCodes = keyCodes

	/**
	 * Install special array filters
	 */

	_.extend(exports, __webpack_require__(53))


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var Path = __webpack_require__(18)

	/**
	 * Filter filter for v-repeat
	 *
	 * @param {String} searchKey
	 * @param {String} [delimiter]
	 * @param {String} dataKey
	 */

	exports.filterBy = function (arr, search, delimiter, dataKey) {
	  // allow optional `in` delimiter
	  // because why not
	  if (delimiter && delimiter !== 'in') {
	    dataKey = delimiter
	  }
	  if (!search) {
	    return arr
	  }
	  // cast to lowercase string
	  search = ('' + search).toLowerCase()
	  return arr.filter(function (item) {
	    return dataKey
	      ? contains(Path.get(item, dataKey), search)
	      : contains(item, search)
	  })
	}

	/**
	 * Filter filter for v-repeat
	 *
	 * @param {String} sortKey
	 * @param {String} reverse
	 */

	exports.orderBy = function (arr, sortKey, reverse) {
	  if (!sortKey) {
	    return arr
	  }
	  var order = 1
	  if (arguments.length > 2) {
	    if (reverse === '-1') {
	      order = -1
	    } else {
	      order = reverse ? -1 : 1
	    }
	  }
	  // sort on a copy to avoid mutating original array
	  return arr.slice().sort(function (a, b) {
	    if (sortKey !== '$key' && sortKey !== '$value') {
	      if (a && '$value' in a) a = a.$value
	      if (b && '$value' in b) b = b.$value
	    }
	    a = _.isObject(a) ? Path.get(a, sortKey) : a
	    b = _.isObject(b) ? Path.get(b, sortKey) : b
	    return a === b ? 0 : a > b ? order : -order
	  })
	}

	/**
	 * String contain helper
	 *
	 * @param {*} val
	 * @param {String} search
	 */

	function contains (val, search) {
	  if (_.isPlainObject(val)) {
	    for (var key in val) {
	      if (contains(val[key], search)) {
	        return true
	      }
	    }
	  } else if (_.isArray(val)) {
	    var i = val.length
	    while (i--) {
	      if (contains(val[i], search)) {
	        return true
	      }
	    }
	  } else if (val != null) {
	    return val.toString().toLowerCase().indexOf(search) > -1
	  }
	}

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var mergeOptions = __webpack_require__(3).mergeOptions

	/**
	 * The main init sequence. This is called for every
	 * instance, including ones that are created from extended
	 * constructors.
	 *
	 * @param {Object} options - this options object should be
	 *                           the result of merging class
	 *                           options and the options passed
	 *                           in to the constructor.
	 */

	exports._init = function (options) {

	  options = options || {}

	  this.$el           = null
	  this.$parent       = options._parent
	  this.$root         = options._root || this
	  this.$             = {} // child vm references
	  this.$$            = {} // element references
	  this._watchers     = [] // all watchers as an array
	  this._directives   = [] // all directives

	  // a flag to avoid this being observed
	  this._isVue = true

	  // events bookkeeping
	  this._events         = {}    // registered callbacks
	  this._eventsCount    = {}    // for $broadcast optimization
	  this._eventCancelled = false // for event cancellation

	  // block instance properties
	  this._isBlock     = false
	  this._blockStart  =          // @type {CommentNode}
	  this._blockEnd    = null     // @type {CommentNode}

	  // lifecycle state
	  this._isCompiled  =
	  this._isDestroyed =
	  this._isReady     =
	  this._isAttached  =
	  this._isBeingDestroyed = false
	  this._unlinkFn    = null

	  // children
	  this._children = []
	  this._childCtors = {}

	  // transcluded components that belong to the parent.
	  // need to keep track of them so that we can call
	  // attached/detached hooks on them.
	  this._transCpnts = []
	  this._host = options._host

	  // push self into parent / transclusion host
	  if (this.$parent) {
	    this.$parent._children.push(this)
	  }
	  if (this._host) {
	    this._host._transCpnts.push(this)
	  }

	  // props used in v-repeat diffing
	  this._new = true
	  this._reused = false

	  // merge options.
	  options = this.$options = mergeOptions(
	    this.constructor.options,
	    options,
	    this
	  )

	  // set data after merge.
	  this._data = options.data || {}

	  // initialize data observation and scope inheritance.
	  this._initScope()

	  // setup event system and option events.
	  this._initEvents()

	  // call created hook
	  this._callHook('created')

	  // if `el` option is passed, start compilation.
	  if (options.el) {
	    this.$mount(options.el)
	  }
	}

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var inDoc = _.inDoc

	/**
	 * Setup the instance's option events & watchers.
	 * If the value is a string, we pull it from the
	 * instance's methods by name.
	 */

	exports._initEvents = function () {
	  var options = this.$options
	  registerCallbacks(this, '$on', options.events)
	  registerCallbacks(this, '$watch', options.watch)
	}

	/**
	 * Register callbacks for option events and watchers.
	 *
	 * @param {Vue} vm
	 * @param {String} action
	 * @param {Object} hash
	 */

	function registerCallbacks (vm, action, hash) {
	  if (!hash) return
	  var handlers, key, i, j
	  for (key in hash) {
	    handlers = hash[key]
	    if (_.isArray(handlers)) {
	      for (i = 0, j = handlers.length; i < j; i++) {
	        register(vm, action, key, handlers[i])
	      }
	    } else {
	      register(vm, action, key, handlers)
	    }
	  }
	}

	/**
	 * Helper to register an event/watch callback.
	 *
	 * @param {Vue} vm
	 * @param {String} action
	 * @param {String} key
	 * @param {*} handler
	 */

	function register (vm, action, key, handler) {
	  var type = typeof handler
	  if (type === 'function') {
	    vm[action](key, handler)
	  } else if (type === 'string') {
	    var methods = vm.$options.methods
	    var method = methods && methods[handler]
	    if (method) {
	      vm[action](key, method)
	    } else {
	      _.warn(
	        'Unknown method: "' + handler + '" when ' +
	        'registering callback for ' + action +
	        ': "' + key + '".'
	      )
	    }
	  }
	}

	/**
	 * Setup recursive attached/detached calls
	 */

	exports._initDOMHooks = function () {
	  this.$on('hook:attached', onAttached)
	  this.$on('hook:detached', onDetached)
	}

	/**
	 * Callback to recursively call attached hook on children
	 */

	function onAttached () {
	  this._isAttached = true
	  this._children.forEach(callAttach)
	  if (this._transCpnts.length) {
	    this._transCpnts.forEach(callAttach)
	  }
	}

	/**
	 * Iterator to call attached hook
	 * 
	 * @param {Vue} child
	 */

	function callAttach (child) {
	  if (!child._isAttached && inDoc(child.$el)) {
	    child._callHook('attached')
	  }
	}

	/**
	 * Callback to recursively call detached hook on children
	 */

	function onDetached () {
	  this._isAttached = false
	  this._children.forEach(callDetach)
	  if (this._transCpnts.length) {
	    this._transCpnts.forEach(callDetach)
	  }
	}

	/**
	 * Iterator to call detached hook
	 * 
	 * @param {Vue} child
	 */

	function callDetach (child) {
	  if (child._isAttached && !inDoc(child.$el)) {
	    child._callHook('detached')
	  }
	}

	/**
	 * Trigger all handlers for a hook
	 *
	 * @param {String} hook
	 */

	exports._callHook = function (hook) {
	  var handlers = this.$options[hook]
	  if (handlers) {
	    for (var i = 0, j = handlers.length; i < j; i++) {
	      handlers[i].call(this)
	    }
	  }
	  this.$emit('hook:' + hook)
	}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var Observer = __webpack_require__(13)
	var Dep = __webpack_require__(14)

	/**
	 * Setup the scope of an instance, which contains:
	 * - observed data
	 * - computed properties
	 * - user methods
	 * - meta properties
	 */

	exports._initScope = function () {
	  this._initData()
	  this._initComputed()
	  this._initMethods()
	  this._initMeta()
	}

	/**
	 * Initialize the data. 
	 */

	exports._initData = function () {
	  // proxy data on instance
	  var data = this._data
	  var i, key
	  // make sure all props properties are observed
	  var props = this.$options.props
	  if (props) {
	    i = props.length
	    while (i--) {
	      key = _.camelize(props[i])
	      if (!(key in data)) {
	        data[key] = null
	      }
	    }
	  }
	  var keys = Object.keys(data)
	  i = keys.length
	  while (i--) {
	    key = keys[i]
	    if (!_.isReserved(key)) {
	      this._proxy(key)
	    }
	  }
	  // observe data
	  Observer.create(data).addVm(this)
	}

	/**
	 * Swap the isntance's $data. Called in $data's setter.
	 *
	 * @param {Object} newData
	 */

	exports._setData = function (newData) {
	  newData = newData || {}
	  var oldData = this._data
	  this._data = newData
	  var keys, key, i
	  // copy props
	  var props = this.$options.props
	  if (props) {
	    i = props.length
	    while (i--) {
	      key = props[i]
	      newData.$set(key, oldData[key])
	    }
	  }
	  // unproxy keys not present in new data
	  keys = Object.keys(oldData)
	  i = keys.length
	  while (i--) {
	    key = keys[i]
	    if (!_.isReserved(key) && !(key in newData)) {
	      this._unproxy(key)
	    }
	  }
	  // proxy keys not already proxied,
	  // and trigger change for changed values
	  keys = Object.keys(newData)
	  i = keys.length
	  while (i--) {
	    key = keys[i]
	    if (!this.hasOwnProperty(key) && !_.isReserved(key)) {
	      // new property
	      this._proxy(key)
	    }
	  }
	  oldData.__ob__.removeVm(this)
	  Observer.create(newData).addVm(this)
	  this._digest()
	}

	/**
	 * Proxy a property, so that
	 * vm.prop === vm._data.prop
	 *
	 * @param {String} key
	 */

	exports._proxy = function (key) {
	  // need to store ref to self here
	  // because these getter/setters might
	  // be called by child instances!
	  var self = this
	  Object.defineProperty(self, key, {
	    configurable: true,
	    enumerable: true,
	    get: function proxyGetter () {
	      return self._data[key]
	    },
	    set: function proxySetter (val) {
	      self._data[key] = val
	    }
	  })
	}

	/**
	 * Unproxy a property.
	 *
	 * @param {String} key
	 */

	exports._unproxy = function (key) {
	  delete this[key]
	}

	/**
	 * Force update on every watcher in scope.
	 */

	exports._digest = function () {
	  var i = this._watchers.length
	  while (i--) {
	    this._watchers[i].update()
	  }
	  var children = this._children
	  i = children.length
	  while (i--) {
	    var child = children[i]
	    if (child.$options.inherit) {
	      child._digest()
	    }
	  }
	}

	/**
	 * Setup computed properties. They are essentially
	 * special getter/setters
	 */

	function noop () {}
	exports._initComputed = function () {
	  var computed = this.$options.computed
	  if (computed) {
	    for (var key in computed) {
	      var userDef = computed[key]
	      var def = {
	        enumerable: true,
	        configurable: true
	      }
	      if (typeof userDef === 'function') {
	        def.get = _.bind(userDef, this)
	        def.set = noop
	      } else {
	        def.get = userDef.get
	          ? _.bind(userDef.get, this)
	          : noop
	        def.set = userDef.set
	          ? _.bind(userDef.set, this)
	          : noop
	      }
	      Object.defineProperty(this, key, def)
	    }
	  }
	}

	/**
	 * Setup instance methods. Methods must be bound to the
	 * instance since they might be called by children
	 * inheriting them.
	 */

	exports._initMethods = function () {
	  var methods = this.$options.methods
	  if (methods) {
	    for (var key in methods) {
	      this[key] = _.bind(methods[key], this)
	    }
	  }
	}

	/**
	 * Initialize meta information like $index, $key & $value.
	 */

	exports._initMeta = function () {
	  var metas = this.$options._meta
	  if (metas) {
	    for (var key in metas) {
	      this._defineMeta(key, metas[key])
	    }
	  }
	}

	/**
	 * Define a meta property, e.g $index, $key, $value
	 * which only exists on the vm instance but not in $data.
	 *
	 * @param {String} key
	 * @param {*} value
	 */

	exports._defineMeta = function (key, value) {
	  var dep = new Dep()
	  Object.defineProperty(this, key, {
	    enumerable: true,
	    configurable: true,
	    get: function metaGetter () {
	      if (Observer.target) {
	        Observer.target.addDep(dep)
	      }
	      return value
	    },
	    set: function metaSetter (val) {
	      if (val !== value) {
	        value = val
	        dep.notify()
	      }
	    }
	  })
	}

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	/**
	 * Apply a list of filter (descriptors) to a value.
	 * Using plain for loops here because this will be called in
	 * the getter of any watcher with filters so it is very
	 * performance sensitive.
	 *
	 * @param {*} value
	 * @param {*} [oldValue]
	 * @param {Array} filters
	 * @param {Boolean} write
	 * @return {*}
	 */

	exports._applyFilters = function (value, oldValue, filters, write) {
	  var filter, fn, args, arg, offset, i, l, j, k
	  for (i = 0, l = filters.length; i < l; i++) {
	    filter = filters[i]
	    fn = _.resolveAsset(this.$options, 'filters', filter.name)
	    _.assertAsset(fn, 'filter', filter.name)
	    if (!fn) continue
	    fn = write ? fn.write : (fn.read || fn)
	    if (typeof fn !== 'function') continue
	    args = write ? [value, oldValue] : [value]
	    offset = write ? 2 : 1
	    if (filter.args) {
	      for (j = 0, k = filter.args.length; j < k; j++) {
	        arg = filter.args[j]
	        args[j + offset] = arg.dynamic
	          ? this.$get(arg.value)
	          : arg.value
	      }
	    }
	    value = fn.apply(this, args)
	  }
	  return value
	}

	/**
	 * Resolve a component, depending on whether the component
	 * is defined normally or using an async factory function.
	 * Resolves synchronously if already resolved, otherwise
	 * resolves asynchronously and caches the resolved
	 * constructor on the factory.
	 *
	 * @param {String} id
	 * @param {Function} cb
	 */

	exports._resolveComponent = function (id, cb) {
	  var factory = _.resolveAsset(this.$options, 'components', id)
	  _.assertAsset(factory, 'component', id)
	  // async component factory
	  if (!factory.options) {
	    if (factory.resolved) {
	      // cached
	      cb(factory.resolved)
	    } else if (factory.requested) {
	      factory.pendingCallbacks.push(cb)
	    } else {
	      factory.requested = true
	      var cbs = factory.pendingCallbacks = [cb]
	      factory(function resolve (res) {
	        if (_.isPlainObject(res)) {
	          res = _.Vue.extend(res)
	        }
	        // cache resolved
	        factory.resolved = res
	        // invoke callbacks
	        for (var i = 0, l = cbs.length; i < l; i++) {
	          cbs[i](res)
	        }
	      })
	    }
	  } else {
	    // normal component
	    cb(factory)
	  }
	}

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var Watcher = __webpack_require__(12)
	var Path = __webpack_require__(18)
	var textParser = __webpack_require__(21)
	var dirParser = __webpack_require__(22)
	var expParser = __webpack_require__(17)
	var filterRE = /[^|]\|[^|]/

	/**
	 * Get the value from an expression on this vm.
	 *
	 * @param {String} exp
	 * @return {*}
	 */

	exports.$get = function (exp) {
	  var res = expParser.parse(exp)
	  if (res) {
	    return res.get.call(this, this)
	  }
	}

	/**
	 * Set the value from an expression on this vm.
	 * The expression must be a valid left-hand
	 * expression in an assignment.
	 *
	 * @param {String} exp
	 * @param {*} val
	 */

	exports.$set = function (exp, val) {
	  var res = expParser.parse(exp, true)
	  if (res && res.set) {
	    res.set.call(this, this, val)
	  }
	}

	/**
	 * Add a property on the VM
	 *
	 * @param {String} key
	 * @param {*} val
	 */

	exports.$add = function (key, val) {
	  this._data.$add(key, val)
	}

	/**
	 * Delete a property on the VM
	 *
	 * @param {String} key
	 */

	exports.$delete = function (key) {
	  this._data.$delete(key)
	}

	/**
	 * Watch an expression, trigger callback when its
	 * value changes.
	 *
	 * @param {String} exp
	 * @param {Function} cb
	 * @param {Boolean} [deep]
	 * @param {Boolean} [immediate]
	 * @return {Function} - unwatchFn
	 */

	exports.$watch = function (exp, cb, deep, immediate) {
	  var vm = this
	  var wrappedCb = function (val, oldVal) {
	    cb.call(vm, val, oldVal)
	  }
	  var watcher = new Watcher(vm, exp, wrappedCb, {
	    deep: deep,
	    user: true
	  })
	  if (immediate) {
	    wrappedCb(watcher.value)
	  }
	  return function unwatchFn () {
	    watcher.teardown()
	  }
	}

	/**
	 * Evaluate a text directive, including filters.
	 *
	 * @param {String} text
	 * @return {String}
	 */

	exports.$eval = function (text) {
	  // check for filters.
	  if (filterRE.test(text)) {
	    var dir = dirParser.parse(text)[0]
	    // the filter regex check might give false positive
	    // for pipes inside strings, so it's possible that
	    // we don't get any filters here
	    var val = this.$get(dir.expression)
	    return dir.filters
	      ? this._applyFilters(val, null, dir.filters)
	      : val
	  } else {
	    // no filter
	    return this.$get(text)
	  }
	}

	/**
	 * Interpolate a piece of template text.
	 *
	 * @param {String} text
	 * @return {String}
	 */

	exports.$interpolate = function (text) {
	  var tokens = textParser.parse(text)
	  var vm = this
	  if (tokens) {
	    return tokens.length === 1
	      ? vm.$eval(tokens[0].value)
	      : tokens.map(function (token) {
	          return token.tag
	            ? vm.$eval(token.value)
	            : token.value
	        }).join('')
	  } else {
	    return text
	  }
	}

	/**
	 * Log instance data as a plain JS object
	 * so that it is easier to inspect in console.
	 * This method assumes console is available.
	 *
	 * @param {String} [path]
	 */

	exports.$log = function (path) {
	  var data = path
	    ? Path.get(this._data, path)
	    : this._data
	  if (data) {
	    data = JSON.parse(JSON.stringify(data))
	  }
	  console.log(data)
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var transition = __webpack_require__(34)

	/**
	 * Convenience on-instance nextTick. The callback is
	 * auto-bound to the instance, and this avoids component
	 * modules having to rely on the global Vue.
	 *
	 * @param {Function} fn
	 */

	exports.$nextTick = function (fn) {
	  _.nextTick(fn, this)
	}

	/**
	 * Append instance to target
	 *
	 * @param {Node} target
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition] - defaults to true
	 */

	exports.$appendTo = function (target, cb, withTransition) {
	  return insert(
	    this, target, cb, withTransition,
	    append, transition.append
	  )
	}

	/**
	 * Prepend instance to target
	 *
	 * @param {Node} target
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition] - defaults to true
	 */

	exports.$prependTo = function (target, cb, withTransition) {
	  target = query(target)
	  if (target.hasChildNodes()) {
	    this.$before(target.firstChild, cb, withTransition)
	  } else {
	    this.$appendTo(target, cb, withTransition)
	  }
	  return this
	}

	/**
	 * Insert instance before target
	 *
	 * @param {Node} target
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition] - defaults to true
	 */

	exports.$before = function (target, cb, withTransition) {
	  return insert(
	    this, target, cb, withTransition,
	    before, transition.before
	  )
	}

	/**
	 * Insert instance after target
	 *
	 * @param {Node} target
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition] - defaults to true
	 */

	exports.$after = function (target, cb, withTransition) {
	  target = query(target)
	  if (target.nextSibling) {
	    this.$before(target.nextSibling, cb, withTransition)
	  } else {
	    this.$appendTo(target.parentNode, cb, withTransition)
	  }
	  return this
	}

	/**
	 * Remove instance from DOM
	 *
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition] - defaults to true
	 */

	exports.$remove = function (cb, withTransition) {
	  var inDoc = this._isAttached && _.inDoc(this.$el)
	  // if we are not in document, no need to check
	  // for transitions
	  if (!inDoc) withTransition = false
	  var op
	  var self = this
	  var realCb = function () {
	    if (inDoc) self._callHook('detached')
	    if (cb) cb()
	  }
	  if (
	    this._isBlock &&
	    !this._blockFragment.hasChildNodes()
	  ) {
	    op = withTransition === false
	      ? append
	      : transition.removeThenAppend
	    blockOp(this, this._blockFragment, op, realCb)
	  } else {
	    op = withTransition === false
	      ? remove
	      : transition.remove
	    op(this.$el, this, realCb)
	  }
	  return this
	}

	/**
	 * Shared DOM insertion function.
	 *
	 * @param {Vue} vm
	 * @param {Element} target
	 * @param {Function} [cb]
	 * @param {Boolean} [withTransition]
	 * @param {Function} op1 - op for non-transition insert
	 * @param {Function} op2 - op for transition insert
	 * @return vm
	 */

	function insert (vm, target, cb, withTransition, op1, op2) {
	  target = query(target)
	  var targetIsDetached = !_.inDoc(target)
	  var op = withTransition === false || targetIsDetached
	    ? op1
	    : op2
	  var shouldCallHook =
	    !targetIsDetached &&
	    !vm._isAttached &&
	    !_.inDoc(vm.$el)
	  if (vm._isBlock) {
	    blockOp(vm, target, op, cb)
	  } else {
	    op(vm.$el, target, vm, cb)
	  }
	  if (shouldCallHook) {
	    vm._callHook('attached')
	  }
	  return vm
	}

	/**
	 * Execute a transition operation on a block instance,
	 * iterating through all its block nodes.
	 *
	 * @param {Vue} vm
	 * @param {Node} target
	 * @param {Function} op
	 * @param {Function} cb
	 */

	function blockOp (vm, target, op, cb) {
	  var current = vm._blockStart
	  var end = vm._blockEnd
	  var next
	  while (next !== end) {
	    next = current.nextSibling
	    op(current, target, vm)
	    current = next
	  }
	  op(end, target, vm, cb)
	}

	/**
	 * Check for selectors
	 *
	 * @param {String|Element} el
	 */

	function query (el) {
	  return typeof el === 'string'
	    ? document.querySelector(el)
	    : el
	}

	/**
	 * Append operation that takes a callback.
	 *
	 * @param {Node} el
	 * @param {Node} target
	 * @param {Vue} vm - unused
	 * @param {Function} [cb]
	 */

	function append (el, target, vm, cb) {
	  target.appendChild(el)
	  if (cb) cb()
	}

	/**
	 * InsertBefore operation that takes a callback.
	 *
	 * @param {Node} el
	 * @param {Node} target
	 * @param {Vue} vm - unused
	 * @param {Function} [cb]
	 */

	function before (el, target, vm, cb) {
	  _.before(el, target)
	  if (cb) cb()
	}

	/**
	 * Remove operation that takes a callback.
	 *
	 * @param {Node} el
	 * @param {Vue} vm - unused
	 * @param {Function} [cb]
	 */

	function remove (el, vm, cb) {
	  _.remove(el)
	  if (cb) cb()
	}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 */

	exports.$on = function (event, fn) {
	  (this._events[event] || (this._events[event] = []))
	    .push(fn)
	  modifyListenerCount(this, event, 1)
	  return this
	}

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 */

	exports.$once = function (event, fn) {
	  var self = this
	  function on () {
	    self.$off(event, on)
	    fn.apply(this, arguments)
	  }
	  on.fn = fn
	  this.$on(event, on)
	  return this
	}

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 */

	exports.$off = function (event, fn) {
	  var cbs
	  // all
	  if (!arguments.length) {
	    if (this.$parent) {
	      for (event in this._events) {
	        cbs = this._events[event]
	        if (cbs) {
	          modifyListenerCount(this, event, -cbs.length)
	        }
	      }
	    }
	    this._events = {}
	    return this
	  }
	  // specific event
	  cbs = this._events[event]
	  if (!cbs) {
	    return this
	  }
	  if (arguments.length === 1) {
	    modifyListenerCount(this, event, -cbs.length)
	    this._events[event] = null
	    return this
	  }
	  // specific handler
	  var cb
	  var i = cbs.length
	  while (i--) {
	    cb = cbs[i]
	    if (cb === fn || cb.fn === fn) {
	      modifyListenerCount(this, event, -1)
	      cbs.splice(i, 1)
	      break
	    }
	  }
	  return this
	}

	/**
	 * Trigger an event on self.
	 *
	 * @param {String} event
	 */

	exports.$emit = function (event) {
	  this._eventCancelled = false
	  var cbs = this._events[event]
	  if (cbs) {
	    // avoid leaking arguments:
	    // http://jsperf.com/closure-with-arguments
	    var i = arguments.length - 1
	    var args = new Array(i)
	    while (i--) {
	      args[i] = arguments[i + 1]
	    }
	    i = 0
	    cbs = cbs.length > 1
	      ? _.toArray(cbs)
	      : cbs
	    for (var l = cbs.length; i < l; i++) {
	      if (cbs[i].apply(this, args) === false) {
	        this._eventCancelled = true
	      }
	    }
	  }
	  return this
	}

	/**
	 * Recursively broadcast an event to all children instances.
	 *
	 * @param {String} event
	 * @param {...*} additional arguments
	 */

	exports.$broadcast = function (event) {
	  // if no child has registered for this event,
	  // then there's no need to broadcast.
	  if (!this._eventsCount[event]) return
	  var children = this._children
	  for (var i = 0, l = children.length; i < l; i++) {
	    var child = children[i]
	    child.$emit.apply(child, arguments)
	    if (!child._eventCancelled) {
	      child.$broadcast.apply(child, arguments)
	    }
	  }
	  return this
	}

	/**
	 * Recursively propagate an event up the parent chain.
	 *
	 * @param {String} event
	 * @param {...*} additional arguments
	 */

	exports.$dispatch = function () {
	  var parent = this.$parent
	  while (parent) {
	    parent.$emit.apply(parent, arguments)
	    parent = parent._eventCancelled
	      ? null
	      : parent.$parent
	  }
	  return this
	}

	/**
	 * Modify the listener counts on all parents.
	 * This bookkeeping allows $broadcast to return early when
	 * no child has listened to a certain event.
	 *
	 * @param {Vue} vm
	 * @param {String} event
	 * @param {Number} count
	 */

	var hookRE = /^hook:/
	function modifyListenerCount (vm, event, count) {
	  var parent = vm.$parent
	  // hooks do not get broadcasted so no need
	  // to do bookkeeping for them
	  if (!parent || !count || hookRE.test(event)) return
	  while (parent) {
	    parent._eventsCount[event] =
	      (parent._eventsCount[event] || 0) + count
	    parent = parent.$parent
	  }
	}

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)

	/**
	 * Create a child instance that prototypally inehrits
	 * data on parent. To achieve that we create an intermediate
	 * constructor with its prototype pointing to parent.
	 *
	 * @param {Object} opts
	 * @param {Function} [BaseCtor]
	 * @return {Vue}
	 * @public
	 */

	exports.$addChild = function (opts, BaseCtor) {
	  BaseCtor = BaseCtor || _.Vue
	  opts = opts || {}
	  var parent = this
	  var ChildVue
	  var inherit = opts.inherit !== undefined
	    ? opts.inherit
	    : BaseCtor.options.inherit
	  if (inherit) {
	    var ctors = parent._childCtors
	    ChildVue = ctors[BaseCtor.cid]
	    if (!ChildVue) {
	      var optionName = BaseCtor.options.name
	      var className = optionName
	        ? _.classify(optionName)
	        : 'VueComponent'
	      ChildVue = new Function(
	        'return function ' + className + ' (options) {' +
	        'this.constructor = ' + className + ';' +
	        'this._init(options) }'
	      )()
	      ChildVue.options = BaseCtor.options
	      ChildVue.prototype = this
	      ctors[BaseCtor.cid] = ChildVue
	    }
	  } else {
	    ChildVue = BaseCtor
	  }
	  opts._parent = parent
	  opts._root = parent.$root
	  var child = new ChildVue(opts)
	  return child
	}

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var compile = __webpack_require__(23)

	/**
	 * Set instance target element and kick off the compilation
	 * process. The passed in `el` can be a selector string, an
	 * existing Element, or a DocumentFragment (for block
	 * instances).
	 *
	 * @param {Element|DocumentFragment|string} el
	 * @public
	 */

	exports.$mount = function (el) {
	  if (this._isCompiled) {
	    _.warn('$mount() should be called only once.')
	    return
	  }
	  if (!el) {
	    el = document.createElement('div')
	  } else if (typeof el === 'string') {
	    var selector = el
	    el = document.querySelector(el)
	    if (!el) {
	      _.warn('Cannot find element: ' + selector)
	      return
	    }
	  }
	  this._compile(el)
	  this._isCompiled = true
	  this._callHook('compiled')
	  if (_.inDoc(this.$el)) {
	    this._callHook('attached')
	    this._initDOMHooks()
	    ready.call(this)
	  } else {
	    this._initDOMHooks()
	    this.$once('hook:attached', ready)
	  }
	  return this
	}

	/**
	 * Mark an instance as ready.
	 */

	function ready () {
	  this._isAttached = true
	  this._isReady = true
	  this._callHook('ready')
	}

	/**
	 * Teardown the instance, simply delegate to the internal
	 * _destroy.
	 */

	exports.$destroy = function (remove, deferCleanup) {
	  this._destroy(remove, deferCleanup)
	}

	/**
	 * Partially compile a piece of DOM and return a
	 * decompile function.
	 *
	 * @param {Element|DocumentFragment} el
	 * @return {Function}
	 */

	exports.$compile = function (el) {
	  return compile(el, this.$options, true)(this, el)
	}

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var Nuclear = __webpack_require__(64);

	/**
	 * VueJS mixin to bind to a NuclearJS reactor
	 *
	 * Usage:
	 *
	 * new Vue({
	 *   mixin: [NuclearVue(reactor)],
	 *
	 *   // implement to keep VM data in sync with reactor data
	 *   getDataBindings() {
	 *     return {
	 *       'user': 'currentUser',
	 *
	 *       // can reference deep paths in App State Map
	 *       'filters': 'ui.filters',
	 *       // or by array 'filters': ['ui', 'filters'],
	 *     }
	 *   }
	 * })
	 */
	module.exports = function(reactor, isLazy) {
	  return {
	    created: function() {
	      if (!reactor) {
	        throw new Error("Must supply reactor to ViewModel")
	      }

	      if (!this.__reactorUnwatchFns) {
	        this.__reactorUnwatchFns = {}
	      }

	      if (this.$options.getDataBindings) {
	        each(this.$options.getDataBindings(), function(reactorKeyPath, vmProp) {
	          this.$sync(vmProp, reactorKeyPath)
	        }.bind(this))
	      }
	    },
	    attached: function() {
	      if(isLazy && !this.__dataBinded) {
	        this.$bind();
	      }
	    },
	    detached: function(){
	      if(isLazy && this.__dataBinded){
	        this.$unBind();
	      }
	    },
	    beforeDestroy: function(){
	      this.$unBind();
	    },
	    methods: {
	      
	      /**
	       * Bind all data returned by datDataBindings, if present
	       */
	      $bind: function(){
	        var $options = this.$options || {};
	        if ($options.getDataBindings && typeof $options.getDataBindings === 'function') {
	          each($options.getDataBindings(), function(reactorKeyPath, vmProp)  {
	            this.$sync(vmProp, reactorKeyPath);
	          }.bind(this));
	          this.__dataBinded = true;
	        }
	      },

	      /**
	       * Remove binding from all binded data
	       */
	      $unbind: function(){
	        if (this.__reactorUnwatchFns) {
	          each(this.__reactorUnwatchFns, function(fn)  {return fn();});
	          this.__reactorUnwatchFns = {};
	          this.__dataBinded = false;
	        }
	      },

	      /**
	       * Syncs a reactor.get(getter) value with a vm data property
	       * @param {string} vmProp
	       * @param {Getter|KeyPath} getter
	       */
	      $sync: function(vmProp, getter) {
	        if (!this.__reactorUnwatchFns) {
	          // check here because $sync can be called in `created` before the mixins created
	          this.__reactorUnwatchFns = {}
	        }

	        if (this.__reactorUnwatchFns[vmProp]) {
	          // already a watcher, unwatch
	          this.__reactorUnwatchFns[vmProp]()
	        }

	        if (!(Nuclear.isGetter(getter) || Nuclear.isKeyPath(getter))) {
	          console.warn('Must supply a KeyPath or Getter to getDataBindings()')
	          return
	        }

	        this.$set(vmProp, reactor.evaluateToJS(getter))
	        // setup the data observation
	        this.__reactorUnwatchFns[vmProp] = reactor.observe(getter, function(val) {
	          this.$set(vmProp, Nuclear.toJS(val))
	        }.bind(this))
	      },

	      /**
	       * Unysync reactor observation for a vmProp
	       * @param {string} vmProp
	       */
	      $unsync: function(vmProp) {
	        var unsyncFn = this.__reactorUnwatchFns[vmProp]
	        if (unsyncFn) {
	          unsyncFn()
	          delete this.__reactorUnwatchFns[vmProp]
	        }
	      }
	    }
	  }
	}

	function each(obj, fn) {
	  for (var key in obj) {
	    fn(obj[key], key)
	  }
	}


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define(factory);
		else if(typeof exports === 'object')
			exports["Nuclear"] = factory();
		else
			root["Nuclear"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}


	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		var helpers = __webpack_require__(1)

		/**
		 * @return {Reactor}
		 */
		exports.Reactor = __webpack_require__(2)

		/**
		 * @return {Store}
		 */
		exports.Store = __webpack_require__(3)

		// export the immutable library
		exports.Immutable = __webpack_require__(7)

		/**
		 * @return {boolean}
		 */
		exports.isKeyPath = __webpack_require__(4).isKeyPath

		/**
		 * @return {boolean}
		 */
		exports.isGetter = __webpack_require__(5).isGetter

		// expose helper functions
		exports.toJS = helpers.toJS
		exports.toImmutable = helpers.toImmutable
		exports.isImmutable = helpers.isImmutable

		exports.createReactMixin = __webpack_require__(6)


	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		var Immutable = __webpack_require__(7)
		var isObject = __webpack_require__(8).isObject

		/**
		 * A collection of helpers for the ImmutableJS library
		 */

		/**
		 * @param {*} obj
		 * @return {boolean}
		 */
		function isImmutable(obj) {
		  return Immutable.Iterable.isIterable(obj)
		}

		/**
		 * Returns true if the value is an ImmutableJS data structure
		 * or a javascript primitive that is immutable (stirng, number, etc)
		 * @param {*} obj
		 * @return {boolean}
		 */
		function isImmutableValue(obj) {
		  return (
		    isImmutable(obj) ||
		    !isObject(obj)
		  )
		}

		/**
		 * Converts an Immutable Sequence to JS object
		 * Can be called on any type
		 */
		function toJS(arg) {
		  // arg instanceof Immutable.Sequence is unreleable
		  return (isImmutable(arg))
		    ? arg.toJS()
		    : arg;
		}

		/**
		 * Converts a JS object to an Immutable object, if it's
		 * already Immutable its a no-op
		 */
		function toImmutable(arg) {
		  return (isImmutable(arg))
		    ? arg
		    : Immutable.fromJS(arg)
		}

		exports.toJS = toJS
		exports.toImmutable = toImmutable
		exports.isImmutable = isImmutable
		exports.isImmutableValue = isImmutableValue


	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		var Immutable = __webpack_require__(7)
		var logging = __webpack_require__(9)
		var ChangeObserver = __webpack_require__(10)
		var Getter = __webpack_require__(5)
		var KeyPath = __webpack_require__(4)
		var Evaluator = __webpack_require__(11)
		var createReactMixin = __webpack_require__(6)

		// helper fns
		var toJS = __webpack_require__(1).toJS
		var isImmutableValue = __webpack_require__(1).isImmutableValue
		var each = __webpack_require__(8).each


		/**
		 * In Nuclear Reactors are where state is stored.  Reactors
		 * contain a "state" object which is an Immutable.Map
		 *
		 * The only way Reactors can change state is by reacting to
		 * messages.  To update staet, Reactor's dispatch messages to
		 * all registered cores, and the core returns it's new
		 * state based on the message
		 */

		  function Reactor(config) {"use strict";
		    if (!(this instanceof Reactor)) {
		      return new Reactor(config)
		    }
		    config = config || {}

		    this.debug = !!config.debug

		    this.ReactMixin = createReactMixin(this)
		    /**
		     * The state for the whole cluster
		     */
		    this.__state = Immutable.Map({})
		    /**
		     * Holds a map of id => reactor instance
		     */
		    this.__stores = Immutable.Map({})

		    this.__evaluator = new Evaluator()
		    /**
		     * Change observer interface to observe certain keypaths
		     * Created after __initialize so it starts with initialState
		     */
		    this.__changeObserver = new ChangeObserver(this.__state, this.__evaluator)
		  }

		  /**
		   * Evaluates a KeyPath or Getter in context of the reactor state
		   * @param {KeyPath|Getter} keyPathOrGetter
		   * @return {*}
		   */
		  Reactor.prototype.evaluate=function(keyPathOrGetter) {"use strict";
		    return this.__evaluator.evaluate(this.__state, keyPathOrGetter)
		  };

		  /**
		   * Gets the coerced state (to JS object) of the reactor.evaluate
		   * @param {KeyPath|Getter} keyPathOrGetter
		   * @return {*}
		   */
		  Reactor.prototype.evaluateToJS=function(keyPathOrGetter) {"use strict";
		    return toJS(this.evaluate(keyPathOrGetter))
		  };

		  /**
		   * Adds a change observer whenever a certain part of the reactor state changes
		   *
		   * 1. observe(handlerFn) - 1 argument, called anytime reactor.state changes
		   * 2. observe(keyPath, handlerFn) same as above
		   * 3. observe(getter, handlerFn) called whenever any getter dependencies change with
		   *    the value of the getter
		   *
		   * Adds a change handler whenever certain deps change
		   * If only one argument is passed invoked the handler whenever
		   * the reactor state changes
		   *
		   * @param {KeyPath|Getter} getter
		   * @param {function} handler
		   * @return {function} unwatch function
		   */
		  Reactor.prototype.observe=function(getter, handler) {"use strict";
		    if (arguments.length === 1) {
		      handler = getter
		      getter = Getter.fromKeyPath([])
		    } else if (KeyPath.isKeyPath(getter)) {
		      getter = Getter.fromKeyPath(getter)
		    }
		    return this.__changeObserver.onChange(getter, handler)
		  };


		  /**
		   * Dispatches a single message
		   * @param {string} actionType
		   * @param {object|undefined} payload
		   */
		  Reactor.prototype.dispatch=function(actionType, payload) {"use strict";
		    var debug = this.debug
		    var prevState = this.__state

		    this.__state = this.__state.withMutations(function(state)  {
		      if (this.debug) {
		        logging.dispatchStart(actionType, payload)
		      }

		      // let each core handle the message
		      this.__stores.forEach(function(store, id)  {
		        var currState = state.get(id)
		        var newState = store.handle(currState, actionType, payload)

		        if (debug && newState === undefined) {
		          var error = "Store handler must return a value, did you forget a return statement"
		          logging.dispatchError(error)
		          throw new Error(error)
		        }

		        state.set(id, newState)

		        if (this.debug) {
		          logging.storeHandled(id, currState, newState)
		        }
		      }.bind(this))

		      if (this.debug) {
		        logging.dispatchEnd(state)
		      }
		    }.bind(this))

		    // write the new state to the output stream if changed
		    if (this.__state !== prevState) {
		      this.__changeObserver.notifyObservers(this.__state)
		    }
		  };

		  /**
		   * @deprecated
		   * @param {String} id
		   * @param {Store} store
		   */
		  Reactor.prototype.registerStore=function(id, store) {"use strict";
		    console.warn('Deprecation warning: `registerStore` will no longer be supported in 1.1, use `registerStores` instead')
		    var stores = {}
		    stores[id] = store
		    this.registerStores(stores)
		  };

		  /**
		   * @param {Store[]} stores
		   */
		  Reactor.prototype.registerStores=function(stores) {"use strict";
		    each(stores, function(store, id)  {
		      if (this.__stores.get(id)) {
		        console.warn("Store already defined for id=" + id)
		      }

		      var initialState = store.getInitialState()

		      if (this.debug && !isImmutableValue(initialState)) {
		        throw new Error("Store getInitialState() must return an immutable value, did you forget to call toImmutable")
		      }

		      this.__stores = this.__stores.set(id, store)
		      this.__state = this.__state.set(id, initialState)
		    }.bind(this))

		    this.__changeObserver.notifyObservers(this.__state)
		  };

		  /**
		   * Resets the state of a reactor and returns back to initial state
		   */
		  Reactor.prototype.reset=function() {"use strict";
		    var debug = this.debug
		    var prevState = this.__state

		    this.__state = Immutable.Map().withMutations(function(state)  {
		      this.__stores.forEach(function(store, id)  {
		        var storeState = prevState.get(id)
		        var resetStoreState = store.handleReset(storeState)
		        if (debug && resetStoreState === undefined) {
		          throw new Error("Store handleReset() must return a value, did you forget a return statement")
		        }
		        if (debug && !isImmutableValue(resetStoreState)) {
		          throw new Error("Store reset state must be an immutable value, did you forget to call toImmutable")
		        }
		        state.set(id, resetStoreState)
		      })
		    }.bind(this))

		    this.__evaluator.reset()
		    this.__changeObserver.reset(this.__state)
		  };


		module.exports = Reactor


	/***/ },
	/* 3 */
	/***/ function(module, exports, __webpack_require__) {

		var Map = __webpack_require__(7).Map
		var extend = __webpack_require__(8).extend

		/**
		 * Stores define how a certain domain of the application should respond to actions
		 * taken on the whole system.  They manage their own section of the entire app state
		 * and have no knowledge about the other parts of the application state.
		 */

		  function Store(config) {"use strict";
		    if (!(this instanceof Store)) {
		      return new Store(config)
		    }

		    this.__handlers = Map({})

		    if (config) {
		      // allow `MyStore extends Store` syntax without throwing error
		      extend(this, config)
		    }

		    this.initialize()
		  }

		  /**
		   * This method is overriden by extending classses to setup message handlers
		   * via `this.on` and to set up the initial state
		   *
		   * Anything returned from this function will be coerced into an ImmutableJS value
		   * and set as the initial state for the part of the ReactorCore
		   */
		  Store.prototype.initialize=function() {"use strict";
		    // extending classes implement to setup action handlers
		  };

		  /**
		   * Overridable method to get the initial state for this type of store
		   */
		  Store.prototype.getInitialState=function() {"use strict";
		    return Map()
		  };

		  /**
		   * Takes a current reactor state, action type and payload
		   * does the reaction and returns the new state
		   */
		  Store.prototype.handle=function(state, type, payload) {"use strict";
		    var handler = this.__handlers.get(type)

		    if (typeof handler === 'function') {
		      return handler.call(this, state, payload, type)
		    }

		    return state
		  };

		  /**
		   * Pure function taking the current state of store and returning
		   * the new state after a Nuclear reactor has been reset
		   *
		   * Overridable
		   */
		  Store.prototype.handleReset=function(state) {"use strict";
		    return this.getInitialState()
		  };

		  /**
		   * Binds an action type => handler
		   */
		  Store.prototype.on=function(actionType, handler) {"use strict";
		    this.__handlers = this.__handlers.set(actionType, handler)
		  };


		function isStore(toTest) {
		  return (toTest instanceof Store)
		}

		module.exports = Store

		module.exports.isStore = isStore


	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {

		var isArray = __webpack_require__(8).isArray
		var isFunction = __webpack_require__(8).isFunction

		/**
		 * Checks if something is simply a keyPath and not a getter
		 * @param {*} toTest
		 * @return {boolean}
		 */
		exports.isKeyPath = function(toTest) {
		  return (
		    isArray(toTest) &&
		    !isFunction(toTest[toTest.length - 1])
		  )
		}


	/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {

		var Immutable = __webpack_require__(7)
		var isFunction = __webpack_require__(8).isFunction
		var isArray = __webpack_require__(8).isArray
		var isKeyPath = __webpack_require__(4).isKeyPath

		/**
		 * Getter helper functions
		 * A getter is an array with the form:
		 * [<KeyPath>, ...<KeyPath>, <function>]
		 */
		var identity = function(x)  {return x;}

		/**
		 * Checks if something is a getter literal, ex: ['dep1', 'dep2', function(dep1, dep2) {...}]
		 * @param {*} toTest
		 * @return {boolean}
		 */
		function isGetter(toTest) {
		  return (isArray(toTest) && isFunction(toTest[toTest.length - 1]))
		}

		/**
		 * Returns the compute function from a getter
		 * @param {Getter} getter
		 * @return {function}
		 */
		function getComputeFn(getter) {
		  return getter[getter.length - 1]
		}

		/**
		 * Returns an array of deps from a getter
		 * @param {Getter} getter
		 * @return {function}
		 */
		function getDeps(getter) {
		  return getter.slice(0, getter.length - 1)
		}

		/**
		 * @param {KeyPath}
		 * @return {Getter}
		 */
		function fromKeyPath(keyPath) {
		  if (!isKeyPath(keyPath)) {
		    throw new Error("Cannot create Getter from KeyPath: " + keyPath)
		  }

		  return [keyPath, identity]
		}


		module.exports = {
		  isGetter: isGetter,
		  getComputeFn: getComputeFn,
		  getDeps: getDeps,
		  fromKeyPath: fromKeyPath,
		}


	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {

		var each = __webpack_require__(8).each
		/**
		 * @param {Reactor} reactor
		 */
		module.exports = function(reactor) {
		  return {
		    getInitialState: function() {
		      return getState(reactor, this.getDataBindings())
		    },

		    componentDidMount: function() {
		      var component = this
		      component.__unwatchFns = []
		      each(this.getDataBindings(), function(getter, key) {
		        var unwatchFn = reactor.observe(getter, function(val) {
		          var newState = {};
		          newState[key] = val;
		          component.setState(newState)
		        })

		        component.__unwatchFns.push(unwatchFn)
		      })
		    },

		    componentWillUnmount: function() {
		      while (this.__unwatchFns.length) {
		        this.__unwatchFns.shift()()
		      }
		    }
		  }
		}

		/**
		 * Returns a mapping of the getDataBinding keys to
		 * the reactor values
		 */
		function getState(reactor, data) {
		  var state = {}
		  for (var key in data) {
		    state[key] = reactor.evaluate(data[key])
		  }
		  return state
		}


	/***/ },
	/* 7 */
	/***/ function(module, exports, __webpack_require__) {

		/**
		 *  Copyright (c) 2014, Facebook, Inc.
		 *  All rights reserved.
		 *
		 *  This source code is licensed under the BSD-style license found in the
		 *  LICENSE file in the root directory of this source tree. An additional grant
		 *  of patent rights can be found in the PATENTS file in the same directory.
		 */
		function universalModule() {
		  var $Object = Object;

		function createClass(ctor, methods, staticMethods, superClass) {
		  var proto;
		  if (superClass) {
		    var superProto = superClass.prototype;
		    proto = $Object.create(superProto);
		  } else {
		    proto = ctor.prototype;
		  }
		  $Object.keys(methods).forEach(function (key) {
		    proto[key] = methods[key];
		  });
		  $Object.keys(staticMethods).forEach(function (key) {
		    ctor[key] = staticMethods[key];
		  });
		  proto.constructor = ctor;
		  ctor.prototype = proto;
		  return ctor;
		}

		function superCall(self, proto, name, args) {
		  return $Object.getPrototypeOf(proto)[name].apply(self, args);
		}

		function defaultSuperCall(self, proto, args) {
		  superCall(self, proto, 'constructor', args);
		}

		var $traceurRuntime = {};
		$traceurRuntime.createClass = createClass;
		$traceurRuntime.superCall = superCall;
		$traceurRuntime.defaultSuperCall = defaultSuperCall;
		"use strict";
		function is(valueA, valueB) {
		  if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
		    return true;
		  }
		  if (!valueA || !valueB) {
		    return false;
		  }
		  if (typeof valueA.valueOf === 'function' && typeof valueB.valueOf === 'function') {
		    valueA = valueA.valueOf();
		    valueB = valueB.valueOf();
		  }
		  return typeof valueA.equals === 'function' && typeof valueB.equals === 'function' ? valueA.equals(valueB) : valueA === valueB || (valueA !== valueA && valueB !== valueB);
		}
		function invariant(condition, error) {
		  if (!condition)
		    throw new Error(error);
		}
		var DELETE = 'delete';
		var SHIFT = 5;
		var SIZE = 1 << SHIFT;
		var MASK = SIZE - 1;
		var NOT_SET = {};
		var CHANGE_LENGTH = {value: false};
		var DID_ALTER = {value: false};
		function MakeRef(ref) {
		  ref.value = false;
		  return ref;
		}
		function SetRef(ref) {
		  ref && (ref.value = true);
		}
		function OwnerID() {}
		function arrCopy(arr, offset) {
		  offset = offset || 0;
		  var len = Math.max(0, arr.length - offset);
		  var newArr = new Array(len);
		  for (var ii = 0; ii < len; ii++) {
		    newArr[ii] = arr[ii + offset];
		  }
		  return newArr;
		}
		function assertNotInfinite(size) {
		  invariant(size !== Infinity, 'Cannot perform this action with an infinite size.');
		}
		function ensureSize(iter) {
		  if (iter.size === undefined) {
		    iter.size = iter.__iterate(returnTrue);
		  }
		  return iter.size;
		}
		function wrapIndex(iter, index) {
		  return index >= 0 ? (+index) : ensureSize(iter) + (+index);
		}
		function returnTrue() {
		  return true;
		}
		function wholeSlice(begin, end, size) {
		  return (begin === 0 || (size !== undefined && begin <= -size)) && (end === undefined || (size !== undefined && end >= size));
		}
		function resolveBegin(begin, size) {
		  return resolveIndex(begin, size, 0);
		}
		function resolveEnd(end, size) {
		  return resolveIndex(end, size, size);
		}
		function resolveIndex(index, size, defaultIndex) {
		  return index === undefined ? defaultIndex : index < 0 ? Math.max(0, size + index) : size === undefined ? index : Math.min(size, index);
		}
		var imul = typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ? Math.imul : function imul(a, b) {
		  a = a | 0;
		  b = b | 0;
		  var c = a & 0xffff;
		  var d = b & 0xffff;
		  return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0;
		};
		function smi(i32) {
		  return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
		}
		function hash(o) {
		  if (o === false || o === null || o === undefined) {
		    return 0;
		  }
		  if (typeof o.valueOf === 'function') {
		    o = o.valueOf();
		    if (o === false || o === null || o === undefined) {
		      return 0;
		    }
		  }
		  if (o === true) {
		    return 1;
		  }
		  var type = typeof o;
		  if (type === 'number') {
		    var h = o | 0;
		    while (o > 0xFFFFFFFF) {
		      o /= 0xFFFFFFFF;
		      h ^= o;
		    }
		    return smi(h);
		  }
		  if (type === 'string') {
		    return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
		  }
		  if (typeof o.hashCode === 'function') {
		    return o.hashCode();
		  }
		  return hashJSObj(o);
		}
		function cachedHashString(string) {
		  var hash = stringHashCache[string];
		  if (hash === undefined) {
		    hash = hashString(string);
		    if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
		      STRING_HASH_CACHE_SIZE = 0;
		      stringHashCache = {};
		    }
		    STRING_HASH_CACHE_SIZE++;
		    stringHashCache[string] = hash;
		  }
		  return hash;
		}
		function hashString(string) {
		  var hash = 0;
		  for (var ii = 0; ii < string.length; ii++) {
		    hash = 31 * hash + string.charCodeAt(ii) | 0;
		  }
		  return smi(hash);
		}
		function hashJSObj(obj) {
		  var hash = weakMap && weakMap.get(obj);
		  if (hash)
		    return hash;
		  hash = obj[UID_HASH_KEY];
		  if (hash)
		    return hash;
		  if (!canDefineProperty) {
		    hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
		    if (hash)
		      return hash;
		    hash = getIENodeHash(obj);
		    if (hash)
		      return hash;
		  }
		  if (Object.isExtensible && !Object.isExtensible(obj)) {
		    throw new Error('Non-extensible objects are not allowed as keys.');
		  }
		  hash = ++objHashUID;
		  if (objHashUID & 0x40000000) {
		    objHashUID = 0;
		  }
		  if (weakMap) {
		    weakMap.set(obj, hash);
		  } else if (canDefineProperty) {
		    Object.defineProperty(obj, UID_HASH_KEY, {
		      'enumerable': false,
		      'configurable': false,
		      'writable': false,
		      'value': hash
		    });
		  } else if (obj.propertyIsEnumerable && obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
		    obj.propertyIsEnumerable = function() {
		      return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
		    };
		    obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
		  } else if (obj.nodeType) {
		    obj[UID_HASH_KEY] = hash;
		  } else {
		    throw new Error('Unable to set a non-enumerable property on object.');
		  }
		  return hash;
		}
		var canDefineProperty = (function() {
		  try {
		    Object.defineProperty({}, 'x', {});
		    return true;
		  } catch (e) {
		    return false;
		  }
		}());
		function getIENodeHash(node) {
		  if (node && node.nodeType > 0) {
		    switch (node.nodeType) {
		      case 1:
		        return node.uniqueID;
		      case 9:
		        return node.documentElement && node.documentElement.uniqueID;
		    }
		  }
		}
		var weakMap = typeof WeakMap === 'function' && new WeakMap();
		var objHashUID = 0;
		var UID_HASH_KEY = '__immutablehash__';
		if (typeof Symbol === 'function') {
		  UID_HASH_KEY = Symbol(UID_HASH_KEY);
		}
		var STRING_HASH_CACHE_MIN_STRLEN = 16;
		var STRING_HASH_CACHE_MAX_SIZE = 255;
		var STRING_HASH_CACHE_SIZE = 0;
		var stringHashCache = {};
		var ITERATE_KEYS = 0;
		var ITERATE_VALUES = 1;
		var ITERATE_ENTRIES = 2;
		var FAUX_ITERATOR_SYMBOL = '@@iterator';
		var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
		var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;
		var Iterator = function Iterator(next) {
		  this.next = next;
		};
		($traceurRuntime.createClass)(Iterator, {toString: function() {
		    return '[Iterator]';
		  }}, {});
		Iterator.KEYS = ITERATE_KEYS;
		Iterator.VALUES = ITERATE_VALUES;
		Iterator.ENTRIES = ITERATE_ENTRIES;
		var IteratorPrototype = Iterator.prototype;
		IteratorPrototype.inspect = IteratorPrototype.toSource = function() {
		  return this.toString();
		};
		IteratorPrototype[ITERATOR_SYMBOL] = function() {
		  return this;
		};
		function iteratorValue(type, k, v, iteratorResult) {
		  var value = type === 0 ? k : type === 1 ? v : [k, v];
		  iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
		    value: value,
		    done: false
		  });
		  return iteratorResult;
		}
		function iteratorDone() {
		  return {
		    value: undefined,
		    done: true
		  };
		}
		function hasIterator(maybeIterable) {
		  return !!_iteratorFn(maybeIterable);
		}
		function isIterator(maybeIterator) {
		  return maybeIterator && typeof maybeIterator.next === 'function';
		}
		function getIterator(iterable) {
		  var iteratorFn = _iteratorFn(iterable);
		  return iteratorFn && iteratorFn.call(iterable);
		}
		function _iteratorFn(iterable) {
		  var iteratorFn = iterable && ((REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) || iterable[FAUX_ITERATOR_SYMBOL]);
		  if (typeof iteratorFn === 'function') {
		    return iteratorFn;
		  }
		}
		var Iterable = function Iterable(value) {
		  return isIterable(value) ? value : Seq(value);
		};
		var $Iterable = Iterable;
		($traceurRuntime.createClass)(Iterable, {
		  toArray: function() {
		    assertNotInfinite(this.size);
		    var array = new Array(this.size || 0);
		    this.valueSeq().__iterate((function(v, i) {
		      array[i] = v;
		    }));
		    return array;
		  },
		  toIndexedSeq: function() {
		    return new ToIndexedSequence(this);
		  },
		  toJS: function() {
		    return this.toSeq().map((function(value) {
		      return value && typeof value.toJS === 'function' ? value.toJS() : value;
		    })).__toJS();
		  },
		  toKeyedSeq: function() {
		    return new ToKeyedSequence(this, true);
		  },
		  toMap: function() {
		    return Map(this.toKeyedSeq());
		  },
		  toObject: function() {
		    assertNotInfinite(this.size);
		    var object = {};
		    this.__iterate((function(v, k) {
		      object[k] = v;
		    }));
		    return object;
		  },
		  toOrderedMap: function() {
		    return OrderedMap(this.toKeyedSeq());
		  },
		  toOrderedSet: function() {
		    return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
		  },
		  toSet: function() {
		    return Set(isKeyed(this) ? this.valueSeq() : this);
		  },
		  toSetSeq: function() {
		    return new ToSetSequence(this);
		  },
		  toSeq: function() {
		    return isIndexed(this) ? this.toIndexedSeq() : isKeyed(this) ? this.toKeyedSeq() : this.toSetSeq();
		  },
		  toStack: function() {
		    return Stack(isKeyed(this) ? this.valueSeq() : this);
		  },
		  toList: function() {
		    return List(isKeyed(this) ? this.valueSeq() : this);
		  },
		  toString: function() {
		    return '[Iterable]';
		  },
		  __toString: function(head, tail) {
		    if (this.size === 0) {
		      return head + tail;
		    }
		    return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
		  },
		  concat: function() {
		    for (var values = [],
		        $__2 = 0; $__2 < arguments.length; $__2++)
		      values[$__2] = arguments[$__2];
		    return reify(this, concatFactory(this, values));
		  },
		  contains: function(searchValue) {
		    return this.some((function(value) {
		      return is(value, searchValue);
		    }));
		  },
		  entries: function() {
		    return this.__iterator(ITERATE_ENTRIES);
		  },
		  every: function(predicate, context) {
		    assertNotInfinite(this.size);
		    var returnValue = true;
		    this.__iterate((function(v, k, c) {
		      if (!predicate.call(context, v, k, c)) {
		        returnValue = false;
		        return false;
		      }
		    }));
		    return returnValue;
		  },
		  filter: function(predicate, context) {
		    return reify(this, filterFactory(this, predicate, context, true));
		  },
		  find: function(predicate, context, notSetValue) {
		    var foundValue = notSetValue;
		    this.__iterate((function(v, k, c) {
		      if (predicate.call(context, v, k, c)) {
		        foundValue = v;
		        return false;
		      }
		    }));
		    return foundValue;
		  },
		  forEach: function(sideEffect, context) {
		    assertNotInfinite(this.size);
		    return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
		  },
		  join: function(separator) {
		    assertNotInfinite(this.size);
		    separator = separator !== undefined ? '' + separator : ',';
		    var joined = '';
		    var isFirst = true;
		    this.__iterate((function(v) {
		      isFirst ? (isFirst = false) : (joined += separator);
		      joined += v !== null && v !== undefined ? v : '';
		    }));
		    return joined;
		  },
		  keys: function() {
		    return this.__iterator(ITERATE_KEYS);
		  },
		  map: function(mapper, context) {
		    return reify(this, mapFactory(this, mapper, context));
		  },
		  reduce: function(reducer, initialReduction, context) {
		    assertNotInfinite(this.size);
		    var reduction;
		    var useFirst;
		    if (arguments.length < 2) {
		      useFirst = true;
		    } else {
		      reduction = initialReduction;
		    }
		    this.__iterate((function(v, k, c) {
		      if (useFirst) {
		        useFirst = false;
		        reduction = v;
		      } else {
		        reduction = reducer.call(context, reduction, v, k, c);
		      }
		    }));
		    return reduction;
		  },
		  reduceRight: function(reducer, initialReduction, context) {
		    var reversed = this.toKeyedSeq().reverse();
		    return reversed.reduce.apply(reversed, arguments);
		  },
		  reverse: function() {
		    return reify(this, reverseFactory(this, true));
		  },
		  slice: function(begin, end) {
		    if (wholeSlice(begin, end, this.size)) {
		      return this;
		    }
		    var resolvedBegin = resolveBegin(begin, this.size);
		    var resolvedEnd = resolveEnd(end, this.size);
		    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
		      return this.toSeq().cacheResult().slice(begin, end);
		    }
		    var skipped = resolvedBegin === 0 ? this : this.skip(resolvedBegin);
		    return reify(this, resolvedEnd === undefined || resolvedEnd === this.size ? skipped : skipped.take(resolvedEnd - resolvedBegin));
		  },
		  some: function(predicate, context) {
		    return !this.every(not(predicate), context);
		  },
		  sort: function(comparator) {
		    return reify(this, sortFactory(this, comparator));
		  },
		  values: function() {
		    return this.__iterator(ITERATE_VALUES);
		  },
		  butLast: function() {
		    return this.slice(0, -1);
		  },
		  count: function(predicate, context) {
		    return ensureSize(predicate ? this.toSeq().filter(predicate, context) : this);
		  },
		  countBy: function(grouper, context) {
		    return countByFactory(this, grouper, context);
		  },
		  equals: function(other) {
		    return deepEqual(this, other);
		  },
		  entrySeq: function() {
		    var iterable = this;
		    if (iterable._cache) {
		      return new ArraySeq(iterable._cache);
		    }
		    var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
		    entriesSequence.fromEntrySeq = (function() {
		      return iterable.toSeq();
		    });
		    return entriesSequence;
		  },
		  filterNot: function(predicate, context) {
		    return this.filter(not(predicate), context);
		  },
		  findLast: function(predicate, context, notSetValue) {
		    return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
		  },
		  first: function() {
		    return this.find(returnTrue);
		  },
		  flatMap: function(mapper, context) {
		    return reify(this, flatMapFactory(this, mapper, context));
		  },
		  flatten: function(depth) {
		    return reify(this, flattenFactory(this, depth, true));
		  },
		  fromEntrySeq: function() {
		    return new FromEntriesSequence(this);
		  },
		  get: function(searchKey, notSetValue) {
		    return this.find((function(_, key) {
		      return is(key, searchKey);
		    }), undefined, notSetValue);
		  },
		  getIn: function(searchKeyPath, notSetValue) {
		    var nested = this;
		    if (searchKeyPath) {
		      var iter = getIterator(searchKeyPath) || getIterator($Iterable(searchKeyPath));
		      var step;
		      while (!(step = iter.next()).done) {
		        var key = step.value;
		        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
		        if (nested === NOT_SET) {
		          return notSetValue;
		        }
		      }
		    }
		    return nested;
		  },
		  groupBy: function(grouper, context) {
		    return groupByFactory(this, grouper, context);
		  },
		  has: function(searchKey) {
		    return this.get(searchKey, NOT_SET) !== NOT_SET;
		  },
		  hasIn: function(searchKeyPath) {
		    return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
		  },
		  isSubset: function(iter) {
		    iter = typeof iter.contains === 'function' ? iter : $Iterable(iter);
		    return this.every((function(value) {
		      return iter.contains(value);
		    }));
		  },
		  isSuperset: function(iter) {
		    return iter.isSubset(this);
		  },
		  keySeq: function() {
		    return this.toSeq().map(keyMapper).toIndexedSeq();
		  },
		  last: function() {
		    return this.toSeq().reverse().first();
		  },
		  max: function(comparator) {
		    return maxFactory(this, comparator);
		  },
		  maxBy: function(mapper, comparator) {
		    return maxFactory(this, comparator, mapper);
		  },
		  min: function(comparator) {
		    return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
		  },
		  minBy: function(mapper, comparator) {
		    return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
		  },
		  rest: function() {
		    return this.slice(1);
		  },
		  skip: function(amount) {
		    return reify(this, skipFactory(this, amount, true));
		  },
		  skipLast: function(amount) {
		    return reify(this, this.toSeq().reverse().skip(amount).reverse());
		  },
		  skipWhile: function(predicate, context) {
		    return reify(this, skipWhileFactory(this, predicate, context, true));
		  },
		  skipUntil: function(predicate, context) {
		    return this.skipWhile(not(predicate), context);
		  },
		  sortBy: function(mapper, comparator) {
		    return reify(this, sortFactory(this, comparator, mapper));
		  },
		  take: function(amount) {
		    return reify(this, takeFactory(this, amount));
		  },
		  takeLast: function(amount) {
		    return reify(this, this.toSeq().reverse().take(amount).reverse());
		  },
		  takeWhile: function(predicate, context) {
		    return reify(this, takeWhileFactory(this, predicate, context));
		  },
		  takeUntil: function(predicate, context) {
		    return this.takeWhile(not(predicate), context);
		  },
		  valueSeq: function() {
		    return this.toIndexedSeq();
		  },
		  hashCode: function() {
		    return this.__hash || (this.__hash = hashIterable(this));
		  }
		}, {});
		var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
		var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
		var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
		var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
		var IterablePrototype = Iterable.prototype;
		IterablePrototype[IS_ITERABLE_SENTINEL] = true;
		IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
		IterablePrototype.toJSON = IterablePrototype.toJS;
		IterablePrototype.__toJS = IterablePrototype.toArray;
		IterablePrototype.__toStringMapper = quoteString;
		IterablePrototype.inspect = IterablePrototype.toSource = function() {
		  return this.toString();
		};
		IterablePrototype.chain = IterablePrototype.flatMap;
		(function() {
		  try {
		    Object.defineProperty(IterablePrototype, 'length', {get: function() {
		        if (!Iterable.noLengthWarning) {
		          var stack;
		          try {
		            throw new Error();
		          } catch (error) {
		            stack = error.stack;
		          }
		          if (stack.indexOf('_wrapObject') === -1) {
		            console && console.warn && console.warn('iterable.length has been deprecated, ' + 'use iterable.size or iterable.count(). ' + 'This warning will become a silent error in a future version. ' + stack);
		            return this.size;
		          }
		        }
		      }});
		  } catch (e) {}
		})();
		var KeyedIterable = function KeyedIterable(value) {
		  return isKeyed(value) ? value : KeyedSeq(value);
		};
		($traceurRuntime.createClass)(KeyedIterable, {
		  flip: function() {
		    return reify(this, flipFactory(this));
		  },
		  findKey: function(predicate, context) {
		    var foundKey;
		    this.__iterate((function(v, k, c) {
		      if (predicate.call(context, v, k, c)) {
		        foundKey = k;
		        return false;
		      }
		    }));
		    return foundKey;
		  },
		  findLastKey: function(predicate, context) {
		    return this.toSeq().reverse().findKey(predicate, context);
		  },
		  keyOf: function(searchValue) {
		    return this.findKey((function(value) {
		      return is(value, searchValue);
		    }));
		  },
		  lastKeyOf: function(searchValue) {
		    return this.toSeq().reverse().keyOf(searchValue);
		  },
		  mapEntries: function(mapper, context) {
		    var $__0 = this;
		    var iterations = 0;
		    return reify(this, this.toSeq().map((function(v, k) {
		      return mapper.call(context, [k, v], iterations++, $__0);
		    })).fromEntrySeq());
		  },
		  mapKeys: function(mapper, context) {
		    var $__0 = this;
		    return reify(this, this.toSeq().flip().map((function(k, v) {
		      return mapper.call(context, k, v, $__0);
		    })).flip());
		  }
		}, {}, Iterable);
		var KeyedIterablePrototype = KeyedIterable.prototype;
		KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
		KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
		KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
		KeyedIterablePrototype.__toStringMapper = (function(v, k) {
		  return k + ': ' + quoteString(v);
		});
		var IndexedIterable = function IndexedIterable(value) {
		  return isIndexed(value) ? value : IndexedSeq(value);
		};
		($traceurRuntime.createClass)(IndexedIterable, {
		  toKeyedSeq: function() {
		    return new ToKeyedSequence(this, false);
		  },
		  filter: function(predicate, context) {
		    return reify(this, filterFactory(this, predicate, context, false));
		  },
		  findIndex: function(predicate, context) {
		    var key = this.toKeyedSeq().findKey(predicate, context);
		    return key === undefined ? -1 : key;
		  },
		  indexOf: function(searchValue) {
		    var key = this.toKeyedSeq().keyOf(searchValue);
		    return key === undefined ? -1 : key;
		  },
		  lastIndexOf: function(searchValue) {
		    var key = this.toKeyedSeq().lastKeyOf(searchValue);
		    return key === undefined ? -1 : key;
		  },
		  reverse: function() {
		    return reify(this, reverseFactory(this, false));
		  },
		  splice: function(index, removeNum) {
		    var numArgs = arguments.length;
		    removeNum = Math.max(removeNum | 0, 0);
		    if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
		      return this;
		    }
		    index = resolveBegin(index, this.size);
		    var spliced = this.slice(0, index);
		    return reify(this, numArgs === 1 ? spliced : spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum)));
		  },
		  findLastIndex: function(predicate, context) {
		    var key = this.toKeyedSeq().findLastKey(predicate, context);
		    return key === undefined ? -1 : key;
		  },
		  first: function() {
		    return this.get(0);
		  },
		  flatten: function(depth) {
		    return reify(this, flattenFactory(this, depth, false));
		  },
		  get: function(index, notSetValue) {
		    index = wrapIndex(this, index);
		    return (index < 0 || (this.size === Infinity || (this.size !== undefined && index > this.size))) ? notSetValue : this.find((function(_, key) {
		      return key === index;
		    }), undefined, notSetValue);
		  },
		  has: function(index) {
		    index = wrapIndex(this, index);
		    return index >= 0 && (this.size !== undefined ? this.size === Infinity || index < this.size : this.indexOf(index) !== -1);
		  },
		  interpose: function(separator) {
		    return reify(this, interposeFactory(this, separator));
		  },
		  last: function() {
		    return this.get(-1);
		  },
		  skip: function(amount) {
		    var iter = this;
		    var skipSeq = skipFactory(iter, amount, false);
		    if (isSeq(iter) && skipSeq !== iter) {
		      skipSeq.get = function(index, notSetValue) {
		        index = wrapIndex(this, index);
		        return index >= 0 ? iter.get(index + amount, notSetValue) : notSetValue;
		      };
		    }
		    return reify(this, skipSeq);
		  },
		  skipWhile: function(predicate, context) {
		    return reify(this, skipWhileFactory(this, predicate, context, false));
		  },
		  take: function(amount) {
		    var iter = this;
		    var takeSeq = takeFactory(iter, amount);
		    if (isSeq(iter) && takeSeq !== iter) {
		      takeSeq.get = function(index, notSetValue) {
		        index = wrapIndex(this, index);
		        return index >= 0 && index < amount ? iter.get(index, notSetValue) : notSetValue;
		      };
		    }
		    return reify(this, takeSeq);
		  }
		}, {}, Iterable);
		IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
		IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;
		var SetIterable = function SetIterable(value) {
		  return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
		};
		($traceurRuntime.createClass)(SetIterable, {
		  get: function(value, notSetValue) {
		    return this.has(value) ? value : notSetValue;
		  },
		  contains: function(value) {
		    return this.has(value);
		  },
		  keySeq: function() {
		    return this.valueSeq();
		  }
		}, {}, Iterable);
		SetIterable.prototype.has = IterablePrototype.contains;
		function isIterable(maybeIterable) {
		  return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
		}
		function isKeyed(maybeKeyed) {
		  return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
		}
		function isIndexed(maybeIndexed) {
		  return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
		}
		function isAssociative(maybeAssociative) {
		  return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
		}
		function isOrdered(maybeOrdered) {
		  return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
		}
		Iterable.isIterable = isIterable;
		Iterable.isKeyed = isKeyed;
		Iterable.isIndexed = isIndexed;
		Iterable.isAssociative = isAssociative;
		Iterable.isOrdered = isOrdered;
		Iterable.Keyed = KeyedIterable;
		Iterable.Indexed = IndexedIterable;
		Iterable.Set = SetIterable;
		Iterable.Iterator = Iterator;
		function keyMapper(v, k) {
		  return k;
		}
		function entryMapper(v, k) {
		  return [k, v];
		}
		function not(predicate) {
		  return function() {
		    return !predicate.apply(this, arguments);
		  };
		}
		function neg(predicate) {
		  return function() {
		    return -predicate.apply(this, arguments);
		  };
		}
		function quoteString(value) {
		  return typeof value === 'string' ? JSON.stringify(value) : value;
		}
		function defaultNegComparator(a, b) {
		  return a < b ? 1 : a > b ? -1 : 0;
		}
		function deepEqual(a, b) {
		  if (a === b) {
		    return true;
		  }
		  if (!isIterable(b) || a.size !== undefined && b.size !== undefined && a.size !== b.size || a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash || isKeyed(a) !== isKeyed(b) || isIndexed(a) !== isIndexed(b) || isOrdered(a) !== isOrdered(b)) {
		    return false;
		  }
		  if (a.size === 0 && b.size === 0) {
		    return true;
		  }
		  var notAssociative = !isAssociative(a);
		  if (isOrdered(a)) {
		    var entries = a.entries();
		    return b.every((function(v, k) {
		      var entry = entries.next().value;
		      return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
		    })) && entries.next().done;
		  }
		  var flipped = false;
		  if (a.size === undefined) {
		    if (b.size === undefined) {
		      a.cacheResult();
		    } else {
		      flipped = true;
		      var _ = a;
		      a = b;
		      b = _;
		    }
		  }
		  var allEqual = true;
		  var bSize = b.__iterate((function(v, k) {
		    if (notAssociative ? !a.has(v) : flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
		      allEqual = false;
		      return false;
		    }
		  }));
		  return allEqual && a.size === bSize;
		}
		function hashIterable(iterable) {
		  if (iterable.size === Infinity) {
		    return 0;
		  }
		  var ordered = isOrdered(iterable);
		  var keyed = isKeyed(iterable);
		  var h = ordered ? 1 : 0;
		  var size = iterable.__iterate(keyed ? ordered ? (function(v, k) {
		    h = 31 * h + hashMerge(hash(v), hash(k)) | 0;
		  }) : (function(v, k) {
		    h = h + hashMerge(hash(v), hash(k)) | 0;
		  }) : ordered ? (function(v) {
		    h = 31 * h + hash(v) | 0;
		  }) : (function(v) {
		    h = h + hash(v) | 0;
		  }));
		  return murmurHashOfSize(size, h);
		}
		function murmurHashOfSize(size, h) {
		  h = imul(h, 0xCC9E2D51);
		  h = imul(h << 15 | h >>> -15, 0x1B873593);
		  h = imul(h << 13 | h >>> -13, 5);
		  h = (h + 0xE6546B64 | 0) ^ size;
		  h = imul(h ^ h >>> 16, 0x85EBCA6B);
		  h = imul(h ^ h >>> 13, 0xC2B2AE35);
		  h = smi(h ^ h >>> 16);
		  return h;
		}
		function hashMerge(a, b) {
		  return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0;
		}
		function mixin(ctor, methods) {
		  var proto = ctor.prototype;
		  var keyCopier = (function(key) {
		    proto[key] = methods[key];
		  });
		  Object.keys(methods).forEach(keyCopier);
		  Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);
		  return ctor;
		}
		var Seq = function Seq(value) {
		  return value === null || value === undefined ? emptySequence() : isIterable(value) ? value.toSeq() : seqFromValue(value);
		};
		var $Seq = Seq;
		($traceurRuntime.createClass)(Seq, {
		  toSeq: function() {
		    return this;
		  },
		  toString: function() {
		    return this.__toString('Seq {', '}');
		  },
		  cacheResult: function() {
		    if (!this._cache && this.__iterateUncached) {
		      this._cache = this.entrySeq().toArray();
		      this.size = this._cache.length;
		    }
		    return this;
		  },
		  __iterate: function(fn, reverse) {
		    return seqIterate(this, fn, reverse, true);
		  },
		  __iterator: function(type, reverse) {
		    return seqIterator(this, type, reverse, true);
		  }
		}, {of: function() {
		    return $Seq(arguments);
		  }}, Iterable);
		var KeyedSeq = function KeyedSeq(value) {
		  return value === null || value === undefined ? emptySequence().toKeyedSeq() : isIterable(value) ? (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) : keyedSeqFromValue(value);
		};
		var $KeyedSeq = KeyedSeq;
		($traceurRuntime.createClass)(KeyedSeq, {
		  toKeyedSeq: function() {
		    return this;
		  },
		  toSeq: function() {
		    return this;
		  }
		}, {of: function() {
		    return $KeyedSeq(arguments);
		  }}, Seq);
		mixin(KeyedSeq, KeyedIterable.prototype);
		var IndexedSeq = function IndexedSeq(value) {
		  return value === null || value === undefined ? emptySequence() : !isIterable(value) ? indexedSeqFromValue(value) : isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
		};
		var $IndexedSeq = IndexedSeq;
		($traceurRuntime.createClass)(IndexedSeq, {
		  toIndexedSeq: function() {
		    return this;
		  },
		  toString: function() {
		    return this.__toString('Seq [', ']');
		  },
		  __iterate: function(fn, reverse) {
		    return seqIterate(this, fn, reverse, false);
		  },
		  __iterator: function(type, reverse) {
		    return seqIterator(this, type, reverse, false);
		  }
		}, {of: function() {
		    return $IndexedSeq(arguments);
		  }}, Seq);
		mixin(IndexedSeq, IndexedIterable.prototype);
		var SetSeq = function SetSeq(value) {
		  return (value === null || value === undefined ? emptySequence() : !isIterable(value) ? indexedSeqFromValue(value) : isKeyed(value) ? value.entrySeq() : value).toSetSeq();
		};
		var $SetSeq = SetSeq;
		($traceurRuntime.createClass)(SetSeq, {toSetSeq: function() {
		    return this;
		  }}, {of: function() {
		    return $SetSeq(arguments);
		  }}, Seq);
		mixin(SetSeq, SetIterable.prototype);
		Seq.isSeq = isSeq;
		Seq.Keyed = KeyedSeq;
		Seq.Set = SetSeq;
		Seq.Indexed = IndexedSeq;
		var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';
		Seq.prototype[IS_SEQ_SENTINEL] = true;
		var ArraySeq = function ArraySeq(array) {
		  this._array = array;
		  this.size = array.length;
		};
		($traceurRuntime.createClass)(ArraySeq, {
		  get: function(index, notSetValue) {
		    return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
		  },
		  __iterate: function(fn, reverse) {
		    var array = this._array;
		    var maxIndex = array.length - 1;
		    for (var ii = 0; ii <= maxIndex; ii++) {
		      if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
		        return ii + 1;
		      }
		    }
		    return ii;
		  },
		  __iterator: function(type, reverse) {
		    var array = this._array;
		    var maxIndex = array.length - 1;
		    var ii = 0;
		    return new Iterator((function() {
		      return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++]);
		    }));
		  }
		}, {}, IndexedSeq);
		var ObjectSeq = function ObjectSeq(object) {
		  var keys = Object.keys(object);
		  this._object = object;
		  this._keys = keys;
		  this.size = keys.length;
		};
		($traceurRuntime.createClass)(ObjectSeq, {
		  get: function(key, notSetValue) {
		    if (notSetValue !== undefined && !this.has(key)) {
		      return notSetValue;
		    }
		    return this._object[key];
		  },
		  has: function(key) {
		    return this._object.hasOwnProperty(key);
		  },
		  __iterate: function(fn, reverse) {
		    var object = this._object;
		    var keys = this._keys;
		    var maxIndex = keys.length - 1;
		    for (var ii = 0; ii <= maxIndex; ii++) {
		      var key = keys[reverse ? maxIndex - ii : ii];
		      if (fn(object[key], key, this) === false) {
		        return ii + 1;
		      }
		    }
		    return ii;
		  },
		  __iterator: function(type, reverse) {
		    var object = this._object;
		    var keys = this._keys;
		    var maxIndex = keys.length - 1;
		    var ii = 0;
		    return new Iterator((function() {
		      var key = keys[reverse ? maxIndex - ii : ii];
		      return ii++ > maxIndex ? iteratorDone() : iteratorValue(type, key, object[key]);
		    }));
		  }
		}, {}, KeyedSeq);
		ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;
		var IterableSeq = function IterableSeq(iterable) {
		  this._iterable = iterable;
		  this.size = iterable.length || iterable.size;
		};
		($traceurRuntime.createClass)(IterableSeq, {
		  __iterateUncached: function(fn, reverse) {
		    if (reverse) {
		      return this.cacheResult().__iterate(fn, reverse);
		    }
		    var iterable = this._iterable;
		    var iterator = getIterator(iterable);
		    var iterations = 0;
		    if (isIterator(iterator)) {
		      var step;
		      while (!(step = iterator.next()).done) {
		        if (fn(step.value, iterations++, this) === false) {
		          break;
		        }
		      }
		    }
		    return iterations;
		  },
		  __iteratorUncached: function(type, reverse) {
		    if (reverse) {
		      return this.cacheResult().__iterator(type, reverse);
		    }
		    var iterable = this._iterable;
		    var iterator = getIterator(iterable);
		    if (!isIterator(iterator)) {
		      return new Iterator(iteratorDone);
		    }
		    var iterations = 0;
		    return new Iterator((function() {
		      var step = iterator.next();
		      return step.done ? step : iteratorValue(type, iterations++, step.value);
		    }));
		  }
		}, {}, IndexedSeq);
		var IteratorSeq = function IteratorSeq(iterator) {
		  this._iterator = iterator;
		  this._iteratorCache = [];
		};
		($traceurRuntime.createClass)(IteratorSeq, {
		  __iterateUncached: function(fn, reverse) {
		    if (reverse) {
		      return this.cacheResult().__iterate(fn, reverse);
		    }
		    var iterator = this._iterator;
		    var cache = this._iteratorCache;
		    var iterations = 0;
		    while (iterations < cache.length) {
		      if (fn(cache[iterations], iterations++, this) === false) {
		        return iterations;
		      }
		    }
		    var step;
		    while (!(step = iterator.next()).done) {
		      var val = step.value;
		      cache[iterations] = val;
		      if (fn(val, iterations++, this) === false) {
		        break;
		      }
		    }
		    return iterations;
		  },
		  __iteratorUncached: function(type, reverse) {
		    if (reverse) {
		      return this.cacheResult().__iterator(type, reverse);
		    }
		    var iterator = this._iterator;
		    var cache = this._iteratorCache;
		    var iterations = 0;
		    return new Iterator((function() {
		      if (iterations >= cache.length) {
		        var step = iterator.next();
		        if (step.done) {
		          return step;
		        }
		        cache[iterations] = step.value;
		      }
		      return iteratorValue(type, iterations, cache[iterations++]);
		    }));
		  }
		}, {}, IndexedSeq);
		function isSeq(maybeSeq) {
		  return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
		}
		var EMPTY_SEQ;
		function emptySequence() {
		  return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
		}
		function keyedSeqFromValue(value) {
		  var seq = Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() : isIterator(value) ? new IteratorSeq(value).fromEntrySeq() : hasIterator(value) ? new IterableSeq(value).fromEntrySeq() : typeof value === 'object' ? new ObjectSeq(value) : undefined;
		  if (!seq) {
		    throw new TypeError('Expected Array or iterable object of [k, v] entries, ' + 'or keyed object: ' + value);
		  }
		  return seq;
		}
		function indexedSeqFromValue(value) {
		  var seq = maybeIndexedSeqFromValue(value);
		  if (!seq) {
		    throw new TypeError('Expected Array or iterable object of values: ' + value);
		  }
		  return seq;
		}
		function seqFromValue(value) {
		  var seq = maybeIndexedSeqFromValue(value) || (typeof value === 'object' && new ObjectSeq(value));
		  if (!seq) {
		    throw new TypeError('Expected Array or iterable object of values, or keyed object: ' + value);
		  }
		  return seq;
		}
		function maybeIndexedSeqFromValue(value) {
		  return (isArrayLike(value) ? new ArraySeq(value) : isIterator(value) ? new IteratorSeq(value) : hasIterator(value) ? new IterableSeq(value) : undefined);
		}
		function isArrayLike(value) {
		  return value && typeof value.length === 'number';
		}
		function seqIterate(seq, fn, reverse, useKeys) {
		  var cache = seq._cache;
		  if (cache) {
		    var maxIndex = cache.length - 1;
		    for (var ii = 0; ii <= maxIndex; ii++) {
		      var entry = cache[reverse ? maxIndex - ii : ii];
		      if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
		        return ii + 1;
		      }
		    }
		    return ii;
		  }
		  return seq.__iterateUncached(fn, reverse);
		}
		function seqIterator(seq, type, reverse, useKeys) {
		  var cache = seq._cache;
		  if (cache) {
		    var maxIndex = cache.length - 1;
		    var ii = 0;
		    return new Iterator((function() {
		      var entry = cache[reverse ? maxIndex - ii : ii];
		      return ii++ > maxIndex ? iteratorDone() : iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
		    }));
		  }
		  return seq.__iteratorUncached(type, reverse);
		}
		function fromJS(json, converter) {
		  return converter ? _fromJSWith(converter, json, '', {'': json}) : _fromJSDefault(json);
		}
		function _fromJSWith(converter, json, key, parentJSON) {
		  if (Array.isArray(json)) {
		    return converter.call(parentJSON, key, IndexedSeq(json).map((function(v, k) {
		      return _fromJSWith(converter, v, k, json);
		    })));
		  }
		  if (isPlainObj(json)) {
		    return converter.call(parentJSON, key, KeyedSeq(json).map((function(v, k) {
		      return _fromJSWith(converter, v, k, json);
		    })));
		  }
		  return json;
		}
		function _fromJSDefault(json) {
		  if (Array.isArray(json)) {
		    return IndexedSeq(json).map(_fromJSDefault).toList();
		  }
		  if (isPlainObj(json)) {
		    return KeyedSeq(json).map(_fromJSDefault).toMap();
		  }
		  return json;
		}
		function isPlainObj(value) {
		  return value && value.constructor === Object;
		}
		var Collection = function Collection() {
		  throw TypeError('Abstract');
		};
		($traceurRuntime.createClass)(Collection, {}, {}, Iterable);
		var KeyedCollection = function KeyedCollection() {
		  $traceurRuntime.defaultSuperCall(this, $KeyedCollection.prototype, arguments);
		};
		var $KeyedCollection = KeyedCollection;
		($traceurRuntime.createClass)(KeyedCollection, {}, {}, Collection);
		mixin(KeyedCollection, KeyedIterable.prototype);
		var IndexedCollection = function IndexedCollection() {
		  $traceurRuntime.defaultSuperCall(this, $IndexedCollection.prototype, arguments);
		};
		var $IndexedCollection = IndexedCollection;
		($traceurRuntime.createClass)(IndexedCollection, {}, {}, Collection);
		mixin(IndexedCollection, IndexedIterable.prototype);
		var SetCollection = function SetCollection() {
		  $traceurRuntime.defaultSuperCall(this, $SetCollection.prototype, arguments);
		};
		var $SetCollection = SetCollection;
		($traceurRuntime.createClass)(SetCollection, {}, {}, Collection);
		mixin(SetCollection, SetIterable.prototype);
		Collection.Keyed = KeyedCollection;
		Collection.Indexed = IndexedCollection;
		Collection.Set = SetCollection;
		var Map = function Map(value) {
		  return value === null || value === undefined ? emptyMap() : isMap(value) ? value : emptyMap().withMutations((function(map) {
		    var iter = KeyedIterable(value);
		    assertNotInfinite(iter.size);
		    iter.forEach((function(v, k) {
		      return map.set(k, v);
		    }));
		  }));
		};
		($traceurRuntime.createClass)(Map, {
		  toString: function() {
		    return this.__toString('Map {', '}');
		  },
		  get: function(k, notSetValue) {
		    return this._root ? this._root.get(0, undefined, k, notSetValue) : notSetValue;
		  },
		  set: function(k, v) {
		    return updateMap(this, k, v);
		  },
		  setIn: function(keyPath, v) {
		    return this.updateIn(keyPath, NOT_SET, (function() {
		      return v;
		    }));
		  },
		  remove: function(k) {
		    return updateMap(this, k, NOT_SET);
		  },
		  deleteIn: function(keyPath) {
		    return this.updateIn(keyPath, (function() {
		      return NOT_SET;
		    }));
		  },
		  update: function(k, notSetValue, updater) {
		    return arguments.length === 1 ? k(this) : this.updateIn([k], notSetValue, updater);
		  },
		  updateIn: function(keyPath, notSetValue, updater) {
		    if (!updater) {
		      updater = notSetValue;
		      notSetValue = undefined;
		    }
		    var updatedValue = updateInDeepMap(this, getIterator(keyPath) || getIterator(Iterable(keyPath)), notSetValue, updater);
		    return updatedValue === NOT_SET ? undefined : updatedValue;
		  },
		  clear: function() {
		    if (this.size === 0) {
		      return this;
		    }
		    if (this.__ownerID) {
		      this.size = 0;
		      this._root = null;
		      this.__hash = undefined;
		      this.__altered = true;
		      return this;
		    }
		    return emptyMap();
		  },
		  merge: function() {
		    return mergeIntoMapWith(this, undefined, arguments);
		  },
		  mergeWith: function(merger) {
		    for (var iters = [],
		        $__3 = 1; $__3 < arguments.length; $__3++)
		      iters[$__3 - 1] = arguments[$__3];
		    return mergeIntoMapWith(this, merger, iters);
		  },
		  mergeIn: function(keyPath) {
		    for (var iters = [],
		        $__4 = 1; $__4 < arguments.length; $__4++)
		      iters[$__4 - 1] = arguments[$__4];
		    return this.updateIn(keyPath, emptyMap(), (function(m) {
		      return m.merge.apply(m, iters);
		    }));
		  },
		  mergeDeep: function() {
		    return mergeIntoMapWith(this, deepMerger(undefined), arguments);
		  },
		  mergeDeepWith: function(merger) {
		    for (var iters = [],
		        $__5 = 1; $__5 < arguments.length; $__5++)
		      iters[$__5 - 1] = arguments[$__5];
		    return mergeIntoMapWith(this, deepMerger(merger), iters);
		  },
		  mergeDeepIn: function(keyPath) {
		    for (var iters = [],
		        $__6 = 1; $__6 < arguments.length; $__6++)
		      iters[$__6 - 1] = arguments[$__6];
		    return this.updateIn(keyPath, emptyMap(), (function(m) {
		      return m.mergeDeep.apply(m, iters);
		    }));
		  },
		  sort: function(comparator) {
		    return OrderedMap(sortFactory(this, comparator));
		  },
		  sortBy: function(mapper, comparator) {
		    return OrderedMap(sortFactory(this, comparator, mapper));
		  },
		  withMutations: function(fn) {
		    var mutable = this.asMutable();
		    fn(mutable);
		    return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
		  },
		  asMutable: function() {
		    return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
		  },
		  asImmutable: function() {
		    return this.__ensureOwner();
		  },
		  wasAltered: function() {
		    return this.__altered;
		  },
		  __iterator: function(type, reverse) {
		    return new MapIterator(this, type, reverse);
		  },
		  __iterate: function(fn, reverse) {
		    var $__0 = this;
		    var iterations = 0;
		    this._root && this._root.iterate((function(entry) {
		      iterations++;
		      return fn(entry[1], entry[0], $__0);
		    }), reverse);
		    return iterations;
		  },
		  __ensureOwner: function(ownerID) {
		    if (ownerID === this.__ownerID) {
		      return this;
		    }
		    if (!ownerID) {
		      this.__ownerID = ownerID;
		      this.__altered = false;
		      return this;
		    }
		    return makeMap(this.size, this._root, ownerID, this.__hash);
		  }
		}, {}, KeyedCollection);
		function isMap(maybeMap) {
		  return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
		}
		Map.isMap = isMap;
		var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';
		var MapPrototype = Map.prototype;
		MapPrototype[IS_MAP_SENTINEL] = true;
		MapPrototype[DELETE] = MapPrototype.remove;
		MapPrototype.removeIn = MapPrototype.deleteIn;
		var ArrayMapNode = function ArrayMapNode(ownerID, entries) {
		  this.ownerID = ownerID;
		  this.entries = entries;
		};
		var $ArrayMapNode = ArrayMapNode;
		($traceurRuntime.createClass)(ArrayMapNode, {
		  get: function(shift, keyHash, key, notSetValue) {
		    var entries = this.entries;
		    for (var ii = 0,
		        len = entries.length; ii < len; ii++) {
		      if (is(key, entries[ii][0])) {
		        return entries[ii][1];
		      }
		    }
		    return notSetValue;
		  },
		  update: function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
		    var removed = value === NOT_SET;
		    var entries = this.entries;
		    var idx = 0;
		    for (var len = entries.length; idx < len; idx++) {
		      if (is(key, entries[idx][0])) {
		        break;
		      }
		    }
		    var exists = idx < len;
		    if (exists ? entries[idx][1] === value : removed) {
		      return this;
		    }
		    SetRef(didAlter);
		    (removed || !exists) && SetRef(didChangeSize);
		    if (removed && entries.length === 1) {
		      return;
		    }
		    if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
		      return createNodes(ownerID, entries, key, value);
		    }
		    var isEditable = ownerID && ownerID === this.ownerID;
		    var newEntries = isEditable ? entries : arrCopy(entries);
		    if (exists) {
		      if (removed) {
		        idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
		      } else {
		        newEntries[idx] = [key, value];
		      }
		    } else {
		      newEntries.push([key, value]);
		    }
		    if (isEditable) {
		      this.entries = newEntries;
		      return this;
		    }
		    return new $ArrayMapNode(ownerID, newEntries);
		  }
		}, {});
		var BitmapIndexedNode = function BitmapIndexedNode(ownerID, bitmap, nodes) {
		  this.ownerID = ownerID;
		  this.bitmap = bitmap;
		  this.nodes = nodes;
		};
		var $BitmapIndexedNode = BitmapIndexedNode;
		($traceurRuntime.createClass)(BitmapIndexedNode, {
		  get: function(shift, keyHash, key, notSetValue) {
		    if (keyHash === undefined) {
		      keyHash = hash(key);
		    }
		    var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
		    var bitmap = this.bitmap;
		    return (bitmap & bit) === 0 ? notSetValue : this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
		  },
		  update: function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
		    if (keyHash === undefined) {
		      keyHash = hash(key);
		    }
		    var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
		    var bit = 1 << keyHashFrag;
		    var bitmap = this.bitmap;
		    var exists = (bitmap & bit) !== 0;
		    if (!exists && value === NOT_SET) {
		      return this;
		    }
		    var idx = popCount(bitmap & (bit - 1));
		    var nodes = this.nodes;
		    var node = exists ? nodes[idx] : undefined;
		    var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
		    if (newNode === node) {
		      return this;
		    }
		    if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
		      return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
		    }
		    if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
		      return nodes[idx ^ 1];
		    }
		    if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
		      return newNode;
		    }
		    var isEditable = ownerID && ownerID === this.ownerID;
		    var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
		    var newNodes = exists ? newNode ? setIn(nodes, idx, newNode, isEditable) : spliceOut(nodes, idx, isEditable) : spliceIn(nodes, idx, newNode, isEditable);
		    if (isEditable) {
		      this.bitmap = newBitmap;
		      this.nodes = newNodes;
		      return this;
		    }
		    return new $BitmapIndexedNode(ownerID, newBitmap, newNodes);
		  }
		}, {});
		var HashArrayMapNode = function HashArrayMapNode(ownerID, count, nodes) {
		  this.ownerID = ownerID;
		  this.count = count;
		  this.nodes = nodes;
		};
		var $HashArrayMapNode = HashArrayMapNode;
		($traceurRuntime.createClass)(HashArrayMapNode, {
		  get: function(shift, keyHash, key, notSetValue) {
		    if (keyHash === undefined) {
		      keyHash = hash(key);
		    }
		    var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
		    var node = this.nodes[idx];
		    return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
		  },
		  update: function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
		    if (keyHash === undefined) {
		      keyHash = hash(key);
		    }
		    var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
		    var removed = value === NOT_SET;
		    var nodes = this.nodes;
		    var node = nodes[idx];
		    if (removed && !node) {
		      return this;
		    }
		    var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
		    if (newNode === node) {
		      return this;
		    }
		    var newCount = this.count;
		    if (!node) {
		      newCount++;
		    } else if (!newNode) {
		      newCount--;
		      if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
		        return packNodes(ownerID, nodes, newCount, idx);
		      }
		    }
		    var isEditable = ownerID && ownerID === this.ownerID;
		    var newNodes = setIn(nodes, idx, newNode, isEditable);
		    if (isEditable) {
		      this.count = newCount;
		      this.nodes = newNodes;
		      return this;
		    }
		    return new $HashArrayMapNode(ownerID, newCount, newNodes);
		  }
		}, {});
		var HashCollisionNode = function HashCollisionNode(ownerID, keyHash, entries) {
		  this.ownerID = ownerID;
		  this.keyHash = keyHash;
		  this.entries = entries;
		};
		var $HashCollisionNode = HashCollisionNode;
		($traceurRuntime.createClass)(HashCollisionNode, {
		  get: function(shift, keyHash, key, notSetValue) {
		    var entries = this.entries;
		    for (var ii = 0,
		        len = entries.length; ii < len; ii++) {
		      if (is(key, entries[ii][0])) {
		        return entries[ii][1];
		      }
		    }
		    return notSetValue;
		  },
		  update: function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
		    if (keyHash === undefined) {
		      keyHash = hash(key);
		    }
		    var removed = value === NOT_SET;
		    if (keyHash !== this.keyHash) {
		      if (removed) {
		        return this;
		      }
		      SetRef(didAlter);
		      SetRef(didChangeSize);
		      return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
		    }
		    var entries = this.entries;
		    var idx = 0;
		    for (var len = entries.length; idx < len; idx++) {
		      if (is(key, entries[idx][0])) {
		        break;
		      }
		    }
		    var exists = idx < len;
		    if (exists ? entries[idx][1] === value : removed) {
		      return this;
		    }
		    SetRef(didAlter);
		    (removed || !exists) && SetRef(didChangeSize);
		    if (removed && len === 2) {
		      return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
		    }
		    var isEditable = ownerID && ownerID === this.ownerID;
		    var newEntries = isEditable ? entries : arrCopy(entries);
		    if (exists) {
		      if (removed) {
		        idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
		      } else {
		        newEntries[idx] = [key, value];
		      }
		    } else {
		      newEntries.push([key, value]);
		    }
		    if (isEditable) {
		      this.entries = newEntries;
		      return this;
		    }
		    return new $HashCollisionNode(ownerID, this.keyHash, newEntries);
		  }
		}, {});
		var ValueNode = function ValueNode(ownerID, keyHash, entry) {
		  this.ownerID = ownerID;
		  this.keyHash = keyHash;
		  this.entry = entry;
		};
		var $ValueNode = ValueNode;
		($traceurRuntime.createClass)(ValueNode, {
		  get: function(shift, keyHash, key, notSetValue) {
		    return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
		  },
		  update: function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
		    var removed = value === NOT_SET;
		    var keyMatch = is(key, this.entry[0]);
		    if (keyMatch ? value === this.entry[1] : removed) {
		      return this;
		    }
		    SetRef(didAlter);
		    if (removed) {
		      SetRef(didChangeSize);
		      return;
		    }
		    if (keyMatch) {
		      if (ownerID && ownerID === this.ownerID) {
		        this.entry[1] = value;
		        return this;
		      }
		      return new $ValueNode(ownerID, this.keyHash, [key, value]);
		    }
		    SetRef(didChangeSize);
		    return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
		  }
		}, {});
		ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function(fn, reverse) {
		  var entries = this.entries;
		  for (var ii = 0,
		      maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
		    if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
		      return false;
		    }
		  }
		};
		BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function(fn, reverse) {
		  var nodes = this.nodes;
		  for (var ii = 0,
		      maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
		    var node = nodes[reverse ? maxIndex - ii : ii];
		    if (node && node.iterate(fn, reverse) === false) {
		      return false;
		    }
		  }
		};
		ValueNode.prototype.iterate = function(fn, reverse) {
		  return fn(this.entry);
		};
		var MapIterator = function MapIterator(map, type, reverse) {
		  this._type = type;
		  this._reverse = reverse;
		  this._stack = map._root && mapIteratorFrame(map._root);
		};
		($traceurRuntime.createClass)(MapIterator, {next: function() {
		    var type = this._type;
		    var stack = this._stack;
		    while (stack) {
		      var node = stack.node;
		      var index = stack.index++;
		      var maxIndex;
		      if (node.entry) {
		        if (index === 0) {
		          return mapIteratorValue(type, node.entry);
		        }
		      } else if (node.entries) {
		        maxIndex = node.entries.length - 1;
		        if (index <= maxIndex) {
		          return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
		        }
		      } else {
		        maxIndex = node.nodes.length - 1;
		        if (index <= maxIndex) {
		          var subNode = node.nodes[this._reverse ? maxIndex - index : index];
		          if (subNode) {
		            if (subNode.entry) {
		              return mapIteratorValue(type, subNode.entry);
		            }
		            stack = this._stack = mapIteratorFrame(subNode, stack);
		          }
		          continue;
		        }
		      }
		      stack = this._stack = this._stack.__prev;
		    }
		    return iteratorDone();
		  }}, {}, Iterator);
		function mapIteratorValue(type, entry) {
		  return iteratorValue(type, entry[0], entry[1]);
		}
		function mapIteratorFrame(node, prev) {
		  return {
		    node: node,
		    index: 0,
		    __prev: prev
		  };
		}
		function makeMap(size, root, ownerID, hash) {
		  var map = Object.create(MapPrototype);
		  map.size = size;
		  map._root = root;
		  map.__ownerID = ownerID;
		  map.__hash = hash;
		  map.__altered = false;
		  return map;
		}
		var EMPTY_MAP;
		function emptyMap() {
		  return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
		}
		function updateMap(map, k, v) {
		  var newRoot;
		  var newSize;
		  if (!map._root) {
		    if (v === NOT_SET) {
		      return map;
		    }
		    newSize = 1;
		    newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
		  } else {
		    var didChangeSize = MakeRef(CHANGE_LENGTH);
		    var didAlter = MakeRef(DID_ALTER);
		    newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
		    if (!didAlter.value) {
		      return map;
		    }
		    newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
		  }
		  if (map.__ownerID) {
		    map.size = newSize;
		    map._root = newRoot;
		    map.__hash = undefined;
		    map.__altered = true;
		    return map;
		  }
		  return newRoot ? makeMap(newSize, newRoot) : emptyMap();
		}
		function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
		  if (!node) {
		    if (value === NOT_SET) {
		      return node;
		    }
		    SetRef(didAlter);
		    SetRef(didChangeSize);
		    return new ValueNode(ownerID, keyHash, [key, value]);
		  }
		  return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
		}
		function isLeafNode(node) {
		  return node.constructor === ValueNode || node.constructor === HashCollisionNode;
		}
		function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
		  if (node.keyHash === keyHash) {
		    return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
		  }
		  var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
		  var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
		  var newNode;
		  var nodes = idx1 === idx2 ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] : ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);
		  return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
		}
		function createNodes(ownerID, entries, key, value) {
		  if (!ownerID) {
		    ownerID = new OwnerID();
		  }
		  var node = new ValueNode(ownerID, hash(key), [key, value]);
		  for (var ii = 0; ii < entries.length; ii++) {
		    var entry = entries[ii];
		    node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
		  }
		  return node;
		}
		function packNodes(ownerID, nodes, count, excluding) {
		  var bitmap = 0;
		  var packedII = 0;
		  var packedNodes = new Array(count);
		  for (var ii = 0,
		      bit = 1,
		      len = nodes.length; ii < len; ii++, bit <<= 1) {
		    var node = nodes[ii];
		    if (node !== undefined && ii !== excluding) {
		      bitmap |= bit;
		      packedNodes[packedII++] = node;
		    }
		  }
		  return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
		}
		function expandNodes(ownerID, nodes, bitmap, including, node) {
		  var count = 0;
		  var expandedNodes = new Array(SIZE);
		  for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
		    expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
		  }
		  expandedNodes[including] = node;
		  return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
		}
		function mergeIntoMapWith(map, merger, iterables) {
		  var iters = [];
		  for (var ii = 0; ii < iterables.length; ii++) {
		    var value = iterables[ii];
		    var iter = KeyedIterable(value);
		    if (!isIterable(value)) {
		      iter = iter.map((function(v) {
		        return fromJS(v);
		      }));
		    }
		    iters.push(iter);
		  }
		  return mergeIntoCollectionWith(map, merger, iters);
		}
		function deepMerger(merger) {
		  return (function(existing, value) {
		    return existing && existing.mergeDeepWith && isIterable(value) ? existing.mergeDeepWith(merger, value) : merger ? merger(existing, value) : value;
		  });
		}
		function mergeIntoCollectionWith(collection, merger, iters) {
		  iters = iters.filter((function(x) {
		    return x.size !== 0;
		  }));
		  if (iters.length === 0) {
		    return collection;
		  }
		  if (collection.size === 0 && iters.length === 1) {
		    return collection.constructor(iters[0]);
		  }
		  return collection.withMutations((function(collection) {
		    var mergeIntoMap = merger ? (function(value, key) {
		      collection.update(key, NOT_SET, (function(existing) {
		        return existing === NOT_SET ? value : merger(existing, value);
		      }));
		    }) : (function(value, key) {
		      collection.set(key, value);
		    });
		    for (var ii = 0; ii < iters.length; ii++) {
		      iters[ii].forEach(mergeIntoMap);
		    }
		  }));
		}
		function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
		  var isNotSet = existing === NOT_SET;
		  var step = keyPathIter.next();
		  if (step.done) {
		    var existingValue = isNotSet ? notSetValue : existing;
		    var newValue = updater(existingValue);
		    return newValue === existingValue ? existing : newValue;
		  }
		  invariant(isNotSet || (existing && existing.set), 'invalid keyPath');
		  var key = step.value;
		  var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
		  var nextUpdated = updateInDeepMap(nextExisting, keyPathIter, notSetValue, updater);
		  return nextUpdated === nextExisting ? existing : nextUpdated === NOT_SET ? existing.remove(key) : (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
		}
		function popCount(x) {
		  x = x - ((x >> 1) & 0x55555555);
		  x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
		  x = (x + (x >> 4)) & 0x0f0f0f0f;
		  x = x + (x >> 8);
		  x = x + (x >> 16);
		  return x & 0x7f;
		}
		function setIn(array, idx, val, canEdit) {
		  var newArray = canEdit ? array : arrCopy(array);
		  newArray[idx] = val;
		  return newArray;
		}
		function spliceIn(array, idx, val, canEdit) {
		  var newLen = array.length + 1;
		  if (canEdit && idx + 1 === newLen) {
		    array[idx] = val;
		    return array;
		  }
		  var newArray = new Array(newLen);
		  var after = 0;
		  for (var ii = 0; ii < newLen; ii++) {
		    if (ii === idx) {
		      newArray[ii] = val;
		      after = -1;
		    } else {
		      newArray[ii] = array[ii + after];
		    }
		  }
		  return newArray;
		}
		function spliceOut(array, idx, canEdit) {
		  var newLen = array.length - 1;
		  if (canEdit && idx === newLen) {
		    array.pop();
		    return array;
		  }
		  var newArray = new Array(newLen);
		  var after = 0;
		  for (var ii = 0; ii < newLen; ii++) {
		    if (ii === idx) {
		      after = 1;
		    }
		    newArray[ii] = array[ii + after];
		  }
		  return newArray;
		}
		var MAX_ARRAY_MAP_SIZE = SIZE / 4;
		var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
		var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;
		var ToKeyedSequence = function ToKeyedSequence(indexed, useKeys) {
		  this._iter = indexed;
		  this._useKeys = useKeys;
		  this.size = indexed.size;
		};
		($traceurRuntime.createClass)(ToKeyedSequence, {
		  get: function(key, notSetValue) {
		    return this._iter.get(key, notSetValue);
		  },
		  has: function(key) {
		    return this._iter.has(key);
		  },
		  valueSeq: function() {
		    return this._iter.valueSeq();
		  },
		  reverse: function() {
		    var $__0 = this;
		    var reversedSequence = reverseFactory(this, true);
		    if (!this._useKeys) {
		      reversedSequence.valueSeq = (function() {
		        return $__0._iter.toSeq().reverse();
		      });
		    }
		    return reversedSequence;
		  },
		  map: function(mapper, context) {
		    var $__0 = this;
		    var mappedSequence = mapFactory(this, mapper, context);
		    if (!this._useKeys) {
		      mappedSequence.valueSeq = (function() {
		        return $__0._iter.toSeq().map(mapper, context);
		      });
		    }
		    return mappedSequence;
		  },
		  __iterate: function(fn, reverse) {
		    var $__0 = this;
		    var ii;
		    return this._iter.__iterate(this._useKeys ? (function(v, k) {
		      return fn(v, k, $__0);
		    }) : ((ii = reverse ? resolveSize(this) : 0), (function(v) {
		      return fn(v, reverse ? --ii : ii++, $__0);
		    })), reverse);
		  },
		  __iterator: function(type, reverse) {
		    if (this._useKeys) {
		      return this._iter.__iterator(type, reverse);
		    }
		    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
		    var ii = reverse ? resolveSize(this) : 0;
		    return new Iterator((function() {
		      var step = iterator.next();
		      return step.done ? step : iteratorValue(type, reverse ? --ii : ii++, step.value, step);
		    }));
		  }
		}, {}, KeyedSeq);
		ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;
		var ToIndexedSequence = function ToIndexedSequence(iter) {
		  this._iter = iter;
		  this.size = iter.size;
		};
		($traceurRuntime.createClass)(ToIndexedSequence, {
		  contains: function(value) {
		    return this._iter.contains(value);
		  },
		  __iterate: function(fn, reverse) {
		    var $__0 = this;
		    var iterations = 0;
		    return this._iter.__iterate((function(v) {
		      return fn(v, iterations++, $__0);
		    }), reverse);
		  },
		  __iterator: function(type, reverse) {
		    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
		    var iterations = 0;
		    return new Iterator((function() {
		      var step = iterator.next();
		      return step.done ? step : iteratorValue(type, iterations++, step.value, step);
		    }));
		  }
		}, {}, IndexedSeq);
		var ToSetSequence = function ToSetSequence(iter) {
		  this._iter = iter;
		  this.size = iter.size;
		};
		($traceurRuntime.createClass)(ToSetSequence, {
		  has: function(key) {
		    return this._iter.contains(key);
		  },
		  __iterate: function(fn, reverse) {
		    var $__0 = this;
		    return this._iter.__iterate((function(v) {
		      return fn(v, v, $__0);
		    }), reverse);
		  },
		  __iterator: function(type, reverse) {
		    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
		    return new Iterator((function() {
		      var step = iterator.next();
		      return step.done ? step : iteratorValue(type, step.value, step.value, step);
		    }));
		  }
		}, {}, SetSeq);
		var FromEntriesSequence = function FromEntriesSequence(entries) {
		  this._iter = entries;
		  this.size = entries.size;
		};
		($traceurRuntime.createClass)(FromEntriesSequence, {
		  entrySeq: function() {
		    return this._iter.toSeq();
		  },
		  __iterate: function(fn, reverse) {
		    var $__0 = this;
		    return this._iter.__iterate((function(entry) {
		      if (entry) {
		        validateEntry(entry);
		        return fn(entry[1], entry[0], $__0);
		      }
		    }), reverse);
		  },
		  __iterator: function(type, reverse) {
		    var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
		    return new Iterator((function() {
		      while (true) {
		        var step = iterator.next();
		        if (step.done) {
		          return step;
		        }
		        var entry = step.value;
		        if (entry) {
		          validateEntry(entry);
		          return type === ITERATE_ENTRIES ? step : iteratorValue(type, entry[0], entry[1], step);
		        }
		      }
		    }));
		  }
		}, {}, KeyedSeq);
		ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;
		function flipFactory(iterable) {
		  var flipSequence = makeSequence(iterable);
		  flipSequence._iter = iterable;
		  flipSequence.size = iterable.size;
		  flipSequence.flip = (function() {
		    return iterable;
		  });
		  flipSequence.reverse = function() {
		    var reversedSequence = iterable.reverse.apply(this);
		    reversedSequence.flip = (function() {
		      return iterable.reverse();
		    });
		    return reversedSequence;
		  };
		  flipSequence.has = (function(key) {
		    return iterable.contains(key);
		  });
		  flipSequence.contains = (function(key) {
		    return iterable.has(key);
		  });
		  flipSequence.cacheResult = cacheResultThrough;
		  flipSequence.__iterateUncached = function(fn, reverse) {
		    var $__0 = this;
		    return iterable.__iterate((function(v, k) {
		      return fn(k, v, $__0) !== false;
		    }), reverse);
		  };
		  flipSequence.__iteratorUncached = function(type, reverse) {
		    if (type === ITERATE_ENTRIES) {
		      var iterator = iterable.__iterator(type, reverse);
		      return new Iterator((function() {
		        var step = iterator.next();
		        if (!step.done) {
		          var k = step.value[0];
		          step.value[0] = step.value[1];
		          step.value[1] = k;
		        }
		        return step;
		      }));
		    }
		    return iterable.__iterator(type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES, reverse);
		  };
		  return flipSequence;
		}
		function mapFactory(iterable, mapper, context) {
		  var mappedSequence = makeSequence(iterable);
		  mappedSequence.size = iterable.size;
		  mappedSequence.has = (function(key) {
		    return iterable.has(key);
		  });
		  mappedSequence.get = (function(key, notSetValue) {
		    var v = iterable.get(key, NOT_SET);
		    return v === NOT_SET ? notSetValue : mapper.call(context, v, key, iterable);
		  });
		  mappedSequence.__iterateUncached = function(fn, reverse) {
		    var $__0 = this;
		    return iterable.__iterate((function(v, k, c) {
		      return fn(mapper.call(context, v, k, c), k, $__0) !== false;
		    }), reverse);
		  };
		  mappedSequence.__iteratorUncached = function(type, reverse) {
		    var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
		    return new Iterator((function() {
		      var step = iterator.next();
		      if (step.done) {
		        return step;
		      }
		      var entry = step.value;
		      var key = entry[0];
		      return iteratorValue(type, key, mapper.call(context, entry[1], key, iterable), step);
		    }));
		  };
		  return mappedSequence;
		}
		function reverseFactory(iterable, useKeys) {
		  var reversedSequence = makeSequence(iterable);
		  reversedSequence._iter = iterable;
		  reversedSequence.size = iterable.size;
		  reversedSequence.reverse = (function() {
		    return iterable;
		  });
		  if (iterable.flip) {
		    reversedSequence.flip = function() {
		      var flipSequence = flipFactory(iterable);
		      flipSequence.reverse = (function() {
		        return iterable.flip();
		      });
		      return flipSequence;
		    };
		  }
		  reversedSequence.get = (function(key, notSetValue) {
		    return iterable.get(useKeys ? key : -1 - key, notSetValue);
		  });
		  reversedSequence.has = (function(key) {
		    return iterable.has(useKeys ? key : -1 - key);
		  });
		  reversedSequence.contains = (function(value) {
		    return iterable.contains(value);
		  });
		  reversedSequence.cacheResult = cacheResultThrough;
		  reversedSequence.__iterate = function(fn, reverse) {
		    var $__0 = this;
		    return iterable.__iterate((function(v, k) {
		      return fn(v, k, $__0);
		    }), !reverse);
		  };
		  reversedSequence.__iterator = (function(type, reverse) {
		    return iterable.__iterator(type, !reverse);
		  });
		  return reversedSequence;
		}
		function filterFactory(iterable, predicate, context, useKeys) {
		  var filterSequence = makeSequence(iterable);
		  if (useKeys) {
		    filterSequence.has = (function(key) {
		      var v = iterable.get(key, NOT_SET);
		      return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
		    });
		    filterSequence.get = (function(key, notSetValue) {
		      var v = iterable.get(key, NOT_SET);
		      return v !== NOT_SET && predicate.call(context, v, key, iterable) ? v : notSetValue;
		    });
		  }
		  filterSequence.__iterateUncached = function(fn, reverse) {
		    var $__0 = this;
		    var iterations = 0;
		    iterable.__iterate((function(v, k, c) {
		      if (predicate.call(context, v, k, c)) {
		        iterations++;
		        return fn(v, useKeys ? k : iterations - 1, $__0);
		      }
		    }), reverse);
		    return iterations;
		  };
		  filterSequence.__iteratorUncached = function(type, reverse) {
		    var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
		    var iterations = 0;
		    return new Iterator((function() {
		      while (true) {
		        var step = iterator.next();
		        if (step.done) {
		          return step;
		        }
		        var entry = step.value;
		        var key = entry[0];
		        var value = entry[1];
		        if (predicate.call(context, value, key, iterable)) {
		          return iteratorValue(type, useKeys ? key : iterations++, value, step);
		        }
		      }
		    }));
		  };
		  return filterSequence;
		}
		function countByFactory(iterable, grouper, context) {
		  var groups = Map().asMutable();
		  iterable.__iterate((function(v, k) {
		    groups.update(grouper.call(context, v, k, iterable), 0, (function(a) {
		      return a + 1;
		    }));
		  }));
		  return groups.asImmutable();
		}
		function groupByFactory(iterable, grouper, context) {
		  var isKeyedIter = isKeyed(iterable);
		  var groups = Map().asMutable();
		  iterable.__iterate((function(v, k) {
		    groups.update(grouper.call(context, v, k, iterable), (function(a) {
		      return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a);
		    }));
		  }));
		  var coerce = iterableClass(iterable);
		  return groups.map((function(arr) {
		    return reify(iterable, coerce(arr));
		  }));
		}
		function takeFactory(iterable, amount) {
		  if (amount > iterable.size) {
		    return iterable;
		  }
		  if (amount < 0) {
		    amount = 0;
		  }
		  var takeSequence = makeSequence(iterable);
		  takeSequence.size = iterable.size && Math.min(iterable.size, amount);
		  takeSequence.__iterateUncached = function(fn, reverse) {
		    var $__0 = this;
		    if (amount === 0) {
		      return 0;
		    }
		    if (reverse) {
		      return this.cacheResult().__iterate(fn, reverse);
		    }
		    var iterations = 0;
		    iterable.__iterate((function(v, k) {
		      return ++iterations && fn(v, k, $__0) !== false && iterations < amount;
		    }));
		    return iterations;
		  };
		  takeSequence.__iteratorUncached = function(type, reverse) {
		    if (reverse) {
		      return this.cacheResult().__iterator(type, reverse);
		    }
		    var iterator = amount && iterable.__iterator(type, reverse);
		    var iterations = 0;
		    return new Iterator((function() {
		      if (iterations++ > amount) {
		        return iteratorDone();
		      }
		      return iterator.next();
		    }));
		  };
		  return takeSequence;
		}
		function takeWhileFactory(iterable, predicate, context) {
		  var takeSequence = makeSequence(iterable);
		  takeSequence.__iterateUncached = function(fn, reverse) {
		    var $__0 = this;
		    if (reverse) {
		      return this.cacheResult().__iterate(fn, reverse);
		    }
		    var iterations = 0;
		    iterable.__iterate((function(v, k, c) {
		      return predicate.call(context, v, k, c) && ++iterations && fn(v, k, $__0);
		    }));
		    return iterations;
		  };
		  takeSequence.__iteratorUncached = function(type, reverse) {
		    var $__0 = this;
		    if (reverse) {
		      return this.cacheResult().__iterator(type, reverse);
		    }
		    var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
		    var iterating = true;
		    return new Iterator((function() {
		      if (!iterating) {
		        return iteratorDone();
		      }
		      var step = iterator.next();
		      if (step.done) {
		        return step;
		      }
		      var entry = step.value;
		      var k = entry[0];
		      var v = entry[1];
		      if (!predicate.call(context, v, k, $__0)) {
		        iterating = false;
		        return iteratorDone();
		      }
		      return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
		    }));
		  };
		  return takeSequence;
		}
		function skipFactory(iterable, amount, useKeys) {
		  if (amount <= 0) {
		    return iterable;
		  }
		  var skipSequence = makeSequence(iterable);
		  skipSequence.size = iterable.size && Math.max(0, iterable.size - amount);
		  skipSequence.__iterateUncached = function(fn, reverse) {
		    var $__0 = this;
		    if (reverse) {
		      return this.cacheResult().__iterate(fn, reverse);
		    }
		    var skipped = 0;
		    var isSkipping = true;
		    var iterations = 0;
		    iterable.__iterate((function(v, k) {
		      if (!(isSkipping && (isSkipping = skipped++ < amount))) {
		        iterations++;
		        return fn(v, useKeys ? k : iterations - 1, $__0);
		      }
		    }));
		    return iterations;
		  };
		  skipSequence.__iteratorUncached = function(type, reverse) {
		    if (reverse) {
		      return this.cacheResult().__iterator(type, reverse);
		    }
		    var iterator = amount && iterable.__iterator(type, reverse);
		    var skipped = 0;
		    var iterations = 0;
		    return new Iterator((function() {
		      while (skipped < amount) {
		        skipped++;
		        iterator.next();
		      }
		      var step = iterator.next();
		      if (useKeys || type === ITERATE_VALUES) {
		        return step;
		      } else if (type === ITERATE_KEYS) {
		        return iteratorValue(type, iterations++, undefined, step);
		      } else {
		        return iteratorValue(type, iterations++, step.value[1], step);
		      }
		    }));
		  };
		  return skipSequence;
		}
		function skipWhileFactory(iterable, predicate, context, useKeys) {
		  var skipSequence = makeSequence(iterable);
		  skipSequence.__iterateUncached = function(fn, reverse) {
		    var $__0 = this;
		    if (reverse) {
		      return this.cacheResult().__iterate(fn, reverse);
		    }
		    var isSkipping = true;
		    var iterations = 0;
		    iterable.__iterate((function(v, k, c) {
		      if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
		        iterations++;
		        return fn(v, useKeys ? k : iterations - 1, $__0);
		      }
		    }));
		    return iterations;
		  };
		  skipSequence.__iteratorUncached = function(type, reverse) {
		    var $__0 = this;
		    if (reverse) {
		      return this.cacheResult().__iterator(type, reverse);
		    }
		    var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
		    var skipping = true;
		    var iterations = 0;
		    return new Iterator((function() {
		      var step,
		          k,
		          v;
		      do {
		        step = iterator.next();
		        if (step.done) {
		          if (useKeys || type === ITERATE_VALUES) {
		            return step;
		          } else if (type === ITERATE_KEYS) {
		            return iteratorValue(type, iterations++, undefined, step);
		          } else {
		            return iteratorValue(type, iterations++, step.value[1], step);
		          }
		        }
		        var entry = step.value;
		        k = entry[0];
		        v = entry[1];
		        skipping && (skipping = predicate.call(context, v, k, $__0));
		      } while (skipping);
		      return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
		    }));
		  };
		  return skipSequence;
		}
		function concatFactory(iterable, values) {
		  var isKeyedIterable = isKeyed(iterable);
		  var iters = [iterable].concat(values).map((function(v) {
		    if (!isIterable(v)) {
		      v = isKeyedIterable ? keyedSeqFromValue(v) : indexedSeqFromValue(Array.isArray(v) ? v : [v]);
		    } else if (isKeyedIterable) {
		      v = KeyedIterable(v);
		    }
		    return v;
		  })).filter((function(v) {
		    return v.size !== 0;
		  }));
		  if (iters.length === 0) {
		    return iterable;
		  }
		  if (iters.length === 1) {
		    var singleton = iters[0];
		    if (singleton === iterable || isKeyedIterable && isKeyed(singleton) || isIndexed(iterable) && isIndexed(singleton)) {
		      return singleton;
		    }
		  }
		  var concatSeq = new ArraySeq(iters);
		  if (isKeyedIterable) {
		    concatSeq = concatSeq.toKeyedSeq();
		  } else if (!isIndexed(iterable)) {
		    concatSeq = concatSeq.toSetSeq();
		  }
		  concatSeq = concatSeq.flatten(true);
		  concatSeq.size = iters.reduce((function(sum, seq) {
		    if (sum !== undefined) {
		      var size = seq.size;
		      if (size !== undefined) {
		        return sum + size;
		      }
		    }
		  }), 0);
		  return concatSeq;
		}
		function flattenFactory(iterable, depth, useKeys) {
		  var flatSequence = makeSequence(iterable);
		  flatSequence.__iterateUncached = function(fn, reverse) {
		    var iterations = 0;
		    var stopped = false;
		    function flatDeep(iter, currentDepth) {
		      var $__0 = this;
		      iter.__iterate((function(v, k) {
		        if ((!depth || currentDepth < depth) && isIterable(v)) {
		          flatDeep(v, currentDepth + 1);
		        } else if (fn(v, useKeys ? k : iterations++, $__0) === false) {
		          stopped = true;
		        }
		        return !stopped;
		      }), reverse);
		    }
		    flatDeep(iterable, 0);
		    return iterations;
		  };
		  flatSequence.__iteratorUncached = function(type, reverse) {
		    var iterator = iterable.__iterator(type, reverse);
		    var stack = [];
		    var iterations = 0;
		    return new Iterator((function() {
		      while (iterator) {
		        var step = iterator.next();
		        if (step.done !== false) {
		          iterator = stack.pop();
		          continue;
		        }
		        var v = step.value;
		        if (type === ITERATE_ENTRIES) {
		          v = v[1];
		        }
		        if ((!depth || stack.length < depth) && isIterable(v)) {
		          stack.push(iterator);
		          iterator = v.__iterator(type, reverse);
		        } else {
		          return useKeys ? step : iteratorValue(type, iterations++, v, step);
		        }
		      }
		      return iteratorDone();
		    }));
		  };
		  return flatSequence;
		}
		function flatMapFactory(iterable, mapper, context) {
		  var coerce = iterableClass(iterable);
		  return iterable.toSeq().map((function(v, k) {
		    return coerce(mapper.call(context, v, k, iterable));
		  })).flatten(true);
		}
		function interposeFactory(iterable, separator) {
		  var interposedSequence = makeSequence(iterable);
		  interposedSequence.size = iterable.size && iterable.size * 2 - 1;
		  interposedSequence.__iterateUncached = function(fn, reverse) {
		    var $__0 = this;
		    var iterations = 0;
		    iterable.__iterate((function(v, k) {
		      return (!iterations || fn(separator, iterations++, $__0) !== false) && fn(v, iterations++, $__0) !== false;
		    }), reverse);
		    return iterations;
		  };
		  interposedSequence.__iteratorUncached = function(type, reverse) {
		    var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
		    var iterations = 0;
		    var step;
		    return new Iterator((function() {
		      if (!step || iterations % 2) {
		        step = iterator.next();
		        if (step.done) {
		          return step;
		        }
		      }
		      return iterations % 2 ? iteratorValue(type, iterations++, separator) : iteratorValue(type, iterations++, step.value, step);
		    }));
		  };
		  return interposedSequence;
		}
		function sortFactory(iterable, comparator, mapper) {
		  if (!comparator) {
		    comparator = defaultComparator;
		  }
		  var isKeyedIterable = isKeyed(iterable);
		  var index = 0;
		  var entries = iterable.toSeq().map((function(v, k) {
		    return [k, v, index++, mapper ? mapper(v, k, iterable) : v];
		  })).toArray();
		  entries.sort((function(a, b) {
		    return comparator(a[3], b[3]) || a[2] - b[2];
		  })).forEach(isKeyedIterable ? (function(v, i) {
		    entries[i].length = 2;
		  }) : (function(v, i) {
		    entries[i] = v[1];
		  }));
		  return isKeyedIterable ? KeyedSeq(entries) : isIndexed(iterable) ? IndexedSeq(entries) : SetSeq(entries);
		}
		function maxFactory(iterable, comparator, mapper) {
		  if (!comparator) {
		    comparator = defaultComparator;
		  }
		  if (mapper) {
		    var entry = iterable.toSeq().map((function(v, k) {
		      return [v, mapper(v, k, iterable)];
		    })).reduce((function(a, b) {
		      return _maxCompare(comparator, a[1], b[1]) ? b : a;
		    }));
		    return entry && entry[0];
		  } else {
		    return iterable.reduce((function(a, b) {
		      return _maxCompare(comparator, a, b) ? b : a;
		    }));
		  }
		}
		function _maxCompare(comparator, a, b) {
		  var comp = comparator(b, a);
		  return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
		}
		function reify(iter, seq) {
		  return isSeq(iter) ? seq : iter.constructor(seq);
		}
		function validateEntry(entry) {
		  if (entry !== Object(entry)) {
		    throw new TypeError('Expected [K, V] tuple: ' + entry);
		  }
		}
		function resolveSize(iter) {
		  assertNotInfinite(iter.size);
		  return ensureSize(iter);
		}
		function iterableClass(iterable) {
		  return isKeyed(iterable) ? KeyedIterable : isIndexed(iterable) ? IndexedIterable : SetIterable;
		}
		function makeSequence(iterable) {
		  return Object.create((isKeyed(iterable) ? KeyedSeq : isIndexed(iterable) ? IndexedSeq : SetSeq).prototype);
		}
		function cacheResultThrough() {
		  if (this._iter.cacheResult) {
		    this._iter.cacheResult();
		    this.size = this._iter.size;
		    return this;
		  } else {
		    return Seq.prototype.cacheResult.call(this);
		  }
		}
		function defaultComparator(a, b) {
		  return a > b ? 1 : a < b ? -1 : 0;
		}
		var List = function List(value) {
		  var empty = emptyList();
		  if (value === null || value === undefined) {
		    return empty;
		  }
		  if (isList(value)) {
		    return value;
		  }
		  var iter = IndexedIterable(value);
		  var size = iter.size;
		  if (size === 0) {
		    return empty;
		  }
		  assertNotInfinite(size);
		  if (size > 0 && size < SIZE) {
		    return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
		  }
		  return empty.withMutations((function(list) {
		    list.setSize(size);
		    iter.forEach((function(v, i) {
		      return list.set(i, v);
		    }));
		  }));
		};
		($traceurRuntime.createClass)(List, {
		  toString: function() {
		    return this.__toString('List [', ']');
		  },
		  get: function(index, notSetValue) {
		    index = wrapIndex(this, index);
		    if (index < 0 || index >= this.size) {
		      return notSetValue;
		    }
		    index += this._origin;
		    var node = listNodeFor(this, index);
		    return node && node.array[index & MASK];
		  },
		  set: function(index, value) {
		    return updateList(this, index, value);
		  },
		  remove: function(index) {
		    return !this.has(index) ? this : index === 0 ? this.shift() : index === this.size - 1 ? this.pop() : this.splice(index, 1);
		  },
		  clear: function() {
		    if (this.size === 0) {
		      return this;
		    }
		    if (this.__ownerID) {
		      this.size = this._origin = this._capacity = 0;
		      this._level = SHIFT;
		      this._root = this._tail = null;
		      this.__hash = undefined;
		      this.__altered = true;
		      return this;
		    }
		    return emptyList();
		  },
		  push: function() {
		    var values = arguments;
		    var oldSize = this.size;
		    return this.withMutations((function(list) {
		      setListBounds(list, 0, oldSize + values.length);
		      for (var ii = 0; ii < values.length; ii++) {
		        list.set(oldSize + ii, values[ii]);
		      }
		    }));
		  },
		  pop: function() {
		    return setListBounds(this, 0, -1);
		  },
		  unshift: function() {
		    var values = arguments;
		    return this.withMutations((function(list) {
		      setListBounds(list, -values.length);
		      for (var ii = 0; ii < values.length; ii++) {
		        list.set(ii, values[ii]);
		      }
		    }));
		  },
		  shift: function() {
		    return setListBounds(this, 1);
		  },
		  merge: function() {
		    return mergeIntoListWith(this, undefined, arguments);
		  },
		  mergeWith: function(merger) {
		    for (var iters = [],
		        $__7 = 1; $__7 < arguments.length; $__7++)
		      iters[$__7 - 1] = arguments[$__7];
		    return mergeIntoListWith(this, merger, iters);
		  },
		  mergeDeep: function() {
		    return mergeIntoListWith(this, deepMerger(undefined), arguments);
		  },
		  mergeDeepWith: function(merger) {
		    for (var iters = [],
		        $__8 = 1; $__8 < arguments.length; $__8++)
		      iters[$__8 - 1] = arguments[$__8];
		    return mergeIntoListWith(this, deepMerger(merger), iters);
		  },
		  setSize: function(size) {
		    return setListBounds(this, 0, size);
		  },
		  slice: function(begin, end) {
		    var size = this.size;
		    if (wholeSlice(begin, end, size)) {
		      return this;
		    }
		    return setListBounds(this, resolveBegin(begin, size), resolveEnd(end, size));
		  },
		  __iterator: function(type, reverse) {
		    var index = 0;
		    var values = iterateList(this, reverse);
		    return new Iterator((function() {
		      var value = values();
		      return value === DONE ? iteratorDone() : iteratorValue(type, index++, value);
		    }));
		  },
		  __iterate: function(fn, reverse) {
		    var index = 0;
		    var values = iterateList(this, reverse);
		    var value;
		    while ((value = values()) !== DONE) {
		      if (fn(value, index++, this) === false) {
		        break;
		      }
		    }
		    return index;
		  },
		  __ensureOwner: function(ownerID) {
		    if (ownerID === this.__ownerID) {
		      return this;
		    }
		    if (!ownerID) {
		      this.__ownerID = ownerID;
		      return this;
		    }
		    return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
		  }
		}, {of: function() {
		    return this(arguments);
		  }}, IndexedCollection);
		function isList(maybeList) {
		  return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
		}
		List.isList = isList;
		var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';
		var ListPrototype = List.prototype;
		ListPrototype[IS_LIST_SENTINEL] = true;
		ListPrototype[DELETE] = ListPrototype.remove;
		ListPrototype.setIn = MapPrototype.setIn;
		ListPrototype.deleteIn = ListPrototype.removeIn = MapPrototype.removeIn;
		ListPrototype.update = MapPrototype.update;
		ListPrototype.updateIn = MapPrototype.updateIn;
		ListPrototype.mergeIn = MapPrototype.mergeIn;
		ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
		ListPrototype.withMutations = MapPrototype.withMutations;
		ListPrototype.asMutable = MapPrototype.asMutable;
		ListPrototype.asImmutable = MapPrototype.asImmutable;
		ListPrototype.wasAltered = MapPrototype.wasAltered;
		var VNode = function VNode(array, ownerID) {
		  this.array = array;
		  this.ownerID = ownerID;
		};
		var $VNode = VNode;
		($traceurRuntime.createClass)(VNode, {
		  removeBefore: function(ownerID, level, index) {
		    if (index === level ? 1 << level : 0 || this.array.length === 0) {
		      return this;
		    }
		    var originIndex = (index >>> level) & MASK;
		    if (originIndex >= this.array.length) {
		      return new $VNode([], ownerID);
		    }
		    var removingFirst = originIndex === 0;
		    var newChild;
		    if (level > 0) {
		      var oldChild = this.array[originIndex];
		      newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
		      if (newChild === oldChild && removingFirst) {
		        return this;
		      }
		    }
		    if (removingFirst && !newChild) {
		      return this;
		    }
		    var editable = editableVNode(this, ownerID);
		    if (!removingFirst) {
		      for (var ii = 0; ii < originIndex; ii++) {
		        editable.array[ii] = undefined;
		      }
		    }
		    if (newChild) {
		      editable.array[originIndex] = newChild;
		    }
		    return editable;
		  },
		  removeAfter: function(ownerID, level, index) {
		    if (index === level ? 1 << level : 0 || this.array.length === 0) {
		      return this;
		    }
		    var sizeIndex = ((index - 1) >>> level) & MASK;
		    if (sizeIndex >= this.array.length) {
		      return this;
		    }
		    var removingLast = sizeIndex === this.array.length - 1;
		    var newChild;
		    if (level > 0) {
		      var oldChild = this.array[sizeIndex];
		      newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
		      if (newChild === oldChild && removingLast) {
		        return this;
		      }
		    }
		    if (removingLast && !newChild) {
		      return this;
		    }
		    var editable = editableVNode(this, ownerID);
		    if (!removingLast) {
		      editable.array.pop();
		    }
		    if (newChild) {
		      editable.array[sizeIndex] = newChild;
		    }
		    return editable;
		  }
		}, {});
		var DONE = {};
		function iterateList(list, reverse) {
		  var left = list._origin;
		  var right = list._capacity;
		  var tailPos = getTailOffset(right);
		  var tail = list._tail;
		  return iterateNodeOrLeaf(list._root, list._level, 0);
		  function iterateNodeOrLeaf(node, level, offset) {
		    return level === 0 ? iterateLeaf(node, offset) : iterateNode(node, level, offset);
		  }
		  function iterateLeaf(node, offset) {
		    var array = offset === tailPos ? tail && tail.array : node && node.array;
		    var from = offset > left ? 0 : left - offset;
		    var to = right - offset;
		    if (to > SIZE) {
		      to = SIZE;
		    }
		    return (function() {
		      if (from === to) {
		        return DONE;
		      }
		      var idx = reverse ? --to : from++;
		      return array && array[idx];
		    });
		  }
		  function iterateNode(node, level, offset) {
		    var values;
		    var array = node && node.array;
		    var from = offset > left ? 0 : (left - offset) >> level;
		    var to = ((right - offset) >> level) + 1;
		    if (to > SIZE) {
		      to = SIZE;
		    }
		    return (function() {
		      do {
		        if (values) {
		          var value = values();
		          if (value !== DONE) {
		            return value;
		          }
		          values = null;
		        }
		        if (from === to) {
		          return DONE;
		        }
		        var idx = reverse ? --to : from++;
		        values = iterateNodeOrLeaf(array && array[idx], level - SHIFT, offset + (idx << level));
		      } while (true);
		    });
		  }
		}
		function makeList(origin, capacity, level, root, tail, ownerID, hash) {
		  var list = Object.create(ListPrototype);
		  list.size = capacity - origin;
		  list._origin = origin;
		  list._capacity = capacity;
		  list._level = level;
		  list._root = root;
		  list._tail = tail;
		  list.__ownerID = ownerID;
		  list.__hash = hash;
		  list.__altered = false;
		  return list;
		}
		var EMPTY_LIST;
		function emptyList() {
		  return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
		}
		function updateList(list, index, value) {
		  index = wrapIndex(list, index);
		  if (index >= list.size || index < 0) {
		    return list.withMutations((function(list) {
		      index < 0 ? setListBounds(list, index).set(0, value) : setListBounds(list, 0, index + 1).set(index, value);
		    }));
		  }
		  index += list._origin;
		  var newTail = list._tail;
		  var newRoot = list._root;
		  var didAlter = MakeRef(DID_ALTER);
		  if (index >= getTailOffset(list._capacity)) {
		    newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
		  } else {
		    newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
		  }
		  if (!didAlter.value) {
		    return list;
		  }
		  if (list.__ownerID) {
		    list._root = newRoot;
		    list._tail = newTail;
		    list.__hash = undefined;
		    list.__altered = true;
		    return list;
		  }
		  return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
		}
		function updateVNode(node, ownerID, level, index, value, didAlter) {
		  var idx = (index >>> level) & MASK;
		  var nodeHas = node && idx < node.array.length;
		  if (!nodeHas && value === undefined) {
		    return node;
		  }
		  var newNode;
		  if (level > 0) {
		    var lowerNode = node && node.array[idx];
		    var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
		    if (newLowerNode === lowerNode) {
		      return node;
		    }
		    newNode = editableVNode(node, ownerID);
		    newNode.array[idx] = newLowerNode;
		    return newNode;
		  }
		  if (nodeHas && node.array[idx] === value) {
		    return node;
		  }
		  SetRef(didAlter);
		  newNode = editableVNode(node, ownerID);
		  if (value === undefined && idx === newNode.array.length - 1) {
		    newNode.array.pop();
		  } else {
		    newNode.array[idx] = value;
		  }
		  return newNode;
		}
		function editableVNode(node, ownerID) {
		  if (ownerID && node && ownerID === node.ownerID) {
		    return node;
		  }
		  return new VNode(node ? node.array.slice() : [], ownerID);
		}
		function listNodeFor(list, rawIndex) {
		  if (rawIndex >= getTailOffset(list._capacity)) {
		    return list._tail;
		  }
		  if (rawIndex < 1 << (list._level + SHIFT)) {
		    var node = list._root;
		    var level = list._level;
		    while (node && level > 0) {
		      node = node.array[(rawIndex >>> level) & MASK];
		      level -= SHIFT;
		    }
		    return node;
		  }
		}
		function setListBounds(list, begin, end) {
		  var owner = list.__ownerID || new OwnerID();
		  var oldOrigin = list._origin;
		  var oldCapacity = list._capacity;
		  var newOrigin = oldOrigin + begin;
		  var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
		  if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
		    return list;
		  }
		  if (newOrigin >= newCapacity) {
		    return list.clear();
		  }
		  var newLevel = list._level;
		  var newRoot = list._root;
		  var offsetShift = 0;
		  while (newOrigin + offsetShift < 0) {
		    newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
		    newLevel += SHIFT;
		    offsetShift += 1 << newLevel;
		  }
		  if (offsetShift) {
		    newOrigin += offsetShift;
		    oldOrigin += offsetShift;
		    newCapacity += offsetShift;
		    oldCapacity += offsetShift;
		  }
		  var oldTailOffset = getTailOffset(oldCapacity);
		  var newTailOffset = getTailOffset(newCapacity);
		  while (newTailOffset >= 1 << (newLevel + SHIFT)) {
		    newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
		    newLevel += SHIFT;
		  }
		  var oldTail = list._tail;
		  var newTail = newTailOffset < oldTailOffset ? listNodeFor(list, newCapacity - 1) : newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;
		  if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
		    newRoot = editableVNode(newRoot, owner);
		    var node = newRoot;
		    for (var level = newLevel; level > SHIFT; level -= SHIFT) {
		      var idx = (oldTailOffset >>> level) & MASK;
		      node = node.array[idx] = editableVNode(node.array[idx], owner);
		    }
		    node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
		  }
		  if (newCapacity < oldCapacity) {
		    newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
		  }
		  if (newOrigin >= newTailOffset) {
		    newOrigin -= newTailOffset;
		    newCapacity -= newTailOffset;
		    newLevel = SHIFT;
		    newRoot = null;
		    newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);
		  } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
		    offsetShift = 0;
		    while (newRoot) {
		      var beginIndex = (newOrigin >>> newLevel) & MASK;
		      if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
		        break;
		      }
		      if (beginIndex) {
		        offsetShift += (1 << newLevel) * beginIndex;
		      }
		      newLevel -= SHIFT;
		      newRoot = newRoot.array[beginIndex];
		    }
		    if (newRoot && newOrigin > oldOrigin) {
		      newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
		    }
		    if (newRoot && newTailOffset < oldTailOffset) {
		      newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
		    }
		    if (offsetShift) {
		      newOrigin -= offsetShift;
		      newCapacity -= offsetShift;
		    }
		  }
		  if (list.__ownerID) {
		    list.size = newCapacity - newOrigin;
		    list._origin = newOrigin;
		    list._capacity = newCapacity;
		    list._level = newLevel;
		    list._root = newRoot;
		    list._tail = newTail;
		    list.__hash = undefined;
		    list.__altered = true;
		    return list;
		  }
		  return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
		}
		function mergeIntoListWith(list, merger, iterables) {
		  var iters = [];
		  var maxSize = 0;
		  for (var ii = 0; ii < iterables.length; ii++) {
		    var value = iterables[ii];
		    var iter = IndexedIterable(value);
		    if (iter.size > maxSize) {
		      maxSize = iter.size;
		    }
		    if (!isIterable(value)) {
		      iter = iter.map((function(v) {
		        return fromJS(v);
		      }));
		    }
		    iters.push(iter);
		  }
		  if (maxSize > list.size) {
		    list = list.setSize(maxSize);
		  }
		  return mergeIntoCollectionWith(list, merger, iters);
		}
		function getTailOffset(size) {
		  return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
		}
		var OrderedMap = function OrderedMap(value) {
		  return value === null || value === undefined ? emptyOrderedMap() : isOrderedMap(value) ? value : emptyOrderedMap().withMutations((function(map) {
		    var iter = KeyedIterable(value);
		    assertNotInfinite(iter.size);
		    iter.forEach((function(v, k) {
		      return map.set(k, v);
		    }));
		  }));
		};
		($traceurRuntime.createClass)(OrderedMap, {
		  toString: function() {
		    return this.__toString('OrderedMap {', '}');
		  },
		  get: function(k, notSetValue) {
		    var index = this._map.get(k);
		    return index !== undefined ? this._list.get(index)[1] : notSetValue;
		  },
		  clear: function() {
		    if (this.size === 0) {
		      return this;
		    }
		    if (this.__ownerID) {
		      this.size = 0;
		      this._map.clear();
		      this._list.clear();
		      return this;
		    }
		    return emptyOrderedMap();
		  },
		  set: function(k, v) {
		    return updateOrderedMap(this, k, v);
		  },
		  remove: function(k) {
		    return updateOrderedMap(this, k, NOT_SET);
		  },
		  wasAltered: function() {
		    return this._map.wasAltered() || this._list.wasAltered();
		  },
		  __iterate: function(fn, reverse) {
		    var $__0 = this;
		    return this._list.__iterate((function(entry) {
		      return entry && fn(entry[1], entry[0], $__0);
		    }), reverse);
		  },
		  __iterator: function(type, reverse) {
		    return this._list.fromEntrySeq().__iterator(type, reverse);
		  },
		  __ensureOwner: function(ownerID) {
		    if (ownerID === this.__ownerID) {
		      return this;
		    }
		    var newMap = this._map.__ensureOwner(ownerID);
		    var newList = this._list.__ensureOwner(ownerID);
		    if (!ownerID) {
		      this.__ownerID = ownerID;
		      this._map = newMap;
		      this._list = newList;
		      return this;
		    }
		    return makeOrderedMap(newMap, newList, ownerID, this.__hash);
		  }
		}, {of: function() {
		    return this(arguments);
		  }}, Map);
		function isOrderedMap(maybeOrderedMap) {
		  return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
		}
		OrderedMap.isOrderedMap = isOrderedMap;
		OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
		OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;
		function makeOrderedMap(map, list, ownerID, hash) {
		  var omap = Object.create(OrderedMap.prototype);
		  omap.size = map ? map.size : 0;
		  omap._map = map;
		  omap._list = list;
		  omap.__ownerID = ownerID;
		  omap.__hash = hash;
		  return omap;
		}
		var EMPTY_ORDERED_MAP;
		function emptyOrderedMap() {
		  return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
		}
		function updateOrderedMap(omap, k, v) {
		  var map = omap._map;
		  var list = omap._list;
		  var i = map.get(k);
		  var has = i !== undefined;
		  var newMap;
		  var newList;
		  if (v === NOT_SET) {
		    if (!has) {
		      return omap;
		    }
		    if (list.size >= SIZE && list.size >= map.size * 2) {
		      newList = list.filter((function(entry, idx) {
		        return entry !== undefined && i !== idx;
		      }));
		      newMap = newList.toKeyedSeq().map((function(entry) {
		        return entry[0];
		      })).flip().toMap();
		      if (omap.__ownerID) {
		        newMap.__ownerID = newList.__ownerID = omap.__ownerID;
		      }
		    } else {
		      newMap = map.remove(k);
		      newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
		    }
		  } else {
		    if (has) {
		      if (v === list.get(i)[1]) {
		        return omap;
		      }
		      newMap = map;
		      newList = list.set(i, [k, v]);
		    } else {
		      newMap = map.set(k, list.size);
		      newList = list.set(list.size, [k, v]);
		    }
		  }
		  if (omap.__ownerID) {
		    omap.size = newMap.size;
		    omap._map = newMap;
		    omap._list = newList;
		    omap.__hash = undefined;
		    return omap;
		  }
		  return makeOrderedMap(newMap, newList);
		}
		var Stack = function Stack(value) {
		  return value === null || value === undefined ? emptyStack() : isStack(value) ? value : emptyStack().unshiftAll(value);
		};
		var $Stack = Stack;
		($traceurRuntime.createClass)(Stack, {
		  toString: function() {
		    return this.__toString('Stack [', ']');
		  },
		  get: function(index, notSetValue) {
		    var head = this._head;
		    while (head && index--) {
		      head = head.next;
		    }
		    return head ? head.value : notSetValue;
		  },
		  peek: function() {
		    return this._head && this._head.value;
		  },
		  push: function() {
		    if (arguments.length === 0) {
		      return this;
		    }
		    var newSize = this.size + arguments.length;
		    var head = this._head;
		    for (var ii = arguments.length - 1; ii >= 0; ii--) {
		      head = {
		        value: arguments[ii],
		        next: head
		      };
		    }
		    if (this.__ownerID) {
		      this.size = newSize;
		      this._head = head;
		      this.__hash = undefined;
		      this.__altered = true;
		      return this;
		    }
		    return makeStack(newSize, head);
		  },
		  pushAll: function(iter) {
		    iter = IndexedIterable(iter);
		    if (iter.size === 0) {
		      return this;
		    }
		    assertNotInfinite(iter.size);
		    var newSize = this.size;
		    var head = this._head;
		    iter.reverse().forEach((function(value) {
		      newSize++;
		      head = {
		        value: value,
		        next: head
		      };
		    }));
		    if (this.__ownerID) {
		      this.size = newSize;
		      this._head = head;
		      this.__hash = undefined;
		      this.__altered = true;
		      return this;
		    }
		    return makeStack(newSize, head);
		  },
		  pop: function() {
		    return this.slice(1);
		  },
		  unshift: function() {
		    return this.push.apply(this, arguments);
		  },
		  unshiftAll: function(iter) {
		    return this.pushAll(iter);
		  },
		  shift: function() {
		    return this.pop.apply(this, arguments);
		  },
		  clear: function() {
		    if (this.size === 0) {
		      return this;
		    }
		    if (this.__ownerID) {
		      this.size = 0;
		      this._head = undefined;
		      this.__hash = undefined;
		      this.__altered = true;
		      return this;
		    }
		    return emptyStack();
		  },
		  slice: function(begin, end) {
		    if (wholeSlice(begin, end, this.size)) {
		      return this;
		    }
		    var resolvedBegin = resolveBegin(begin, this.size);
		    var resolvedEnd = resolveEnd(end, this.size);
		    if (resolvedEnd !== this.size) {
		      return $traceurRuntime.superCall(this, $Stack.prototype, "slice", [begin, end]);
		    }
		    var newSize = this.size - resolvedBegin;
		    var head = this._head;
		    while (resolvedBegin--) {
		      head = head.next;
		    }
		    if (this.__ownerID) {
		      this.size = newSize;
		      this._head = head;
		      this.__hash = undefined;
		      this.__altered = true;
		      return this;
		    }
		    return makeStack(newSize, head);
		  },
		  __ensureOwner: function(ownerID) {
		    if (ownerID === this.__ownerID) {
		      return this;
		    }
		    if (!ownerID) {
		      this.__ownerID = ownerID;
		      this.__altered = false;
		      return this;
		    }
		    return makeStack(this.size, this._head, ownerID, this.__hash);
		  },
		  __iterate: function(fn, reverse) {
		    if (reverse) {
		      return this.toSeq().cacheResult.__iterate(fn, reverse);
		    }
		    var iterations = 0;
		    var node = this._head;
		    while (node) {
		      if (fn(node.value, iterations++, this) === false) {
		        break;
		      }
		      node = node.next;
		    }
		    return iterations;
		  },
		  __iterator: function(type, reverse) {
		    if (reverse) {
		      return this.toSeq().cacheResult().__iterator(type, reverse);
		    }
		    var iterations = 0;
		    var node = this._head;
		    return new Iterator((function() {
		      if (node) {
		        var value = node.value;
		        node = node.next;
		        return iteratorValue(type, iterations++, value);
		      }
		      return iteratorDone();
		    }));
		  }
		}, {of: function() {
		    return this(arguments);
		  }}, IndexedCollection);
		function isStack(maybeStack) {
		  return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
		}
		Stack.isStack = isStack;
		var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';
		var StackPrototype = Stack.prototype;
		StackPrototype[IS_STACK_SENTINEL] = true;
		StackPrototype.withMutations = MapPrototype.withMutations;
		StackPrototype.asMutable = MapPrototype.asMutable;
		StackPrototype.asImmutable = MapPrototype.asImmutable;
		StackPrototype.wasAltered = MapPrototype.wasAltered;
		function makeStack(size, head, ownerID, hash) {
		  var map = Object.create(StackPrototype);
		  map.size = size;
		  map._head = head;
		  map.__ownerID = ownerID;
		  map.__hash = hash;
		  map.__altered = false;
		  return map;
		}
		var EMPTY_STACK;
		function emptyStack() {
		  return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
		}
		var Set = function Set(value) {
		  return value === null || value === undefined ? emptySet() : isSet(value) ? value : emptySet().withMutations((function(set) {
		    var iter = SetIterable(value);
		    assertNotInfinite(iter.size);
		    iter.forEach((function(v) {
		      return set.add(v);
		    }));
		  }));
		};
		($traceurRuntime.createClass)(Set, {
		  toString: function() {
		    return this.__toString('Set {', '}');
		  },
		  has: function(value) {
		    return this._map.has(value);
		  },
		  add: function(value) {
		    return updateSet(this, this._map.set(value, true));
		  },
		  remove: function(value) {
		    return updateSet(this, this._map.remove(value));
		  },
		  clear: function() {
		    return updateSet(this, this._map.clear());
		  },
		  union: function() {
		    for (var iters = [],
		        $__9 = 0; $__9 < arguments.length; $__9++)
		      iters[$__9] = arguments[$__9];
		    iters = iters.filter((function(x) {
		      return x.size !== 0;
		    }));
		    if (iters.length === 0) {
		      return this;
		    }
		    if (this.size === 0 && iters.length === 1) {
		      return this.constructor(iters[0]);
		    }
		    return this.withMutations((function(set) {
		      for (var ii = 0; ii < iters.length; ii++) {
		        SetIterable(iters[ii]).forEach((function(value) {
		          return set.add(value);
		        }));
		      }
		    }));
		  },
		  intersect: function() {
		    for (var iters = [],
		        $__10 = 0; $__10 < arguments.length; $__10++)
		      iters[$__10] = arguments[$__10];
		    if (iters.length === 0) {
		      return this;
		    }
		    iters = iters.map((function(iter) {
		      return SetIterable(iter);
		    }));
		    var originalSet = this;
		    return this.withMutations((function(set) {
		      originalSet.forEach((function(value) {
		        if (!iters.every((function(iter) {
		          return iter.contains(value);
		        }))) {
		          set.remove(value);
		        }
		      }));
		    }));
		  },
		  subtract: function() {
		    for (var iters = [],
		        $__11 = 0; $__11 < arguments.length; $__11++)
		      iters[$__11] = arguments[$__11];
		    if (iters.length === 0) {
		      return this;
		    }
		    iters = iters.map((function(iter) {
		      return SetIterable(iter);
		    }));
		    var originalSet = this;
		    return this.withMutations((function(set) {
		      originalSet.forEach((function(value) {
		        if (iters.some((function(iter) {
		          return iter.contains(value);
		        }))) {
		          set.remove(value);
		        }
		      }));
		    }));
		  },
		  merge: function() {
		    return this.union.apply(this, arguments);
		  },
		  mergeWith: function(merger) {
		    for (var iters = [],
		        $__12 = 1; $__12 < arguments.length; $__12++)
		      iters[$__12 - 1] = arguments[$__12];
		    return this.union.apply(this, iters);
		  },
		  sort: function(comparator) {
		    return OrderedSet(sortFactory(this, comparator));
		  },
		  sortBy: function(mapper, comparator) {
		    return OrderedSet(sortFactory(this, comparator, mapper));
		  },
		  wasAltered: function() {
		    return this._map.wasAltered();
		  },
		  __iterate: function(fn, reverse) {
		    var $__0 = this;
		    return this._map.__iterate((function(_, k) {
		      return fn(k, k, $__0);
		    }), reverse);
		  },
		  __iterator: function(type, reverse) {
		    return this._map.map((function(_, k) {
		      return k;
		    })).__iterator(type, reverse);
		  },
		  __ensureOwner: function(ownerID) {
		    if (ownerID === this.__ownerID) {
		      return this;
		    }
		    var newMap = this._map.__ensureOwner(ownerID);
		    if (!ownerID) {
		      this.__ownerID = ownerID;
		      this._map = newMap;
		      return this;
		    }
		    return this.__make(newMap, ownerID);
		  }
		}, {
		  of: function() {
		    return this(arguments);
		  },
		  fromKeys: function(value) {
		    return this(KeyedIterable(value).keySeq());
		  }
		}, SetCollection);
		function isSet(maybeSet) {
		  return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
		}
		Set.isSet = isSet;
		var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';
		var SetPrototype = Set.prototype;
		SetPrototype[IS_SET_SENTINEL] = true;
		SetPrototype[DELETE] = SetPrototype.remove;
		SetPrototype.mergeDeep = SetPrototype.merge;
		SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
		SetPrototype.withMutations = MapPrototype.withMutations;
		SetPrototype.asMutable = MapPrototype.asMutable;
		SetPrototype.asImmutable = MapPrototype.asImmutable;
		SetPrototype.__empty = emptySet;
		SetPrototype.__make = makeSet;
		function updateSet(set, newMap) {
		  if (set.__ownerID) {
		    set.size = newMap.size;
		    set._map = newMap;
		    return set;
		  }
		  return newMap === set._map ? set : newMap.size === 0 ? set.__empty() : set.__make(newMap);
		}
		function makeSet(map, ownerID) {
		  var set = Object.create(SetPrototype);
		  set.size = map ? map.size : 0;
		  set._map = map;
		  set.__ownerID = ownerID;
		  return set;
		}
		var EMPTY_SET;
		function emptySet() {
		  return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
		}
		var OrderedSet = function OrderedSet(value) {
		  return value === null || value === undefined ? emptyOrderedSet() : isOrderedSet(value) ? value : emptyOrderedSet().withMutations((function(set) {
		    var iter = SetIterable(value);
		    assertNotInfinite(iter.size);
		    iter.forEach((function(v) {
		      return set.add(v);
		    }));
		  }));
		};
		($traceurRuntime.createClass)(OrderedSet, {toString: function() {
		    return this.__toString('OrderedSet {', '}');
		  }}, {
		  of: function() {
		    return this(arguments);
		  },
		  fromKeys: function(value) {
		    return this(KeyedIterable(value).keySeq());
		  }
		}, Set);
		function isOrderedSet(maybeOrderedSet) {
		  return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
		}
		OrderedSet.isOrderedSet = isOrderedSet;
		var OrderedSetPrototype = OrderedSet.prototype;
		OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;
		OrderedSetPrototype.__empty = emptyOrderedSet;
		OrderedSetPrototype.__make = makeOrderedSet;
		function makeOrderedSet(map, ownerID) {
		  var set = Object.create(OrderedSetPrototype);
		  set.size = map ? map.size : 0;
		  set._map = map;
		  set.__ownerID = ownerID;
		  return set;
		}
		var EMPTY_ORDERED_SET;
		function emptyOrderedSet() {
		  return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
		}
		var Record = function Record(defaultValues, name) {
		  var RecordType = function Record(values) {
		    if (!(this instanceof RecordType)) {
		      return new RecordType(values);
		    }
		    this._map = Map(values);
		  };
		  var keys = Object.keys(defaultValues);
		  var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
		  RecordTypePrototype.constructor = RecordType;
		  name && (RecordTypePrototype._name = name);
		  RecordTypePrototype._defaultValues = defaultValues;
		  RecordTypePrototype._keys = keys;
		  RecordTypePrototype.size = keys.length;
		  try {
		    keys.forEach((function(key) {
		      Object.defineProperty(RecordType.prototype, key, {
		        get: function() {
		          return this.get(key);
		        },
		        set: function(value) {
		          invariant(this.__ownerID, 'Cannot set on an immutable record.');
		          this.set(key, value);
		        }
		      });
		    }));
		  } catch (error) {}
		  return RecordType;
		};
		($traceurRuntime.createClass)(Record, {
		  toString: function() {
		    return this.__toString(recordName(this) + ' {', '}');
		  },
		  has: function(k) {
		    return this._defaultValues.hasOwnProperty(k);
		  },
		  get: function(k, notSetValue) {
		    if (!this.has(k)) {
		      return notSetValue;
		    }
		    var defaultVal = this._defaultValues[k];
		    return this._map ? this._map.get(k, defaultVal) : defaultVal;
		  },
		  clear: function() {
		    if (this.__ownerID) {
		      this._map && this._map.clear();
		      return this;
		    }
		    var SuperRecord = Object.getPrototypeOf(this).constructor;
		    return SuperRecord._empty || (SuperRecord._empty = makeRecord(this, emptyMap()));
		  },
		  set: function(k, v) {
		    if (!this.has(k)) {
		      throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
		    }
		    var newMap = this._map && this._map.set(k, v);
		    if (this.__ownerID || newMap === this._map) {
		      return this;
		    }
		    return makeRecord(this, newMap);
		  },
		  remove: function(k) {
		    if (!this.has(k)) {
		      return this;
		    }
		    var newMap = this._map && this._map.remove(k);
		    if (this.__ownerID || newMap === this._map) {
		      return this;
		    }
		    return makeRecord(this, newMap);
		  },
		  wasAltered: function() {
		    return this._map.wasAltered();
		  },
		  __iterator: function(type, reverse) {
		    var $__0 = this;
		    return KeyedIterable(this._defaultValues).map((function(_, k) {
		      return $__0.get(k);
		    })).__iterator(type, reverse);
		  },
		  __iterate: function(fn, reverse) {
		    var $__0 = this;
		    return KeyedIterable(this._defaultValues).map((function(_, k) {
		      return $__0.get(k);
		    })).__iterate(fn, reverse);
		  },
		  __ensureOwner: function(ownerID) {
		    if (ownerID === this.__ownerID) {
		      return this;
		    }
		    var newMap = this._map && this._map.__ensureOwner(ownerID);
		    if (!ownerID) {
		      this.__ownerID = ownerID;
		      this._map = newMap;
		      return this;
		    }
		    return makeRecord(this, newMap, ownerID);
		  }
		}, {}, KeyedCollection);
		var RecordPrototype = Record.prototype;
		RecordPrototype[DELETE] = RecordPrototype.remove;
		RecordPrototype.deleteIn = RecordPrototype.removeIn = MapPrototype.removeIn;
		RecordPrototype.merge = MapPrototype.merge;
		RecordPrototype.mergeWith = MapPrototype.mergeWith;
		RecordPrototype.mergeIn = MapPrototype.mergeIn;
		RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
		RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
		RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
		RecordPrototype.setIn = MapPrototype.setIn;
		RecordPrototype.update = MapPrototype.update;
		RecordPrototype.updateIn = MapPrototype.updateIn;
		RecordPrototype.withMutations = MapPrototype.withMutations;
		RecordPrototype.asMutable = MapPrototype.asMutable;
		RecordPrototype.asImmutable = MapPrototype.asImmutable;
		function makeRecord(likeRecord, map, ownerID) {
		  var record = Object.create(Object.getPrototypeOf(likeRecord));
		  record._map = map;
		  record.__ownerID = ownerID;
		  return record;
		}
		function recordName(record) {
		  return record._name || record.constructor.name;
		}
		var Range = function Range(start, end, step) {
		  if (!(this instanceof $Range)) {
		    return new $Range(start, end, step);
		  }
		  invariant(step !== 0, 'Cannot step a Range by 0');
		  start = start || 0;
		  if (end === undefined) {
		    end = Infinity;
		  }
		  if (start === end && __EMPTY_RANGE) {
		    return __EMPTY_RANGE;
		  }
		  step = step === undefined ? 1 : Math.abs(step);
		  if (end < start) {
		    step = -step;
		  }
		  this._start = start;
		  this._end = end;
		  this._step = step;
		  this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
		};
		var $Range = Range;
		($traceurRuntime.createClass)(Range, {
		  toString: function() {
		    if (this.size === 0) {
		      return 'Range []';
		    }
		    return 'Range [ ' + this._start + '...' + this._end + (this._step > 1 ? ' by ' + this._step : '') + ' ]';
		  },
		  get: function(index, notSetValue) {
		    return this.has(index) ? this._start + wrapIndex(this, index) * this._step : notSetValue;
		  },
		  contains: function(searchValue) {
		    var possibleIndex = (searchValue - this._start) / this._step;
		    return possibleIndex >= 0 && possibleIndex < this.size && possibleIndex === Math.floor(possibleIndex);
		  },
		  slice: function(begin, end) {
		    if (wholeSlice(begin, end, this.size)) {
		      return this;
		    }
		    begin = resolveBegin(begin, this.size);
		    end = resolveEnd(end, this.size);
		    if (end <= begin) {
		      return __EMPTY_RANGE;
		    }
		    return new $Range(this.get(begin, this._end), this.get(end, this._end), this._step);
		  },
		  indexOf: function(searchValue) {
		    var offsetValue = searchValue - this._start;
		    if (offsetValue % this._step === 0) {
		      var index = offsetValue / this._step;
		      if (index >= 0 && index < this.size) {
		        return index;
		      }
		    }
		    return -1;
		  },
		  lastIndexOf: function(searchValue) {
		    return this.indexOf(searchValue);
		  },
		  take: function(amount) {
		    return this.slice(0, Math.max(0, amount));
		  },
		  skip: function(amount) {
		    return this.slice(Math.max(0, amount));
		  },
		  __iterate: function(fn, reverse) {
		    var maxIndex = this.size - 1;
		    var step = this._step;
		    var value = reverse ? this._start + maxIndex * step : this._start;
		    for (var ii = 0; ii <= maxIndex; ii++) {
		      if (fn(value, ii, this) === false) {
		        return ii + 1;
		      }
		      value += reverse ? -step : step;
		    }
		    return ii;
		  },
		  __iterator: function(type, reverse) {
		    var maxIndex = this.size - 1;
		    var step = this._step;
		    var value = reverse ? this._start + maxIndex * step : this._start;
		    var ii = 0;
		    return new Iterator((function() {
		      var v = value;
		      value += reverse ? -step : step;
		      return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
		    }));
		  },
		  equals: function(other) {
		    return other instanceof $Range ? this._start === other._start && this._end === other._end && this._step === other._step : deepEqual(this, other);
		  }
		}, {}, IndexedSeq);
		var RangePrototype = Range.prototype;
		RangePrototype.__toJS = RangePrototype.toArray;
		RangePrototype.first = ListPrototype.first;
		RangePrototype.last = ListPrototype.last;
		var __EMPTY_RANGE = Range(0, 0);
		var Repeat = function Repeat(value, times) {
		  if (times <= 0 && EMPTY_REPEAT) {
		    return EMPTY_REPEAT;
		  }
		  if (!(this instanceof $Repeat)) {
		    return new $Repeat(value, times);
		  }
		  this._value = value;
		  this.size = times === undefined ? Infinity : Math.max(0, times);
		  if (this.size === 0) {
		    EMPTY_REPEAT = this;
		  }
		};
		var $Repeat = Repeat;
		($traceurRuntime.createClass)(Repeat, {
		  toString: function() {
		    if (this.size === 0) {
		      return 'Repeat []';
		    }
		    return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
		  },
		  get: function(index, notSetValue) {
		    return this.has(index) ? this._value : notSetValue;
		  },
		  contains: function(searchValue) {
		    return is(this._value, searchValue);
		  },
		  slice: function(begin, end) {
		    var size = this.size;
		    return wholeSlice(begin, end, size) ? this : new $Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
		  },
		  reverse: function() {
		    return this;
		  },
		  indexOf: function(searchValue) {
		    if (is(this._value, searchValue)) {
		      return 0;
		    }
		    return -1;
		  },
		  lastIndexOf: function(searchValue) {
		    if (is(this._value, searchValue)) {
		      return this.size;
		    }
		    return -1;
		  },
		  __iterate: function(fn, reverse) {
		    for (var ii = 0; ii < this.size; ii++) {
		      if (fn(this._value, ii, this) === false) {
		        return ii + 1;
		      }
		    }
		    return ii;
		  },
		  __iterator: function(type, reverse) {
		    var $__0 = this;
		    var ii = 0;
		    return new Iterator((function() {
		      return ii < $__0.size ? iteratorValue(type, ii++, $__0._value) : iteratorDone();
		    }));
		  },
		  equals: function(other) {
		    return other instanceof $Repeat ? is(this._value, other._value) : deepEqual(other);
		  }
		}, {}, IndexedSeq);
		var RepeatPrototype = Repeat.prototype;
		RepeatPrototype.last = RepeatPrototype.first;
		RepeatPrototype.has = RangePrototype.has;
		RepeatPrototype.take = RangePrototype.take;
		RepeatPrototype.skip = RangePrototype.skip;
		RepeatPrototype.__toJS = RangePrototype.__toJS;
		var EMPTY_REPEAT;
		var Immutable = {
		  Iterable: Iterable,
		  Seq: Seq,
		  Collection: Collection,
		  Map: Map,
		  OrderedMap: OrderedMap,
		  List: List,
		  Stack: Stack,
		  Set: Set,
		  OrderedSet: OrderedSet,
		  Record: Record,
		  Range: Range,
		  Repeat: Repeat,
		  is: is,
		  fromJS: fromJS
		};

		  return Immutable;
		}
		true ? module.exports = universalModule() :
		  typeof define === 'function' && define.amd ? define(universalModule) :
		    Immutable = universalModule();


	/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {

		/**
		 * Checks if the passed in value is a number
		 * @param {*} val
		 * @return {boolean}
		 */
		exports.isNumber = function(val) {
		  return typeof val == 'number' || objectToString(val) === '[object Number]'
		}

		/**
		 * Checks if the passed in value is a string
		 * @param {*} val
		 * @return {boolean}
		 */
		exports.isString = function(val) {
		  return typeof val == 'string' || objectToString(val) === '[object String]'
		}

		/**
		 * Checks if the passed in value is an array
		 * @param {*} val
		 * @return {boolean}
		 */
		exports.isArray = Array.isArray /* istanbul ignore next */|| function(val) {
		  return objectToString(val) === '[object Array]'
		}

		// taken from underscore source to account for browser descrepency
		/* istanbul ignore if  */
		if (typeof /./ != 'function' && typeof Int8Array != 'object') {
		  /**
		   * Checks if the passed in value is a function
		   * @param {*} val
		   * @return {boolean}
		   */
		  exports.isFunction = function(obj) {
		    return typeof obj == 'function' || false
		  }
		} else {
		  /**
		   * Checks if the passed in value is a function
		   * @param {*} val
		   * @return {boolean}
		   */
		  exports.isFunction = function(val) {
		    return toString.call(val) === '[object Function]'
		  }
		}

		/**
		 * Checks if the passed in value is af type Object
		 * @param {*} val
		 * @return {boolean}
		 */
		exports.isObject = function(obj) {
		  var type = typeof obj
		  return type === 'function' || type === 'object' && !!obj
		}

		/**
		 * Extends an object with the properties of additional objects
		 * @param {object} obj
		 * @param {object} objects
		 * @return {object}
		 */
		exports.extend = function(obj) {
		  var length = arguments.length

		  if (!obj || length < 2) return obj || {}

		  for (var index = 1; index < length; index++) {
		    var source = arguments[index]
		    var keys = Object.keys(source)
		    var l = keys.length

		    for (var i = 0; i < l; i++) {
		      var key = keys[i]
		      obj[key] = source[key]
		    }
		  }

		  return obj
		}

		/**
		 * Creates a shallow clone of an object
		 * @param {object} obj
		 * @return {object}
		 */
		exports.clone = function(obj) {
		  if (!exports.isObject(obj)) return obj
		  return exports.isArray(obj) ? obj.slice() : exports.extend({}, obj)
		}

		/**
		 * Iterates over a collection of elements yielding each iteration to an
		 * iteratee. The iteratee may be bound to the context argument and is invoked
		 * each time with three arguments (value, index|key, collection). Iteration may
		 * be exited early by explicitly returning false.
		 * @param {array|object|string} collection
		 * @param {function} iteratee
		 * @param {*} context
		 * @return {array|object|string}
		 */
		exports.each = function(collection, iteratee, context) {
		  var length = collection ? collection.length : 0
		  var i = -1
		  var keys, origIteratee

		  if (context) {
		    origIteratee = iteratee
		    iteratee = function(value, index, collection) {
		      return origIteratee.call(context, value, index, collection)
		    }
		  }

		  if (isLength(length)) {
		    while (++i < length) {
		      if (iteratee(collection[i], i, collection) === false) break
		    }
		  } else {
		    keys = Object.keys(collection)
		    length = keys.length
		    while (++i < length) {
		      if (iteratee(collection[keys[i]], keys[i], collection) === false) break
		    }
		  }

		  return collection
		}

		/**
		 * Returns a new function the invokes `func` with `partialArgs` prepended to
		 * any passed into the new function. Acts like `Array.prototype.bind`, except
		 * it does not alter `this` context.
		 * @param {function} func
		 * @param {*} partialArgs
		 * @return {function}
		 */
		exports.partial = function(func) {
		  var slice = Array.prototype.slice
		  var partialArgs = slice.call(arguments, 1)

		  return function() {
		    return func.apply(this, partialArgs.concat(slice.call(arguments)))
		  }
		}

		/**
		 * Returns the text value representation of an object
		 * @private
		 * @param {*} obj
		 * @return {string}
		 */
		function objectToString(obj) {
		  return obj && typeof obj == 'object' && toString.call(obj)
		}

		/**
		 * Checks if the value is a valid array-like length.
		 * @private
		 * @param {*} val
		 * @return {bool}
		 */
		function isLength(val) {
		  return typeof val == 'number'
		    && val > -1
		    && val % 1 == 0
		    && val <= Number.MAX_VALUE
		}


	/***/ },
	/* 9 */
	/***/ function(module, exports, __webpack_require__) {

		/**
		 * Wraps a Reactor.react invocation in a console.group
		*/
		exports.dispatchStart = function(type, payload) {
		  if (console.group) {
		    console.groupCollapsed('Dispatch: %s', type)
		    console.group('payload')
		    console.debug(payload)
		    console.groupEnd()
		  }
		}

		exports.dispatchError = function(error) {
		  if (console.group) {
		    console.debug('Dispatch error: ' + error)
		    console.groupEnd()
		  }
		}

		exports.storeHandled = function(id, before, after) {
		  if (console.group) {
		    if (before !== after) {
		      console.debug('Core changed: ' + id)
		    }
		  }
		}

		exports.dispatchEnd = function(state) {
		  if (console.group) {
		    console.debug('Dispatch done, new state: ', state.toJS())
		    console.groupEnd()
		  }
		}


	/***/ },
	/* 10 */
	/***/ function(module, exports, __webpack_require__) {

		var Immutable = __webpack_require__(7)
		var hashCode = __webpack_require__(12)
		var isEqual = __webpack_require__(13)

		/**
		 * ChangeObserver is an object that contains a set of subscriptions
		 * to changes for keyPaths on a reactor
		 *
		 * Packaging the handlers together allows for easier cleanup
		 */

		  /**
		   * @param {Immutable.Map} initialState
		   * @param {Evaluator} evaluator
		   */
		  function ChangeObserver(initialState, evaluator) {"use strict";
		    this.__prevState = initialState
		    this.__evaluator = evaluator
		    this.__prevValues = Immutable.Map()
		    this.__observers = []
		  }

		  /**
		   * @param {Immutable.Map} newState
		   */
		  ChangeObserver.prototype.notifyObservers=function(newState) {"use strict";
		    if (this.__observers.length > 0) {
		      var currentValues = Immutable.Map()

		      this.__observers.forEach(function(entry)  {
		        var getter = entry.getter
		        var code = hashCode(getter)
		        var prevState = this.__prevState
		        var prevValue

		        if (this.__prevValues.has(code)) {
		          prevValue = this.__prevValues.get(code)
		        } else {
		          prevValue = this.__evaluator.evaluate(prevState, getter)
		          this.__prevValues = this.__prevValues.set(code, prevValue)
		        }

		        var currValue = this.__evaluator.evaluate(newState, getter)

		        if (!isEqual(prevValue, currValue)) {
		          entry.handler.call(null, currValue)
		          currentValues = currentValues.set(code, currValue)
		        }
		      }.bind(this))

		      this.__prevValues = currentValues
		    }
		    this.__prevState = newState
		  };

		  /**
		   * Specify an getter and a change handler fn
		   * Handler function is called whenever the value of the getter changes
		   * @param {Getter} getter
		   * @param {function} handler
		   * @return {function} unwatch function
		   */
		  ChangeObserver.prototype.onChange=function(getter, handler) {"use strict";
		    // TODO make observers a map of <Getter> => { handlers }
		    var entry = {
		      getter: getter,
		      handler: handler,
		    }
		    this.__observers.push(entry)
		    // return unwatch function
		    return function()  {
		      // TODO untrack from change emitter
		      var ind  = this.__observers.indexOf(entry)
		      if (ind > -1) {
		        this.__observers.splice(ind, 1)
		      }
		    }.bind(this)
		  };

		  /**
		   * Resets and clears all observers and reinitializes back to the supplied
		   * previous state
		   * @param {Immutable.Map} prevState
		   *
		   */
		  ChangeObserver.prototype.reset=function(prevState) {"use strict";
		    this.__prevState = prevState
		    this.__prevValues = Immutable.Map()
		    this.__observers = []
		  };


		module.exports = ChangeObserver


	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {

		var Immutable = __webpack_require__(7)
		var toImmutable = __webpack_require__(1).toImmutable
		var hashCode = __webpack_require__(12)
		var isEqual = __webpack_require__(13)
		var getComputeFn = __webpack_require__(5).getComputeFn
		var getDeps = __webpack_require__(5).getDeps
		var isKeyPath = __webpack_require__(4).isKeyPath
		var isGetter = __webpack_require__(5).isGetter

		// Keep track of whether we are currently executing a Getter's computeFn
		var __applyingComputeFn = false;


		  function Evaluator() {"use strict";
		    /**
		     * {
		     *   <hashCode>: {
		     *     stateHashCode: number,
		     *     args: Immutable.List,
		     *     value: any,
		     *   }
		     * }
		     */
		    this.__cachedGetters = Immutable.Map({})
		  }

		  /**
		   * Takes either a KeyPath or Getter and evaluates
		   *
		   * KeyPath form:
		   * ['foo', 'bar'] => state.getIn(['foo', 'bar'])
		   *
		   * Getter form:
		   * [<KeyPath>, <KeyPath>, ..., <function>]
		   *
		   * @param {Immutable.Map} state
		   * @param {string|array} getter
		   * @return {any}
		   */
		  Evaluator.prototype.evaluate=function(state, keyPathOrGetter) {"use strict";
		    if (isKeyPath(keyPathOrGetter)) {
		      // if its a keyPath simply return
		      return state.getIn(keyPathOrGetter)
		    } else if (!isGetter(keyPathOrGetter)) {
		      throw new Error("evaluate must be passed a keyPath or Getter")
		    }

		    // Must be a Getter
		    var code = hashCode(keyPathOrGetter)

		    // if the value is cached for this dispatch cycle, return the cached value
		    if (this.__isCached(state, keyPathOrGetter)) {
		      // Cache hit
		      return this.__cachedGetters.getIn([code, 'value'])

		    }

		    // evaluate dependencies
		    var args = getDeps(keyPathOrGetter).map(function(dep)  {return this.evaluate(state, dep);}.bind(this))

		    if (this.__hasStaleValue(state, keyPathOrGetter)) {
		      // getter deps could still be unchanged since we only looked at the unwrapped (keypath, bottom level) deps
		      var prevArgs = this.__cachedGetters.getIn([code, 'args'])

		      // since Getter is a pure functions if the args are the same its a cache hit
		      if (isEqual(prevArgs, toImmutable(args))) {
		        var prevValue = this.__cachedGetters.getIn([code, 'value'])
		        this.__cacheValue(state, keyPathOrGetter, prevArgs, prevValue)
		        return prevValue
		      }
		    }

		    // This indicates that we have called evaluate within the body of a computeFn.
		    // Throw an error as this will lead to inconsistent caching
		    if (__applyingComputeFn === true) {
		      __applyingComputeFn = false
		      throw new Error("Evaluate may not be called within a Getters computeFn")
		    }

		    __applyingComputeFn = true
		    var evaluatedValue = getComputeFn(keyPathOrGetter).apply(null, args)
		    __applyingComputeFn = false

		    this.__cacheValue(state, keyPathOrGetter, args, evaluatedValue)

		    return evaluatedValue
		  };

		  /**
		   * @param {Immutable.Map} state
		   * @param {Getter} getter
		   */
		  Evaluator.prototype.__hasStaleValue=function(state, getter) {"use strict";
		    var code = hashCode(getter)
		    var cache = this.__cachedGetters
		    return (
		      cache.has(code) &&
		      cache.getIn([code, 'stateHashCode']) !== state.hashCode()
		    )
		  };

		  /**
		   * Caches the value of a getter given state, getter, args, value
		   * @param {Immutable.Map} state
		   * @param {Getter} getter
		   * @param {Array} args
		   * @param {any} value
		   */
		  Evaluator.prototype.__cacheValue=function(state, getter, args, value) {"use strict";
		    var code = hashCode(getter)
		    this.__cachedGetters = this.__cachedGetters.set(code, Immutable.Map({
		      value: value,
		      args: toImmutable(args),
		      stateHashCode: state.hashCode(),
		    }))
		  };

		  /**
		   * Returns boolean whether the supplied getter is cached for a given state
		   * @param {Immutable.Map} state
		   * @param {Getter} getter
		   * @return {boolean}
		   */
		  Evaluator.prototype.__isCached=function(state, getter) {"use strict";
		    var code = hashCode(getter)
		    return (
		      this.__cachedGetters.hasIn([code, 'value']) &&
		      this.__cachedGetters.getIn([code, 'stateHashCode']) === state.hashCode()
		    )
		  };

		  /**
		   * Removes all caching about a getter
		   * @param {Getter}
		   */
		  Evaluator.prototype.untrack=function(getter) {"use strict";
		    // TODO untrack all depedencies
		  };

		  Evaluator.prototype.reset=function() {"use strict";
		    this.__cachedGetters = Immutable.Map({})
		  };


		module.exports = Evaluator


	/***/ },
	/* 12 */
	/***/ function(module, exports, __webpack_require__) {

		var Immutable = __webpack_require__(7)

		/**
		 * Takes a getter and returns the hash code value
		 *
		 * If cache argument is true it will freeze the getter
		 * and cache the hashed value
		 *
		 * @param {Getter} getter
		 * @param {boolean} dontCache
		 * @return {number}
		 */
		module.exports = function(getter, dontCache) {
		  if (getter.hasOwnProperty('__hashCode')) {
		    return getter.__hashCode
		  }

		  var hashCode = Immutable.fromJS(getter).hashCode()

		  if (!dontCache) {
		    Object.defineProperty(getter, '__hashCode', {
		      enumerable: false,
		      configurable: false,
		      writable: false,
		      value: hashCode,
		    })

		    Object.freeze(getter)
		  }

		  return hashCode
		}


	/***/ },
	/* 13 */
	/***/ function(module, exports, __webpack_require__) {

		var Immutable = __webpack_require__(7)
		/**
		 * Is equal by value check
		 */
		module.exports = function(a, b) {
		  return Immutable.is(a, b)
		}


	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var Nuclear = __webpack_require__(64)
	var toImmutable = Nuclear.toImmutable

	var id = 1;

	var items = Nuclear.Store({
	  getInitialState: function() {
	    return toImmutable([])
	  },

	  initialize: function() {
	    this.on('addItem', function(state, item) {
	      return state.withMutations(function(items){
	        var immutableItem = toImmutable(item);
	        return items.push(immutableItem);
	      })
	    })
	  }
	})

	var Reactor = new Nuclear.Reactor({
	  debug: true
	})

	Reactor.registerStores({
	  items: items
	})

	module.exports = Reactor;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var Nuclear = __webpack_require__(64)
	var toImmutable = Nuclear.toImmutable;

	/**
	 * Binds to an existing reactor and adds undo/redo based
	 * on the history of the reactor.state
	 */
	module.exports = function createHistoryReactor(reactor) {
	  var timeMachine = Nuclear.Reactor({
	    debug: true
	  });
	  timeMachine.registerStores({
	    history: Nuclear.Store({
	      getInitialState: function() {
	        return toImmutable([])
	      },

	      initialize: function() {
	        this.on('change', function(state, payload) {
	          return state.withMutations(function(history){
	            return history.push(payload.state);
	          })
	        })
	      }
	    })
	  })

	  reactor.observe(function(state) {
	    timeMachine.dispatch('change', {
	      state: state
	    })
	  })

	  timeMachine.go = function(ind) {
	    
	    var size = this.evaluate(['history']).size
	    var newTime = ind
	    if (ind > size - 1) {
	      newTime = size - 1
	    } else if (newTime < 0) {
	      newTime = 0
	    }
	    var newState = this.evaluate(['history', newTime])
	  }

	  return timeMachine
	}


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	exports.items = ['items'];

	exports.itemTotal = [exports.items, function(items){
	    return items && items.size || 0
	}]


/***/ }
/******/ ])
});
;