var Nuclear = require('nuclear-js');

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
 *       'user': ['currentUser'],
 *
 *       // can reference deep paths in App State Map
 *       'filters': ['ui', 'filters']
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
       * Bind all data returned by getDataBindings option
       */
      $bind: function(){
        var $options = this.$options || {};
        if ($options.getDataBindings && typeof $options.getDataBindings === 'function') {
          each($options.getDataBindings(), (reactorKeyPath, vmProp) => {
            this.$sync(vmProp, reactorKeyPath);
          });
          this.__dataBinded = true;
        }
      },

      /**
       * Unbind all data, if needed
       */
      $unbind: function(){
        if (this.__reactorUnwatchFns) {
          each(this.__reactorUnwatchFns, (fn) => fn());
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
