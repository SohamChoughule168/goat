"use client";

import { useEffect } from "react";

export default function ForceDark() {
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.dataset.theme;
    el.dataset.theme = "dark";
    return () => {
      try {
        const s = localStorage.getItem("imaginars-theme");
        const d = s === "dark" || ((!s || s === "system") && window.matchMedia("(prefers-color-scheme: dark)").matches);
        el.dataset.theme = d ? "dark" : "light";
      } catch {
        if (prev) el.dataset.theme = prev;
      }
    };
  }, []);
  return null;
}
