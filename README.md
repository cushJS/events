# @cush/events v0.0.1

Tiny event emitter

Supports non-invasive subclassing. The listener cache is non-enumerable and assigned via an internal `Symbol` value.

```js
const Emitter = require('@cush/events');

// An initial set of listeners can be passed.
const ee = new Emitter({
  foo: () => {},  // values can be functions
  bar: [],        // or arrays of functions
});

// Add a listener and return it.
const foo = ee.on('foo', () => {});

// Remove a listener.
ee.off('foo', foo);

// Emit as many arguments as you like.
ee.emit('foo', 1, 2);

// Remove all listeners for an event.
ee.clear('foo');

// Remove all listeners for all events.
ee.clear();

// Count the number of listeners for an event.
ee.listenerCount('foo'); // => 0

// Wildcard events
ee.on(() => {});   /* same as */  ee.on('*', () => {});
ee.off(() => {});  /* same as */  ee.off('*', () => {});

ee.wildEmit('foo', 1, 2);
/* same as */
ee.emit('foo', 1, 2);
ee.emit('*', 'foo', 1, 2);

// Wildcard by default
ee.emit = ee.wildEmit;
```
