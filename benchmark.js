var bench = require('nanobench')
var Aggregate = require('./')
var noop = function () {}

bench('raw object creation (for comparison)', function (b) {
  b.start()

  for (var i = 0; i < 10e6; i++) {
    noop({})
  }

  b.end()
})

bench('.setup(obj)', function (b) {
  b.start()

  for (var i = 0; i < 10e6; i++) {
    Aggregate.setup({})
  }

  b.end()
})

bench('.event(obj, reducer, event)', function (b) {
  var obj = Aggregate.setup({})
  var event = {name: 'SomeEvent', time: Date.now(), data: {foo: 'bar'}}
  b.start()

  for (var i = 0; i < 10e6; i++) {
    Aggregate.event(obj, noop, event)
  }

  b.end()
})

bench('.isDirty(obj)', function (b) {
  var obj = Aggregate.setup({})
  Aggregate.event(obj, noop, {foo: 'bar'})
  b.start()

  for (var i = 0; i < 10e6; i++) {
    Aggregate.isDirty(obj)
  }

  b.end()
})
