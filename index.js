const ev = Symbol('EventEmitter.events');
const def = Object.defineProperty;
const slice = [].slice;

class EventEmitter {
  constructor(events) {
    def(this, ev, {
      value: Object.create(null),
      writable: true,
    });

    if (events) {
      for (const event in events) {
        const list = events[event];
        this[ev][event] =
          typeof list == 'function' ? [list] : list;
      }
    }
  }
  listenerCount(name) {
    const list = this[ev][name];
    return list ? list.length : 0;
  }
  on(name, fn) {
    const list = this[ev][name];
    if (list) list.push(fn);
    else this[ev][name] = [fn];
    return fn;
  }
  off(name, fn) {
    const list = this[ev][name];
    if (!list) return;
    if (list.length !== 1) {
      const i = list.indexOf(fn);
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

function emit(name, $1, $2, $3) {
  if (typeof name !== 'string' || name === '') {
    throw Error('Invalid event name: ' + (JSON.stringify(name) || String(name)));
  }
  const list = this[ev][name];
  if (list) {
    let i = 0, len = list.length;
    switch (arguments.length) {
      case 1:
        for (; i < len; i++) list[i]();
        break;
      case 2:
        for (; i < len; i++) list[i]($1);
        break;
      case 3:
        for (; i < len; i++) list[i]($1, $2);
        break;
      case 4:
        for (; i < len; i++) list[i]($1, $2, $3);
        break;
      default:
        const args = slice.call(arguments, 1);
        for (; i < len; i++) list[i](...args);
    }
    return true;
  }
  return false;
}

Object.assign(EventEmitter.prototype, {
  emit,
});

module.exports = EventEmitter;
