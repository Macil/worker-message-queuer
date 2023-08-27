# worker-message-queuer

This is a Deno module for queuing messages sent to a worker thread while
top-level await is used in order to prevent missed messages.

In Javascript, a Web Worker module is expected to immediately synchronously
attach a message event listener to itself (through `self.onmessage = ...` or
`self.addEventListener("message", ...)`), or else messages sent to it before the
message event listener is attached will be lost. This is a problem when using
top-level await before attaching the message event listener because the worker
may receive messages before the top-level await is finished. This situation
easily arises when a worker module imports dependencies that use top-level await
internally.

This module solves issues like
[Worker's postMessage not working](https://github.com/denoland/deno/issues/14098).

## Usage

In a web worker, use the `addMessageEventListener` function from this module
instead of `self.onmessage = ...` to attach your message event listener and
process all queued events:

```ts
import { addMessageEventListener } from "https://deno.land/x/worker_message_queuer@v1.0.1/mod.ts";
import { exampleFunction } from "example/module-using-top-level-await";

addMessageEventListener((event) => {
  console.log("Received message:", event.data);
});
```

As long as this module is statically imported in the worker module, it does not
matter whether it is imported before or after other imports containing top-level
await.
