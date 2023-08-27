// deno-lint-ignore-file no-explicit-any
import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.200.0/assert/mod.ts";
import { delay } from "https://deno.land/std@0.200.0/async/delay.ts";

import { addMessageEventListener } from "./mod.ts";

Deno.test("addMessageEventListener", async () => {
  (self as any).onmessage("first message");
  (self as any).onmessage("second message");

  const receivedMessages: unknown[] = [];
  function messageEventHandler(event: unknown) {
    receivedMessages.push(event);
  }
  addMessageEventListener(messageEventHandler);

  assertStrictEquals((self as any).onmessage, messageEventHandler);
  assertEquals(receivedMessages, []);

  await delay(0);

  assertEquals(receivedMessages, ["first message", "second message"]);
});
