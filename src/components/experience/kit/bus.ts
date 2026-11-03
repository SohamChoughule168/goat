/** Tiny typed pub/sub — lets HTML pages talk to the active scene (and vice versa). */

export type SignalEvent =
  | "signal:focus"
  | "signal:blur"
  | "signal:input"
  | "signal:success"
  | "signal:error";

type Handler = (event: SignalEvent, detail?: unknown) => void;

const handlers = new Set<Handler>();

export function onSignal(handler: Handler): () => void {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}

export function emitSignal(event: SignalEvent, detail?: unknown): void {
  handlers.forEach((handler) => handler(event, detail));
}
