
type EventName = string | symbol;

interface Listeners {
  // TODO: Change to `event: EventName` when Typescript allows it
  [event: string]: Function | Function[];
}

declare class EventEmitter {

  /** Create an EventEmitter with optionally pre-defined listeners. */
  constructor(events?: Listeners);

  /** Count the listeners of an event. */
  listenerCount(name: EventName): number;

  /** Attach a listener to an event. */
  on<T extends Function>(name: EventName, fn: T): T;

  /** Detach a listener from an event. */
  off(name: EventName, fn: Function): void;

  /**
   * Detach all listeners from the given event,
   * or all events if no event is given.
   */
  clear(name?: string): void;

  /**
   * Emit an event asynchronously.
   * Resolves to true if listeners existed.
   *
   * @alias emitAsync
   */
  emit(name: string, ...args: any[]): Promise<boolean>;

  /**
   * Emit an event asynchronously.
   * Resolves to true if listeners existed.
   *
   * @alias emit
   */
  emitAsync(name: string, ...args: any[]): Promise<boolean>;

  /**
   * Emit an event synchronously.
   * Returns true if listeners existed.
   */
  emitSync(name: string, ...args: any[]): boolean;

  /**
   * Enable the "emit" event for debugging purposes.
   * Pass nothing to enable debugging for all emitters.
   */
  static debug<T extends Object>(emitter?: T): T;

  /**
   * Use this symbol to access internal listener storage.
   */
  static ev: symbol;
}

export = EventEmitter;
