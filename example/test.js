var Vue = require('vue')
var Mixin = require('../src/mixin')
var reactor = require('./test-reactor')
var timeMachine = require('./time-machine')
var itemTotal = require('./item-total')
var Getter = require('nuclear-js').Getter

document.addEventListener("DOMContentLoaded", function() {
  var reactorTimeMachine = timeMachine(reactor)

  var List = Vue.extend({
    mixins: [Mixin(reactor)],

    getDataBindings: function() {
      return {
        items: 'items',

        count: itemTotal,

        isTooHigh: Getter(itemTotal, (itemTotal) => {
          return itemTotal > 5
        })
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
        readableHistory: Getter(['history'], function(states) {
          return states.map(function(state) {
            return state.toString()
          })
        }),
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
