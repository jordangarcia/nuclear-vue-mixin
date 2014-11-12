var Vue = require('vue')
var Mixin = require('./src/mixin')
var reactor = require('./test-reactor')

reactor.initialize()

document.addEventListener("DOMContentLoaded", function() {
  var list1 = new Vue({
    mixins: [Mixin(reactor)],

    getDataBindings: function() {
      return {
        items: 'items',
        count: 'counts.itemCount'
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
  }).$mount('#list1')

  var list2 = new Vue({
    mixins: [Mixin(reactor)],

    getDataBindings: function() {
      return {
        items: 'items',
        count: 'counts.itemCount'
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
  }).$mount('#list2')

  reactor.dispatch('addItem', { name: 'item 1' })
})
