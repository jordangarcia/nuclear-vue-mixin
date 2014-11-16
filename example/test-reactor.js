var Nuclear = require('nuclear-js')
var Immutable = Nuclear.Immutable
var itemTotal = require('./item-total')

var id = 1;

var items = Nuclear.ReactiveState({
  getInitialState: function() {
    return []
  },

  initialize: function() {
    this.on('addItem', function(list, item) {
      var item = Immutable.Map(item).set('id', id++)
      return list.push(Immutable.Map(item))
    })
  }
})

module.exports = Nuclear.Reactor({
  state: {
    items: items,

    counts: {
      itemCount: itemTotal
    }
  }
})
