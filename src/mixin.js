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

      var dataBindings = this.$options.getDataBindings()
      var syncData = setViewModelData.bind(this, reactor, dataBindings)
      var deps = objectValues(dataBindings)

      var changeObserver = reactor.createChangeObserver()
      changeObserver.onChange(deps, syncData)

      this.$on('destroyed', function() {
        changeObserver.destroy()
      })

      // initial sync
      syncData()
    }
  }
}

/**
 * Syncs a mapping of data bindidngs between a vm and reactor
 * @param {Nuclear.Reactor} reactor
 * @param {object} dataBindings
 */
function setViewModelData(reactor, dataBindings) {
  for (var vmProp in dataBindings) {
    var reactorKeyPath = dataBindings[vmProp]
    this.$set(vmProp, reactor.getJS(reactorKeyPath))
  }
}


function each(arr, fn) {
  for (var key in arr) {
    fn(arr[key], key)
  }
}

/**
 * Gets the values for an object
 */
function objectValues(obj) {
  var values = []
  for (var prop in obj) {
    values.push(obj[prop])
  }
  return values
}
