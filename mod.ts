// deno-lint-ignore-file no-explicit-any
import { DeferredPromise } from "https://deno.land/x/deferred_promise@v1.0.0/mod.ts";

const defer = new DeferredPromise<(event: MessageEvent) => unknown>();

(self as any).onmessage = (event: MessageEvent) => {
  defer.promise.then((callback) => callback(event));
};

/**
 * Use this function within a worker module to attach the message event
 * listener and to deliver any queued message events to it.
 *
 * This function fixes the issue where message events sent during top-level await
 * inside of a worker module would be lost.
 *
 * @param callback The message handler to use for the current worker.
 *
 * @example
 * Example usage in a worker module:
 * ```ts
 * import { addMessageEventListener } from "https://deno.land/x/worker_message_queuer@v1.0.0/mod.ts";
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
