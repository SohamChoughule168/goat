"use client";

import { useSyncExternalStore } from "react";
import { MOTION_QUERY } from "@/lib/motion/tokens";

function subscribe(callback: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function read() {
  return window.matchMedia(MOTION_QUERY).matches;
}

function readOnServer() {
  return false;
}

/** Reads the shared reduced-motion preference without a hydration mismatch. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, read, readOnServer);
}
