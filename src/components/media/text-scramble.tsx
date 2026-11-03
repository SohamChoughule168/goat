"use client";

import { useEffect, useState } from "react";

/**
 * Text Scramble — text that scrambles and resolves on scroll entry.
 * Lightweight, no dependencies.
 */
interface TextScrambleProps {
  text: string;
  className?: string;
}

const CHARS = "!<>-_\\/[]{}—=+*^?#________";

export default function TextScramble({ text, className }: TextScrambleProps) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let frame = 0;
    let start = 0;
    const duration = 1200;

    const update = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      let result = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (progress < 0.1 || i < Math.floor(text.length * progress)) {
          result += char;
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(result);

      if (progress < 1) {
        frame = requestAnimationFrame(update);
      }
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [text]);

  return (
    <span className={`text-scramble ${className || ""}`} aria-label={text}>
      {display}
    </span>
  );
}
