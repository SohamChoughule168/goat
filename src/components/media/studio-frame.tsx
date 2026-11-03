"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TiltFrame from "@/components/ui/tilt-frame";

type StudioFrameProps = {
  index?: string;
  label?: string;
  location?: string;
};

export default function StudioFrame({
  index = "Studio — 01",
  label = "A working session, illustrated",
  location = "Mumbai",
}: StudioFrameProps) {
  const frameRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.065]);

  return (
    <figure ref={frameRef} className="studio-frame" data-reveal="fade">
      <div className="studio-frame-media">
        <TiltFrame max={4}>
          <motion.img
          src="/images/studio-team.jpg"
          srcSet="/images/studio-team-1200.webp 1200w, /images/studio-team-2000.webp 2000w"
          sizes="(min-width: 1344px) 1152px, calc(100vw - 48px)"
          width={2000}
          height={1493}
          alt="Illustration of four colleagues reviewing a user-flow diagram and mobile prototypes in a bright studio."
          loading="lazy"
          decoding="async"
          style={{ y, scale }}
        />
        </TiltFrame>
      </div>
      <figcaption className="studio-frame-caption">
        <span className="studio-frame-index">{index}</span>
        <span>{label}</span>
        <span>{location}</span>
      </figcaption>
    </figure>
  );
}
