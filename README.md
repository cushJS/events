# @cush/events v1.0.1

Tiny event emitter

Supports non-invasive subclassing. The listener cache is non-enumerable and assigned via an internal `Symbol` value.

Events are emitted asynchronously by default. Under the hood, a promise is used to queue a microtask.

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

// Emit synchronously.
ee.emitSync('foo');

// Emit synchronously by default.
ee.emit = ee.emitSync;

// Emit asynchronously (the default behavior).
ee.emitAsync('foo');

// Remove all listeners for an event.
ee.clear('foo');

// Remove all listeners for all events.
ee.clear();

// Count the number of listeners for an event.
ee.listenerCount('foo'); // => 0

// Access the listener cache. (useful for subclassing)
ee[Emitter.ev];
```

### Debugging

Run `export DEBUG="events"` in your terminal (or call `Emitter.debug`) to make every instance emit an `emit` event whenever `emitSync` or `emitAsync` is called. The `Arguments` object is passed, which you can alter to change the event being debugged.

Pass nothing to `Emitter.debug` to enable debugging for all emitters. If you pass an emitter, debugging will be enabled only for it.
