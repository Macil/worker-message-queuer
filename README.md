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

In a web worker, import the module first before all other modules so that it can
attach its message handler before any top-level awaits, and then use the
imported `addMessageEventListener` function instead of `self.onmessage = ...` to
attach your message event listener and process all queued events:

```ts
import { addMessageEventListener } from "...";
import { exampleFunction } from "example/module-using-top-level-await";

addMessageEventListener((event) => {
  console.log("Received message:", event.data);
});
```
