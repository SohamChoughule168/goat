export type CraftStatus = "live" | "pending";
export type CraftSpan = "wide" | "two-thirds" | "half" | "third";

export interface CraftStation {
  /** Stable key used by the lab to mount the matching station component. */
  id: string;
  index: string;
  /** The installed skill the station demonstrates. */
  skill: string;
  title: string;
  summary: string;
  detail: string;
  runtime: string;
  payload: string;
  fallback: string;
  /** Exhibition label printed under the poster. */
  poster: string;
  status: CraftStatus;
  /** Present only when a real, self-hosted asset is missing. */
  pendingReason?: string;
  span: CraftSpan;
}

/**
 * The eleven stations of the workshop.
 *
 * Nine run with code we can ship today. Two are deliberately incomplete: no
 * authored Rive or Spline asset exists in this repository, so those stations
 * carry a visible gap rather than a fake demo.
 */
export const CRAFT_STATIONS: CraftStation[] = [
  {
    id: "route-gate-budget",
    index: "01",
    skill: "premium-creative-web-engineering",
    title: "Route, gate, budget.",
    summary:
      "The router treats “premium” as four gates a page must pass before it ships, not a pile of effects applied after.",
    detail:
      "Run the token: content and route, render path, performance budget, then accessibility and QA. Any gate can stop the build. This is the same checklist used on the evidence routes and this bench — the visual budget is spent only after the page is cheap enough to carry it.",
    runtime: "DOM + SVG",
    payload: "0 KB runtime",
    fallback: "Static route diagram",
    poster: "Four gates, one token, no skipped checks.",
    status: "live",
    span: "wide",
  },
  {
    id: "build-order",
    index: "02",
    skill: "3d-website-architect",
    title: "Build order before triangles.",
    summary:
      "A scene is an argument about structure. This is the order we resolve before opening a 3D editor.",
    detail:
      "Intent, scene graph, camera, materials, performance and fallback stack from the floor up. If the fallback is not designed at the start, the scene is not finished — it is a demo waiting for a weak device. The sequence is the deliverable; the geometry is the easy part. This station renders the stack as an actual Three.js scene with procedural geometry.",
    runtime: "Three.js (React Three Fiber)",
    payload: "≈80 KB gzip Three.js chunk, on run",
    fallback: "Static six-layer stack",
    poster: "Six layers resolved before the first triangle.",
    status: "live",
    span: "wide",
  },
  {
    id: "exploded-study",
    index: "03",
    skill: "ai-ui-ux-motion-engine",
    title: "Exploded, then explained.",
    summary:
      "A cinematic study is a relationship between parts: rest position, travel path and a label that survives the move.",
    detail:
      "Scrub the stack from assembled to fully exploded. The labels travel with their plates; nothing depends on a video. This is the same grammar as the homepage sequence, drawn as a front elevation so the two surfaces are related without repeating the same scene.",
    runtime: "SVG + range input",
    payload: "0 KB runtime",
    fallback: "Static exploded elevation",
    poster: "Four plates, one axis, labels that hold.",
    status: "live",
    span: "half",
  },
  {
    id: "film-bench",
    index: "04",
    skill: "ai-ui-ux-motion-engine",
    title: "Film bench.",
    summary:
      "One eight-second film, scrubbed by the station's own progress. No renderer, no model, no autoplay.",
    detail:
      "The film loads only when you run the station. Scroll position maps to time; the tone chips grade the frame. Reset unmounts the video and returns the poster. This replaces the retired renderer bench with real footage.",
    runtime: "Scroll-scrubbed MP4",
    payload: "≈2 MB, on run",
    fallback: "Poster + first frame",
    poster: "Six materials, one take, no renderer.",
    status: "live",
    span: "wide",
  },
  {
    id: "honest-scrub",
    index: "05",
    skill: "gsap-scrolltrigger",
    title: "A short, honest scrub.",
    summary:
      "Scroll-linked motion should end when the idea ends. This frame scrubs four marks and then gives the page back.",
    detail:
      "The timeline is tied to this frame’s own progress, not a page-level pin. Reset kills the ScrollTrigger and returns a finished static state; Run rebuilds it. No reader is held in place to finish an animation they did not ask for.",
    runtime: "GSAP ScrollTrigger",
    payload: "Shared motion chunk, on run",
    fallback: "Static four-mark sequence",
    poster: "Four marks, scrubbed once, then released.",
    status: "live",
    span: "half",
  },
  {
    id: "state-bridge",
    index: "06",
    skill: "web3d-integration-patterns",
    title: "One state, two surfaces.",
    summary:
      "DOM controls and a canvas projection read from the same object. There is no second copy of the truth.",
    detail:
      "Yaw, lift and spread are DOM inputs. The canvas redraws from the same values and the readout prints them back. This is the pattern behind the homepage layer legend: the text layer never guesses what the scene is doing, and the scene never owns copy.",
    runtime: "Canvas 2D",
    payload: "0 KB runtime",
    fallback: "Static isometric assembly",
    poster: "One state object, two surfaces.",
    status: "live",
    span: "half",
  },
  {
    id: "tilt-plate",
    index: "07",
    skill: "lightweight-3d-effects",
    title: "Depth on one object.",
    summary:
      "Vanilla-Tilt in about forty lines: perspective, two rotations and three layers. No background loop, no particle field.",
    detail:
      "The card tilts only under a fine pointer and never on a touch device. Reset recentres it. The point is restraint: one object gains depth, the page does not become a fairground. No Vanta background was invited.",
    runtime: "CSS 3D + pointer",
    payload: "0 KB runtime",
    fallback: "Flat layered card",
    poster: "One object gains depth; the page does not.",
    status: "live",
    span: "third",
  },
  {
    id: "calibration-dial",
    index: "08",
    skill: "lottie-animations",
    title: "A dial, on request.",
    summary:
      "A hand-authored Lottie loop for the small moments that do not justify a 3D runtime.",
    detail:
      "The poster is the default. Run loads the JSON and the renderer, plays ninety frames once, and hands back play, pause and replay. Under reduced motion it plays once and restores the poster. The runtime is real; the seal on Trust uses the same discipline.",
    runtime: "Lottie",
    payload: "≈75 KB gzip runtime, on run",
    fallback: "Static dial",
    poster: "Ninety frames, one dial, no autoplay.",
    status: "live",
    span: "third",
  },
  {
    id: "rive-state-machine",
    index: "09",
    skill: "rive-interactive",
    title: "State machine, not guesswork.",
    summary:
      "Rive earns its payload when a state machine replaces imperative animation code. This station is honest about what is missing.",
    detail:
      "The poster documents the intended machine: idle, hover, press, success, with explicit inputs and transitions. No .riv file is bundled, so the run control is disabled. We would rather show a labelled gap than ship a fake demo to fill the frame.",
    runtime: "Rive — not installed",
    payload: ".riv not supplied",
    fallback: "State diagram poster",
    poster: "Idle → hover → press → success.",
    status: "pending",
    pendingReason:
      "No .riv file is bundled. The station will run when an authored, self-hosted Rive asset exists.",
    span: "third",
  },
  {
    id: "spline-scene",
    index: "10",
    skill: "spline-interactive",
    title: "A scene we have not authored.",
    summary:
      "Spline is a designer-facing scene format. The poster records the intended frame; the runtime waits for a real, self-hosted scene.",
    detail:
      "Camera, key light and bounding box are marked on the poster. The station will load a .splinecode file from public/craft/ when one exists. Until then the control stays disabled and the gap stays visible, because a placeholder runtime is not proof of craft.",
    runtime: "Spline — not installed",
    payload: ".splinecode not supplied",
    fallback: "Wireframe scene poster",
    poster: "Camera, key light, bounding box. Scene pending.",
    status: "pending",
    pendingReason:
      "No .splinecode file is bundled. The station will run when an authored, self-hosted Spline scene exists.",
    span: "third",
  },
  {
    id: "adapted-ledger",
    index: "11",
    skill: "animated-component-libraries",
    title: "Borrowed, then audited.",
    summary:
      "A Magic UI / React Bits enter-once list, reduced to the part that survives this design system.",
    detail:
      "The original pattern leans on blur, spring and layout animation. This adaptation keeps the stagger, removes the blur and spring, and uses the institutional 180 ms state curve. The audit is the point: a component is not premium because it arrived animated.",
    runtime: "DOM + CSS",
    payload: "0 KB runtime",
    fallback: "Static ledger",
    poster: "Five rows, one stagger, no blur.",
    status: "live",
    span: "two-thirds",
  },
  {
    id: "fernhollow-spatial-valley",
    index: "12",
    skill: "creative-3d-environments",
    title: "Spatial flora & ambient synthesizer.",
    summary:
      "A 3D night valley with 2,200 glowing point-sprite flowers, Catmull-Rom camera flight, and harmonic synthesizer.",
    detail:
      "Thousands of point-sprite flora particles scattered along procedural terrain, rendered with additive blending and size attenuation. Camera flies along a 3D Catmull-Rom spline while Web Audio API synthesizes a multi-oscillator ambient soundscape.",
    runtime: "Three.js r160 + Web Audio API",
    payload: "≈45 KB runtime, on run",
    fallback: "Static night valley poster",
    poster: "Bioluminescent flora, camera spline, ambient audio.",
    status: "live",
    span: "wide",
  },
];

export const CRAFT_STATS = {
  stations: CRAFT_STATIONS.length,
  live: CRAFT_STATIONS.filter((station) => station.status === "live").length,
  pending: CRAFT_STATIONS.filter((station) => station.status === "pending").length,
} as const;

/** The six rows the adapted ledger station reveals. */
export const CRAFT_LEDGER = [
  { label: "Initial JS", value: "No R3F, GSAP or Lottie", note: "poster only" },
  { label: "Film payload", value: "≈2 MB", note: "on run" },
  { label: "Three.js payload", value: "≈80 KB gzip", note: "on run" },
  { label: "Mobile LCP", value: "1.4 s", note: "homepage" },
  { label: "Layout shift", value: "0.00", note: "measured" },
  { label: "Console errors", value: "0", note: "all evidence routes" },
] as const;
