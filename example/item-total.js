var Nuclear = require('nuclear-js')

module.exports = Nuclear.Computed(
  ['items'],
  function(items) {
    return items.size
  }
)

