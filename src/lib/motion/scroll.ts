import type Lenis from "lenis";
import type { gsap as GsapNamespace } from "gsap";
import type { ScrollTrigger as ScrollTriggerStatic } from "gsap/ScrollTrigger";
import { readMotionEnvironment } from "@/lib/motion/reduced-motion";

/**
 * The one owner of Lenis and ScrollTrigger.
 *
 * Components create their own `gsap.context()` / ScrollTrigger instances and
 * clean them up on unmount. They must not construct a second Lenis instance.
 */

export interface ScrollMotionController {
  gsap: typeof GsapNamespace;
  ScrollTrigger: typeof ScrollTriggerStatic;
  lenis: Lenis | null;
  /** Recalculate trigger positions after fonts, images or layout changes. */
  refresh: () => void;
  /** Explicit teardown for HMR, tests or a full app reset. */
  destroy: () => void;
}

interface InternalController extends ScrollMotionController {
  ticker: ((time: number) => void) | null;
  onLoad: (() => void) | null;
}

type ScrollWindow = Window & { __lenis?: Lenis | null };

let controller: InternalController | null = null;
let pending: Promise<InternalController> | null = null;

async function createController(): Promise<InternalController> {
  const [{ gsap }, { ScrollTrigger }, { default: LenisClass }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("lenis"),
  ]);

  gsap.registerPlugin(ScrollTrigger);

  const environment = readMotionEnvironment();
  let lenis: Lenis | null = null;
  let ticker: ((time: number) => void) | null = null;

  if (!environment.reduced && environment.finePointer) {
    lenis = new LenisClass({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    const activeLenis = lenis;
    ticker = (time: number) => activeLenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    (window as ScrollWindow).__lenis = lenis;
  }

  const refresh = () => ScrollTrigger.refresh();

  const onLoad = () => refresh();
  window.addEventListener("load", onLoad, { once: true });
  document.fonts?.ready.then(refresh).catch(() => undefined);

  const instance: InternalController = {
    gsap,
    ScrollTrigger,
    lenis,
    refresh,
    ticker,
    onLoad,
    destroy: () => {
      if (ticker) gsap.ticker.remove(ticker);
      window.removeEventListener("load", onLoad);
      lenis?.destroy();
      (window as ScrollWindow).__lenis = undefined;
      controller = null;
      pending = null;
    },
  };

  return instance;
}

export async function getScrollMotion(): Promise<ScrollMotionController> {
  if (typeof window === "undefined") {
    throw new Error("getScrollMotion() is browser-only");
  }

  if (controller) return controller;
  if (pending) return pending;

  pending = createController()
    .then((instance) => {
      controller = instance;
      pending = null;
      return instance;
    })
    .catch((error) => {
      pending = null;
      throw error;
    });

  return pending;
}

/** Refresh after fonts, images or layout changes. Safe before initialisation. */
export async function refreshScrollMotion(): Promise<void> {
  if (typeof window === "undefined") return;
  const instance = controller ?? (await getScrollMotion());
  instance.refresh();
}

/** Destroy the shared controller. Intended for HMR and full teardown. */
export function destroyScrollMotion(): void {
  controller?.destroy();
  controller = null;
  pending = null;
}
