const ev = Symbol('EventEmitter.events');
const def = Object.defineProperty;
const resolved = Promise.resolve();
const emptyArray = [];

class EventEmitter {
  constructor(events) {
    def(this, ev, {
      value: Object.create(null),
      writable: true,
    });

    if (events) {
      for (let event in events) {
        let list = events[event];
        this[ev][event] =
          typeof list == 'function' ? [list] : list;
      }
    }
  }
  listenerCount(name) {
    let list = this[ev][name];
    return list ? list.length : 0;
  }
  on(name, fn) {
    let list = this[ev][name];
    if (list) list.push(fn);
    else this[ev][name] = [fn];
    return fn;
  }
  off(name, fn) {
    let list = this[ev][name];
    if (!list) return;
    if (list.length !== 1) {
      let i = list.indexOf(fn);
      if (i !== -1) list.splice(i, 1);
    } else if (list[0] == fn) {
      delete this[ev][name];
    }
  }
  clear(name) {
    if (arguments.length == 0) {
      this[ev] = Object.create(null);
    } else {
      delete this[ev][name];
    }
  }
}

function emit(list, args) {
  if (list) {
    let i = 0, len = list.length;
    switch (args.length) {
      case 0:
        for (; i < len; i++) list[i]();
        break;
      case 1:
        for (; i < len; i++) list[i](args[0]);
        break;
      case 2:
        for (; i < len; i++) list[i](args[0], args[1]);
        break;
      default:
        for (; i < len; i++) list[i](...args);
    }
    return true;
  }
  return false;
}

function emitSync(name, ...args) {
  if (typeof name !== 'string' || name === '') {
    throw Error('Invalid event name: ' + (JSON.stringify(name) || String(name)));
  }
  return emit(this[ev][name], args);
}

function emitAsync(name, ...args) {
  if (typeof name !== 'string' || name === '') {
    throw Error('Invalid event name: ' + (JSON.stringify(name) || String(name)));
  }
  return resolved.then(() => {
    try {
      return emit(this[ev][name], args);
    } catch(error) {
      this.emitSync('error', error) ||
        setTimeout(function() {
          throw error;
        });
    }
  });
}

EventEmitter.debug = function(emitter) {
  if (emitter == null) emitter = EventEmitter.prototype;
  [emitSync, emitAsync].forEach(emit => {
    emitter[emit.name] = function(...args) {
      emitSync.call(this, 'emit', args);
      return emit.apply(this, args);
    };
  });
  emitter.emit = emitter[emitter.emit.name];
  return emitter;
};

const emitMethods = {
  emit: emitAsync, // async by default
  emitSync,
  emitAsync,
};

if (typeof process !== 'undefined' && /\bevents\b/.test(process.env.DEBUG)) {
  Emitter.debug(emitMethods);
}

Object.assign(EventEmitter.prototype, emitMethods);

def(EventEmitter, 'ev', {
  value: ev
});

module.exports = EventEmitter;
