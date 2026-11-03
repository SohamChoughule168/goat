"use client";

import Link from "next/link";
import { ArrowUpRight, Zap, Sparkles, Package, Monitor, Film, Palette } from "lucide-react";

interface FeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

const FEATURED_ITEMS: FeaturedItem[] = [
  {
    id: "hero-cinematic",
    title: "Cinematic Hero",
    subtitle: "Multi-layer paper composition",
    description: "Real photographs layered in CSS 3D space with Ken Burns scroll effects",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper sheets in morning light",
    icon: <Sparkles className="text-yellow-400" />,
    color: "from-yellow-400 to-orange-600",
    href: "#",
  },
  {
    id: "scroll-wipe",
    title: "Scroll Wipe",
    subtitle: "Directional clip-path reveals",
    description: "Images wipe in from different directions as you scroll down each card",
    image: "/media/institution/sequence-02-1600.webp",
    imageAlt: "Overlapping blank sheets",
    icon: <Zap className="text-cyan-400" />,
    color: "from-cyan-400 to-blue-600",
    href: "#",
  },
  {
    id: "image-stack-3d",
    title: "Image Stack 3D",
    subtitle: "Images separated in 3D space",
    description: "Pure CSS 3D transforms — images fan out with rotation as you scroll",
    image: "/media/institution/sequence-03-1600.webp",
    imageAlt: "Cobalt ink dispersing in water",
    icon: <Package className="text-purple-400" />,
    color: "from-purple-400 to-fuchsia-600",
    href: "#",
  },
  {
    id: "glass-cards",
    title: "Glassmorphism Cards",
    subtitle: "Apple-style backdrop blur cards",
    description: "Backdrop blur, semi-transparent backgrounds, soft shadows, 3D tilt hover",
    image: "/media/institution/sequence-04-1600.webp",
    imageAlt: "Paper sheets in warm afternoon light",
    icon: <Palette className="text-pink-400" />,
    color: "from-pink-400 to-rose-600",
    href: "#",
  },
  {
    id: "video-3d-parallax",
    title: "3D Video Parallax",
    subtitle: "Scroll-synced video in 3D space",
    description: "Video tilts, rotates and scales in CSS 3D space synced to scroll position",
    image: "/media/institution/sequence-05-1600.webp",
    imageAlt: "Quiet room at dusk",
    icon: <Film className="text-red-400" />,
    color: "from-red-400 to-rose-600",
    href: "#",
  },
  {
    id: "infinite-marquee",
    title: "Infinite Marquee",
    subtitle: "Seamless scrolling text band",
    description: "Pure CSS marquee animation displaying all available services continuously",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper sheets in morning light",
    icon: <Monitor className="text-green-400" />,
    color: "from-green-400 to-teal-600",
    href: "#",
  },
];

export default function FeaturedGrid() {
  return (
    <section className="inst-section featured-grid-section" aria-labelledby="home-featured">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label featured-label-reveal">Premium Features</p>
            <h2 className="inst-h2 mt-5 featured-headline-reveal max-w-[40ch]">
              Built for impact<br />
              <span className="inst-serif">Designed for scale.</span>
            </h2>
          </div>
        </div>

        <div className="featured-grid">
          {FEATURED_ITEMS.map((item) => (
            <article key={item.id} className="featured-item">
              <Link href={item.href} className="featured-link">
                <div className="featured-image-wrap">
                  <img src={item.image} alt={item.imageAlt} width={600} height={450} loading="lazy" decoding="async" className="featured-image" />
                  <div className="featured-image-overlay" />
                  <div className="featured-badge">
                    <span className="badge-icon">{item.icon}</span>
                  </div>
                </div>
                <div className="featured-content">
                  <span className="featured-title">{item.title}</span>
                  <p className="featured-subtitle">{item.subtitle}</p>
                  <p className="featured-description">{item.description}</p>
                  <span className="featured-arrow">→ View Details</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
