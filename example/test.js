var Vue = require('vue')
var Mixin = require('../src/mixin')
var reactor = require('./test-reactor')
var timeMachine = require('./time-machine')
var itemTotal = require('./item-total')
var Computed = require('nuclear-js').Computed

document.addEventListener("DOMContentLoaded", function() {
  var reactorTimeMachine = timeMachine(reactor)
  reactor.initialize()

  var List = Vue.extend({
    mixins: [Mixin(reactor)],

    getDataBindings: function() {
      return {
        items: 'items',

        count: 'counts.itemCount',
        isTooHigh: Computed(
          [itemTotal],
          function(itemTotal) {
            debugger;
            return itemTotal > 5
          }
        )
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
        history: 'history.states',
        readableHistory: 'historyStrings',
        current: 'history.currentTime'
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
