# eventsourced-object

A minimal eventsourcing helper for objects and classes.  
In case you don't know eventsourcing, [here's some reading material](#event-sourcing)


```js
var Aggregate = require('eventsourced-object')
```

## Api

### Aggregate.setup(obj, reducer, events)

```js
var user = {version: 0}
var initialEvents = [{name: 'CreateUser', fullName: 'Marc Bachmann'}]
Aggregate.setup(user, reducer, initialEvents)

function reducer (state, evt) {
    state.version += 1
    if (evt.name == 'CreateUser') state.name = evt.fullName
}
```

### Aggregate.event(obj, reducer, event)

```js
var user = Aggregate.setup({version: 0})
var event = {name: 'CreateUser', fullName: 'Marc Bachmann'}
Aggregate.event(user, reducer, event)
// executes the reducer with the event and queues the event so you can save it
function reducer (state, evt) {
    state.version += 1
    if (evt.name == 'CreateUser') state.name = evt.fullName
}
```

### Aggregate.drain(obj)

```js
var obj = {}
Aggregate.setup(obj)
Aggregate.event(obj, reducer, {foo: 'bar'})
Aggregate.event(obj, reducer, {foo: 'test'})
Aggregate.drain(obj) // returns [{foo: 'bar'}, {foo: 'test'}]
```

### Aggregate.isDirty(obj)

```js
var obj = {}
Aggregate.setup(obj)
Aggregate.event(obj, reducer, {foo: 'bar'})
Aggregate.isDirty(obj) // returns true
```

## Example using a class
```js
var user = User.create({email: 'foo@example.com', fullName: 'Foo Example'})
user.rename('Example')
// user == {
//    id: 'iuxswpqw',
//    email: 'foo@example.com',
//    fullName: 'Example',
//    createdAt: Mon Oct 31 2016 09:26:02 GMT+0100 (CET),
//    updatedAt: Mon Oct 31 2016 09:26:03 GMT+0100 (CET)
//}


function User (events) {
  this.version = 0
  Aggregate.setup(this, reducer, events)
}

User.create = function (params) {
  var user = new User()
  return Aggregate.event(user, reducer, {
    aggregateId: params.id || Date.now().toString(36),
    name: 'UserCreated',
    time: new Date(),
    data: {
      email: params.email,
      fullName: params.fullName
    }
  })
}

User.prototype.rename = function (fullName) {
  return Aggregate.event(this, reducer, {
    aggregateId: this.id,
    name: 'UserRenamed',
    time: new Date(),
    data: {
      fullName: fullName
    }
  })
}

User.prototype.save = function () {
  var events = Aggregate.drain(this)
  console.log(events) // Save events to some storage/repository
}

User.prototype.isDirty = function () {
  return Aggregate.isDirty(this)
}

function reducer (state, evt) {
  state.version += 1
  state.updatedAt = evt.time
  if (evt.name === 'UserCreated') {
    state.id = evt.aggregateId
    state.createdAt = evt.time
    state.fullName = evt.data.fullName
    state.email = evt.data.email
  } else if (evt.name === 'UserRenamed') {
    state.fullName = evt.data.fullName
  }
}
```

# Benchmarks

Here are some benchmarks with 10'000'000 iterations per function
```
NANOBENCH version 1

# raw object creation (for comparison)
  end ~97 ms (0 s + 97465524 ns)
# .setup(obj)
  end ~228 ms (0 s + 227954858 ns)
# .event(obj, reducer, event)
  end ~473 ms (0 s + 473181583 ns)
# .isDirty(obj)
  end ~86 ms (0 s + 86072337 ns)

# total ~885 ms (0 s + 884674302 ns)

# ok

[Finished in 1.0s]
```

# Event Sourcing

## Videos
- https://www.youtube.com/watch?v=JHGkaShoyNs
- http://www.infoq.com/presentations/greg-young-unshackle-qcon08
- https://www.youtube.com/watch?v=whCk1Q87_ZI
- https://www.youtube.com/watch?v=I4A5ntHeoxU

## Reading material
- http://cqrs.nu/
- https://ookami86.github.io/event-sourcing-in-practice/
- https://nicolaswidart.com/blog/get-up-and-running-with-event-sourcing
- http://danielwhittaker.me/2014/11/15/aggregate-root-cqrs-event-sourcing/
- http://docs.geteventstore.com/introduction/event-sourcing-basics/
- https://abdullin.com/tags/cqrs/
- https://abdullin.com/post/event-sourcing-projections/
- http://slides.com/stefankutko/nodejs-microservices-event-sourcing-cqrs
- http://blog.zilverline.com/2012/07/04/simple-event-sourcing-introduction-part-1/
- http://blog.jonathanoliver.com/cqrs-sagas-with-event-sourcing-part-i-of-ii/
- http://www.rgoarchitects.com/Files/SOAPatterns/Saga.pdf
- https://groups.google.com/forum/#!forum/dddcqrs


