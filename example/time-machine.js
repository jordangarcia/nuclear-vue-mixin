var Nuclear = require('nuclear-js')
var toImmutable = Nuclear.toImmutable;

/**
 * Binds to an existing reactor and adds undo/redo based
 * on the history of the reactor.state
 */
module.exports = function createHistoryReactor(reactor) {
  var timeMachine = Nuclear.Reactor({
    debug: true
  });
  timeMachine.registerStores({
    history: Nuclear.Store({
      getInitialState: function() {
        return toImmutable([])
      },

      initialize: function() {
        this.on('change', function(state, payload) {
          return state.withMutations(function(history){
            return history.push(payload.state);
          })
        })
      }
    })
  })

  reactor.observe(function(state) {
    timeMachine.dispatch('change', {
      state: state
    })
  })

  timeMachine.go = function(ind) {
    
    var size = this.evaluate(['history']).size
    var newTime = ind
    if (ind > size - 1) {
      newTime = size - 1
    } else if (newTime < 0) {
      newTime = 0
    }
    var newState = this.evaluate(['history', newTime])
  }

  return timeMachine
}
