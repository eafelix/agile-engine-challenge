/**
 * @module helpers/Lock
 */
const { EventEmitter } = require("events");

/**
 * Lock instance to lock operations between calls using EventEmiter to notify when is free to use
 * @class
 * @namespace Lock
 */
class Lock {
  constructor() {
    /**
     * Flag to define when it is blocked
     * @type {boolean}
     */
    this._locked = false;
    /**
     * EvenEmitter instance to notify when the lock it is open to the subscribers
     * @type {EventEmitter}
     */
    this._ee = new EventEmitter();
  }

  /**
   * Tries to get permission to operate, executes when the lock is free
   */
  acquire() {
    return new Promise(resolve => {
      // If nobody has the lock, take it and resolve immediately
      if (!this._locked) {
        // Safe because JS doesn't interrupt you on synchronous operations,
        // so no need for compare-and-swap or anything like that.
        this._locked = true;
        return resolve();
      }

      // Otherwise, wait until somebody releases the lock and try again
      const tryAcquire = () => {
        if (!this._locked) {
          this._locked = true;
          this._ee.removeListener("release", tryAcquire);
          return resolve();
        }
      };
      this._ee.on("release", tryAcquire);
    });
  }

  /**
   * Release the lock after usage
   */
  release() {
    // Release the lock immediately
    this._locked = false;
    setImmediate(() => this._ee.emit("release"));
  }
}

module.exports = Lock;
