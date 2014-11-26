var Nuclear = require('nuclear-js')

module.exports = Nuclear.Getter(
  ['items'],
  function(items) {
    return items.size
  }
)

