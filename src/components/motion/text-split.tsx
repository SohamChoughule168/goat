"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { getScrollMotion } from "@/lib/motion/scroll";
import { DURATION, EASE, MIN_STAGGER } from "@/lib/motion/tokens";

/**
 * TextSplit — character- and word-level typographic reveal.
 *
 * Splits the supplied `text` into `<span>`s (one per word, each containing
 * per-character spans) so gsap can animate them individually. Renders the
 * plain text in HTML first so there is no layout shift and the copy survives
 * without JavaScript. On fine-pointer devices without reduced motion the
 * characters fade/slide up in sequence as the section enters the viewport.
 *
 * variant "word" staggers whole words; "char" staggers individual characters
 * (slower, reserved for short headlines).
 */
interface TextSplitProps {
  children: React.ReactNode;
  variant?: "word" | "char";
  once?: boolean;
  /** Optional class applied to the splitting container (e.g. serif styling). */
  inlineClass?: string;
}

export default function TextSplit({
  children,
  variant = "word",
  once = true,
  inlineClass,
}: TextSplitProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const split = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    // Only split once; subsequent renders keep the generated markup.
    if (node.dataset.tsSplit === "1") return;
    node.dataset.tsSplit = "1";
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode: () => NodeFilter.FILTER_ACCEPT,
    });
    const textNodes: Text[] = [];
    let current: Node | null;
    while ((current = walker.nextNode())) textNodes.push(current as Text);
    for (const textNode of textNodes) {
      const parent = textNode.parentElement!;
      const fragment = document.createDocumentFragment();
      const words = textNode.textContent!.trim().split(/\s+/);
      words.forEach((word, wi) => {
        const wordEl = document.createElement("span");
        wordEl.className = "ts-word";
        wordEl.style.display = "inline-block";
        word.split("").forEach((ch) => {
          const charEl = document.createElement("span");
          charEl.className = "ts-char";
          charEl.style.display = "inline-block";
          charEl.style.opacity = "0";
          charEl.style.transform = "translateY(14px)";
          charEl.textContent = ch === " " ? "\u00A0" : ch;
          wordEl.appendChild(charEl);
        });
        fragment.appendChild(wordEl);
        if (wi < words.length - 1) {
          const space = document.createElement("span");
          space.className = "ts-space";
          space.textContent = "\u00A0";
          fragment.appendChild(space);
        }
      });
      parent.replaceChild(fragment, textNode);
    }
  }, []);

  const reveal = useCallback(async () => {
    const node = ref.current;
    if (reduced || !node) return;
    split();
    const { gsap } = await getScrollMotion();
    const ctx = gsap.context(() => {
      const targets = Array.from(
        node.querySelectorAll<HTMLElement>(".ts-char"),
      );
      gsap.from(targets, {
        y: 14,
        opacity: 0,
        duration: DURATION.reveal,
        ease: EASE.entrance,
        stagger:
          variant === "char" ? MIN_STAGGER : MIN_STAGGER * 2,
        delay: 0,
        once,
        scrollTrigger: {
          trigger: node,
          start: "top 85%",
          end: "bottom 40%",
          toggleActions: once ? "play none none none" : "play none reverse none",
          once,
        },
      });
    });
    return () => ctx.revert();
  }, [reduced, variant, once, split]);

  useEffect(() => {
    split();
    let cleanup: (() => void) | undefined;
    reveal().then((revert) => {
      cleanup = revert;
    });
    return () => {
      cleanup?.();
    };
  }, [reveal, split]);

  const containerClass = ["text-split", inlineClass].filter(Boolean).join(" ");
  return (
    <div ref={ref} className={containerClass} data-ts-ready>
      {children}
    </div>
  );
}
