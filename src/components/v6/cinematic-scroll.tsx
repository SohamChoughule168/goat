"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CinematicSection {
  id: string;
  trigger: string;
  start: string;
  end: string;
  scrub?: number | boolean;
  pin?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  animation?: (tl: gsap.core.Timeline) => void;
}

interface CinematicScrollProps {
  sections: CinematicSection[];
  children: React.ReactNode;
  className?: string;
}

export function createCinematicTimeline(steps: Array<{
  target: string | Element;
  vars: gsap.TweenVars;
  position?: string | number;
}>) {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  
  steps.forEach(step => {
    if (typeof step.position === "string") {
      tl.to(step.target, step.vars, step.position);
    } else {
      tl.to(step.target, step.vars, step.position ?? "<");
    }
  });
  
  return tl;
}

// Pre-built cinematic sequences
export const CINEMATIC_SEQUENCES = {
  // Hero entrance sequence
  heroEntrance: (elements: {
    kicker: string;
    title: string;
    subtitle: string;
    cta: string;
    metrics: string;
    scrollHint: string;
  }) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.from(elements.kicker, { 
      y: 30, 
      opacity: 0, 
      duration: 0.8 
    })
    .from(elements.title, { 
      y: 40, 
      opacity: 0, 
      duration: 1.0,
      stagger: 0.15
    }, "-=0.4")
    .from(elements.subtitle, { 
      y: 30, 
      opacity: 0, 
      duration: 0.8 
    }, "-=0.6")
    .from(elements.cta, { 
      y: 30, 
      opacity: 0, 
      scale: 0.95,
      duration: 0.6,
      stagger: 0.1
    }, "-=0.4")
    .from(elements.metrics, { 
      y: 30, 
      opacity: 0, 
      duration: 0.8,
      stagger: 0.08
    }, "-=0.5")
    .from(elements.scrollHint, { 
      y: 20, 
      opacity: 0, 
      duration: 0.6 
    }, "-=0.3");
    
    return tl;
  },

  // Section reveal with stagger
  sectionReveal: (container: string, items: string, stagger = 0.1) => {
    return gsap.from(items, {
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger,
      ease: "power3.out"
    });
  },

  // Pin and scrub animation
  pinScrub: (trigger: string, end: string, animation: (tl: gsap.core.Timeline) => void) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top top",
        end,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1
      }
    });
    
    animation(tl);
    return tl;
  },

  // Counter animation
  counter: (element: string, endValue: number, duration = 2, decimals = 0) => {
    const obj = { value: 0 };
    return gsap.to(obj, {
      value: endValue,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        const el = document.querySelector(element);
        if (el) el.textContent = obj.value.toFixed(decimals);
      }
    });
  },

  // Typewriter effect
  typewriter: (element: string, text: string, speed = 0.03) => {
    const tl = gsap.timeline();
    const chars = text.split("");
    
    tl.set(element, { text: "" });
    chars.forEach((char, i) => {
      tl.to(element, {
        text: { value: chars.slice(0, i + 1).join(""), delimiter: "" },
        duration: speed,
        ease: "none"
      });
    });
    
    return tl;
  },

  // Morphing shapes
  morph: (from: string, to: string, duration = 1) => {
    return gsap.to(from, {
      morphSVG: to,
      duration,
      ease: "power2.inOut"
    });
  },

  // Parallax layers
  parallax: (elements: Array<{ selector: string; speed: number }>) => {
    elements.forEach(({ selector, speed }) => {
      gsap.to(selector, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: selector,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  },

  // 3D card flip
  cardFlip: (card: string, trigger: string) => {
    return gsap.to(card, {
      rotationY: 180,
      duration: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger,
        start: "top 70%",
        toggleActions: "play reverse play reverse"
      }
    });
  },

  // Text scramble
  scramble: (element: string, text: string, duration = 1) => {
    return gsap.to(element, {
      duration,
      scrambleText: { text, chars: "!@#$%^&*()", speed: 0.3 },
      ease: "none"
    });
  },

  // Split text animation
  splitText: (element: string, type: "chars" | "words" | "lines" = "chars") => {
    // Requires SplitText plugin
    return gsap.from(element, {
      opacity: 0,
      y: type === "lines" ? 50 : 20,
      duration: 0.05,
      stagger: 0.02,
      ease: "power3.out"
    });
  }
};

// Advanced scroll-linked animations
export function createScrollLinkedAnimation(
  trigger: string,
  animation: (progress: number) => void,
  options: {
    start?: string;
    end?: string;
    scrub?: number | boolean;
    onUpdate?: (self: ScrollTrigger) => void;
  } = {}
) {
  return ScrollTrigger.create({
    trigger,
    start: options.start || "top bottom",
    end: options.end || "bottom top",
    scrub: options.scrub ?? 1,
    onUpdate: (self) => {
      animation(self.progress);
      options.onUpdate?.(self);
    }
  });
}

// Viewport-based animations
export function createViewportAnimation(
  element: string,
  animation: (inView: boolean) => void,
  options: {
    once?: boolean;
    margin?: string;
  } = {}
) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      animation(entry.isIntersecting);
      if (options.once && entry.isIntersecting) {
        observer.unobserve(entry.target);
      }
    },
    {
      rootMargin: options.margin || "0px",
      threshold: 0.1
    }
  );

  const el = document.querySelector(element);
  if (el) observer.observe(el);

  return () => observer.disconnect();
}

// Magnetic cursor following
export function createMagneticEffect(
  element: string,
  strength = 0.3,
  options: {
    rotate?: boolean;
    scale?: boolean;
  } = {}
) {
  const elementEl = document.querySelector<HTMLElement>(element);
  if (!elementEl) return () => {};
  const el = elementEl;

  let raf = 0;
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  function onMouseMove(e: MouseEvent) {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX = (e.clientX - centerX) * strength;
    mouseY = (e.clientY - centerY) * strength;
  }

  function animate() {
    raf = requestAnimationFrame(animate);
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    let transform = `translate(${currentX}px, ${currentY}px)`;
    if (options.scale) transform += ` scale(${1 + Math.abs(currentX) * 0.001})`;
    if (options.rotate) transform += ` rotate(${currentX * 0.05}deg)`;
    
    el.style.transform = transform;
  }

  document.addEventListener("mousemove", onMouseMove);
  animate();

  return () => {
    document.removeEventListener("mousemove", onMouseMove);
    cancelAnimationFrame(raf);
    el.style.transform = "";
  };
}

// Spring physics helpers
export const SPRING_PRESETS = {
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 250, damping: 20 },
  bouncy: { stiffness: 300, damping: 10 },
  smooth: { stiffness: 100, damping: 15 }
};

export function springTo(
  target: Record<string, number>,
  vars: gsap.TweenVars,
  preset: keyof typeof SPRING_PRESETS = "smooth"
) {
  return gsap.to(target, {
    ...vars,
    ...SPRING_PRESETS[preset],
    ease: "none"
  });
}

// Stagger helpers
export function createStagger(
  elements: string | Element[],
  animation: (el: Element, i: number) => gsap.TweenVars,
  stagger = 0.1,
  from: "start" | "center" | "end" | "edges" | "random" = "start"
) {
  const els = typeof elements === "string" 
    ? Array.from(document.querySelectorAll(elements)) 
    : Array.from(elements);
  
  // Use gsap.to with stagger instead
  return gsap.to(els, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: { amount: stagger * els.length, from },
    ...animation(els[0], 0)
  });
}

// Cleanup helper
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach(st => st.kill());
}

export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

// Performance monitoring
export function createPerformanceMonitor() {
  let frames = 0;
  let lastTime = performance.now();
  let fps = 60;
  
  function tick() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      fps = frames;
      frames = 0;
      lastTime = now;
      // Could dispatch custom event with FPS
    }
    requestAnimationFrame(tick);
  }
  
  tick();
  return { getFPS: () => fps };
}