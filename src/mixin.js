var Nuclear = require('nuclear-js')
var Computed = require('nuclear-js').Computed

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
    created: function() {
      if (!this.$options.getDataBindings) {
        return
      }

      var vm = this
      var dataBindings = this.$options.getDataBindings()
      var changeObserver = reactor.createChangeObserver()

      each(dataBindings, function(reactorKeyPath, vmProp) {
        if (Computed.isComputed(reactorKeyPath)) {
          // TODO refactor to Reactor.get(computed)
          var val = Nuclear.toJS(Computed.evaluate(reactor.state, reactorKeyPath))
          vm.$set(vmProp, val)

          changeObserver.onChange(reactorKeyPath.flatDeps, function() {
            var val = Nuclear.toJS(Computed.evaluate(reactor.state, reactorKeyPath))
            vm.$set(vmProp, val)
          })
        } else {
          vm.$set(vmProp, reactor.getJS(reactorKeyPath))

          changeObserver.onChange(reactorKeyPath, function(val) {
            vm.$set(vmProp, reactor.getJS(reactorKeyPath))
          })
        }
      })

      this.$on('destroyed', function() {
        changeObserver.destroy()
      })
    }
  }
}

function each(arr, fn) {
  for (var key in arr) {
    fn(arr[key], key)
  }
}
