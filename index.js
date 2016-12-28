var queued = Symbol('queued')

module.exports = {
  setup: setup,
  drain: drain,
  event: event,
  isDirty: isDirty
}

function setup (obj, reducer, events) {
  drain(obj)
  if (!reducer || !events || !events.length) return obj
  var r
  var i = 0
  var state = obj
  while (events[i]) {
    r = reducer(state, events[i++])
    state = r === undefined ? state : r
  }
  return state
}

function event (obj, reducer, event) {
  obj[queued][obj[queued].length] = event
  var r = reducer(obj, event)
  return r === undefined ? obj : r
}

function drain (obj) {
  var arr = obj[queued]
  obj[queued] = []
  return arr
}

function isDirty (obj) {
  return !!obj[queued].length
}
