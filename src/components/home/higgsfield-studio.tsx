"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Zap, Sparkles, Image as LucideImage, Video, Play, Camera, Film } from "lucide-react";

interface HIGGSFIELD_GENERATION {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  imageAlt: string;
  type: "image" | "video";
  badge: string;
  mode: "text" | "image" | "video";
}

const GENERATIONS: HIGGSFIELD_GENERATION[] = [
  {
    id: "nano-banana-pro",
    title: "Nano Banana Pro",
    subtitle: "Text-to-Image Generation",
    desc: "Google Gemini 3.1 Flash Image · Resolution 1K/2K/4K · Google Search enhancement",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper sheets in morning light",
    type: "image",
    badge: "T2I",
    mode: "text",
  },
  {
    id: "nano-banana-edit",
    title: "Nano Banana Pro Edit",
    subtitle: "Image-to-Image Generation",
    desc: "Up to 14 reference images · Resolution 1K/2K/4K · Google Search enhancement",
    image: "/media/institution/sequence-02-1600.webp",
    imageAlt: "Overlapping blank sheets",
    type: "image",
    badge: "I2I",
    mode: "image",
  },
  {
    id: "seedream-5",
    title: "Seedream 5.0",
    subtitle: "Text-to-Image Generation",
    desc: "ByteDance · Quality basic/high · 8 aspect ratios · up to 4K",
    image: "/media/institution/sequence-03-1600.webp",
    imageAlt: "Cobalt ink dispersing in water",
    type: "image",
    badge: "T2I",
    mode: "text",
  },
  {
    id: "seedream-5-edit",
    title: "Seedream 5.0 Edit",
    subtitle: "Image-to-Image Generation",
    desc: "Up to 14 reference images · Resolution 1K/2K/4K · Professional editing",
    image: "/media/institution/sequence-04-1600.webp",
    imageAlt: "Paper sheets in warm afternoon light",
    type: "image",
    badge: "I2I",
    mode: "image",
  },
  {
    id: "kling-video",
    title: "Kling Video",
    subtitle: "Text-to-Video Generation",
    desc: "Cinematic AI video · Motion control · Real-time generation",
    image: "/media/institution/sequence-05-1600.webp",
    imageAlt: "Quiet room at dusk",
    type: "video",
    badge: "T2V",
    mode: "video",
  },
  {
    id: "sora-video",
    title: "Sora Video",
    subtitle: "Image-to-Video Generation",
    desc: "Animate images · Subtitle synchronization · Cinematic output",
    image: "/media/institution/sequence-01-1600.webp",
    imageAlt: "Paper sheets in morning light",
    type: "video",
    badge: "I2V",
    mode: "video",
  },
];

export default function HiggsfieldStudio() {
  const [activeTab, setActiveTab] = useState("image");
  const [prompt, setPrompt] = useState("A premium institutional branding photograph, minimal aesthetic, bone-white paper, cobalt accents, soft morning light, professional photography");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-generate initial images on mount
  useEffect(() => {
    async function autoGenerate() {
      try {
        const res = await fetch("https://api.muapi.ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_MUAPI_KEY}`,
          },
          body: JSON.stringify({
            model: "nano-banana-pro",
            prompt: "Premium institutional branding photography, bone-white paper sheets, cobalt accents, cool morning light, professional photography, clean minimal aesthetic, no people",
            aspect_ratio: "16:9",
          }),
        });
        const data = await res.json();
        if (data.url) {
          setGeneratedUrl(data.url);
          setGallery([data.url]);
        }
      } catch (err) {
        console.error("Auto-generate failed:", err);
      }
    }
    autoGenerate();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await fetch("https://api.muapi.ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_MUAPI_KEY}`,
        },
        body: JSON.stringify({
          model: activeTab === "image" ? "nano-banana-pro" : "kling-video",
          prompt: prompt,
          ...(activeTab === "image" ? { aspect_ratio: "16:9" } : {}),
        }),
      });
      const data = await res.json();
      if (data.url) {
        setGeneratedUrl(data.url);
        setGallery((prev) => [data.url, ...prev].slice(0, 6));
      }
    } catch (err) {
      console.error("Generation failed:", err);
      setGenerationError("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="inst-section higgsfield-studio" aria-labelledby="home-higgsfield">
      <div className="inst-shell">
        <div className="higgsfield-header">
          <div className="higgsfield-copy">
            <p className="inst-label higgsfield-label-reveal">AI Generation Studio</p>
            <h2 className="inst-h2 mt-5 higgsfield-headline-reveal max-w-[40ch]">
              Generate AI<br />
              <span className="inst-serif">Images & Videos.</span>
            </h2>
            <p className="inst-lede mt-5 higgsfield-lede-reveal max-w-[44ch]">
              Powered by 200+ state-of-the-art models — Flux, Nano Banana, Seedream, Kling, Sora, Veo & more.
              No subscriptions. No vendor lock-in. Real-time generation.
            </p>
            <div className="higgsfield-badge-group mt-6">
              <span className="higgsfield-badge">200+ Models</span>
              <span className="higgsfield-badge">14 Reference Images</span>
              <span className="higgsfield-badge">4K Resolution</span>
              <span className="higgsfield-badge">Lip Sync</span>
            </div>
          </div>

          <div className="higgsfield-generator">
            <div className="higgsfield-card">
              <div className="higgsfield-tabs">
                {["image", "video"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveTab(mode)}
                    className={`higgsfield-tab ${activeTab === mode ? "active" : ""}`}
                  >
                    {mode === "image" ? "🖼️ Image" : "🎬 Video"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleGenerate} className="higgsfield-form">
                <textarea
                  ref={promptRef}
                  placeholder={activeTab === "image" ? "Describe your image..." : "Describe your video..."}
                  rows={4}
                  className="higgsfield-textarea"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="higgsfield-controls">
                  <select className="higgsfield-select" aria-label="Model selection">
                    <option value="nano-banana-pro">Nano Banana Pro</option>
                    <option value="seedream-5">Seedream 5.0</option>
                    <option value="flux-schnell">Flux Schnell</option>
                  </select>
                  <button type="submit" className="higgsfield-btn" disabled={isGenerating}>
                    {isGenerating ? (
                      <span className="flex items-center gap-2">
                        <Play className="w-4 h-4 animate-spin" />
                        Generating…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Generate
                      </span>
                    )}
                  </button>
                </div>
              </form>

              {generationError && (
                <div className="higgsfield-error">
                  <span className="higgsfield-error-icon">⚠️</span>
                  {generationError}
                </div>
              )}

              {generatedUrl && (
                <div className="higgsfield-result">
                  <div className="higgsfield-preview">
                    {activeTab === "video" ? (
                      <video src={generatedUrl} autoPlay loop muted className="w-full h-auto rounded-xl" />
                    ) : (
                      <img src={generatedUrl} alt="Generated" className="w-full h-auto rounded-xl" />
                    )}
                    <div className="higgsfield-actions">
                      <a href={generatedUrl} target="_blank" rel="noopener noreferrer" className="higgsfield-download">
                        <Zap className="w-4 h-4 mr-2" />
                        Download
                      </a>
                      <button className="higgsfield-regenerate">
                        <Zap className="w-4 h-4" />
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="higgsfield-models mt-12">
          <h3 className="inst-label higgsfield-label-reveal">Available Models</h3>
          <div className="higgsfield-model-grid">
            {GENERATIONS.map((model) => (
              <article key={model.id} className="higgsfield-model-card">
                <div className="higgsfield-image-wrap">
                  <img src={model.image} alt={model.imageAlt} width={400} height={300} className="w-full h-full object-cover" />
                  <span className="higgsfield-model-badge">{model.badge}</span>
                </div>
                <div className="higgsfield-model-content">
                  <h4 className="higgsfield-model-title">{model.title}</h4>
                  <p className="higgsfield-model-subtitle">{model.subtitle}</p>
                  <p className="higgsfield-model-desc">{model.desc}</p>
                  <Link href="#home-higgsfield" className="higgsfield-model-link">
                    Generate with {model.title}
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
