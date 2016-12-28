var assert = require('assert')
var Aggregate = require('./')
var noop = function () {}

//
// Test simple event
//
var a = {}
var evt = {foo: 'bar'}
Aggregate.setup(a, noop)
assert.equal(Aggregate.drain(a).length, 0)
Aggregate.event(a, noop, evt)
var evts = Aggregate.drain(a)
assert.equal(evts.length, 1)
assert.equal(evts[0], evt)

//
// Test reducer, this binding
//
var reducer = function (s, evt) { s.calls += 1 }
var obj = {calls: 0, args: []}
Aggregate.setup(obj, reducer)
assert.equal(Object.keys(obj).length, 2)
assert.equal(obj.calls, 0)

var first = {foo: 'bar'}
// queues objects
Aggregate.event(obj, reducer, first)
assert.equal(obj.calls, 1)

// queues strings
Aggregate.event(obj, reducer, 'second')
assert.equal(obj.calls, 2)

// queues undefined
Aggregate.event(obj, reducer)
assert.equal(obj.calls, 3)

// .drain returns all queued events
var events2 = Aggregate.drain(obj)
assert.equal(Array.isArray(events2), true)
assert.equal(events2[0], first)
assert.equal(events2[1], 'second')
assert.equal(events2[2], undefined)

// reducer arguments
var foo = {}
var event = {foo: 'bar'}
var called = 0
function reducer2 (s, evt) {
  called += 1
  assert.equal(arguments.length, 2)
  assert.equal(evt, event)
  assert.equal(s, foo)
}
Aggregate.setup(foo)
Aggregate.event(foo, reducer2, event)
assert.equal(called, 1)
