var Nuclear = require('nuclear-js')

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
module.exports = function(reactor) {
  return {
    methods: {
      /**
       * Syncs a reactor.get(getter) value with a vm data property
       * @param {string} vmProp
       * @param {Getter|KeyPath} getter
       */
      $sync(vmProp, getter) {
        if (!Nuclear.Getter.isGetter(getter) &&
            !Nuclear.KeyPath.isKeyPath(getter)) {

          console.warn('Must supply a KeyPath or Getter to getDataBindings()')
          return
        }

        this.$set(vmProp, reactor.getJS(getter))
        // setup the data observation
        var unwatchFn = reactor.observe(getter, val => {
          this.$set(vmProp, Nuclear.toJS(val))
        })
        this.__reactorUnwatchFns.push(unwatchFn)
      }
    },

    created: function() {
      if (!reactor) {
        throw new Error("Must supply reactor to ViewModel")
      }

      this.__reactorUnwatchFns = []

      if (!this.$options.getDataBindings) {
        return
      }

      var dataBindings = this.$options.getDataBindings()

      _.each(dataBindings, (reactorKeyPath, vmProp) => {
        this.$sync(vmProp, reactorKeyPath)
      })

      this.$on('destroyed', () => {
        while (this.__reactorUnwatchFns.length) {
          this.__reactorUnwatchFns.shift()()
        }
      })
    }
  }
}
