# NuclearJS Vue Mixin

VueJS mixin to provide effortless syncing of ViewModel data
with a Nuclear Reactor

## Usage

```js
var Getter = require('./nuclear-js').Getter
var ReactorMixin = require('nuclear-vue-mixin')
var reactor = require('./reactor')

var vm = new Vue({
  mixins: [ReactorMixin(reactor)],

  getDataBindings: function() {
    // vm.user always stays in sync with reactor.get('user')
    user: 'User',

    // reactor.get(['projects', 123])
    project: ['projects', 123],

    // can pass a Getter to transform a value
    currentPage: Getter('pages', 'currentPageId', function(pages, id) {
      return pages.get(id)
    }),
  },

  ready: function() {
    // also provides a $sync(vmProp, getter) method for post created bindings
    this.$sync('project', ['projects', this.$el.id])
  }
})
```
