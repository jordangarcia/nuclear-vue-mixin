var Nuclear = require('nuclear-js')
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
