var Nuclear = require('nuclear-js')

/**
 * Binds to an existing reactor and adds undo/redo based
 * on the history of the reactor.state
 */
module.exports = function createHistoryReactor(reactor) {
  var timeMachine = Nuclear.Reactor({
    state: {
      history: Nuclear.ReactiveState({
        getInitialState: function() {
          return []
        },

        initialize: function() {
          this.on('change', function(state, payload) {
            return state.push(payload.state)
          })
        }
      }),

      historyStrings: Nuclear.Computed(
        ['history'],
        function(states) {
          return states.map(function(state) {
            return state.toString()
          })
        }
      ),
    }
  })

  reactor.changeEmitter.addChangeListener(function(state) {
    timeMachine.dispatch('change', {
      state: state
    })
  })

  timeMachine.go = function(ind) {
    var size = this.get('history').size
    var newTime = ind
    if (ind > size - 1) {
      newTime = size - 1
    } else if (newTime < 0) {
      newTime = 0
    }
    var newState = this.get(['history', newTime])

    reactor.initialize(newState)
  }

  timeMachine.initialize()

  return timeMachine
}
