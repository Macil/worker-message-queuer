// deno-lint-ignore-file no-explicit-any
import { DeferredPromise } from "https://deno.land/x/deferred_promise@v1.0.0/mod.ts";

const defer = new DeferredPromise<(event: MessageEvent) => unknown>();

(self as any).onmessage = (event: MessageEvent) => {
  defer.promise.then((callback) => callback(event));
};

/**
 * Import this module first in a worker to ensure a message event handler is
 * set up before any messages are sent to the worker in the case that
 * top-level await is used in the worker module or its dependencies.
 *
 * Use this function within the worker module to set up the message event
 * listener and to deliver any queued events to it.
 *
 * @param callback The message handler to use for the current worker.
 *
 * @example
 * Example usage in a worker module:
 * ```ts
 * import { addMessageEventListener } from "...";
 * import { exampleFunction } from "example/module-using-top-level-await";
 *
 * addMessageEventListener((event) => {
 *  console.log("Received message:", event.data);
 * });
 * ```
 */
export function addMessageEventListener(
  callback: (event: MessageEvent) => unknown,
): void {
  (self as any).onmessage = callback;
  defer.resolve(callback);
}
