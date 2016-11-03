var queued = Symbol('queued')

module.exports = {
  setup: setup,
  drain: drain,
  event: event,
  isDirty: isDirty
}

function setup (obj, reducer, events) {
  obj[queued] = []
  if (events) for (var i = 0; i < events.length; i++) reducer.call(obj, events[i])
  return obj
}

function event (obj, reducer, event) {
  obj[queued][obj[queued].length] = event
  reducer.call(obj, event)
  return obj
}

function drain (obj) {
  var arr = obj[queued]
  obj[queued] = []
  return arr
}

function isDirty (obj) {
  return !!obj[queued].length
}
