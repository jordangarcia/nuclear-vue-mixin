var Vue = require('vue')
var Mixin = require('../src/mixin')
var reactor = require('./test-reactor')
var timeMachine = require('./time-machine')
var itemActions = require('./item-actions')

document.addEventListener("DOMContentLoaded", function() {
  var reactorTimeMachine = timeMachine(reactor)

  var List = Vue.extend({
    mixins: [Mixin(reactor)],

    getDataBindings: function() {
      return {
        items: itemActions.items,

        count: itemActions.itemTotal,

        isTooHigh: [itemActions.itemTotal, (itemTotal) => {
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
