"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const TEAM = [
  {
    name: "Arjun Patel",
    role: "Founder & CEO",
    bio: "15+ years building scalable web platforms. Ex-Google, ex-Stripe. Obsessed with Core Web Vitals and developer experience.",
    initials: "AP",
    color: "#14b8a6",
    skills: ["Architecture", "Performance", "Strategy"],
  },
  {
    name: "Meera Krishnan",
    role: "CTO",
    bio: "Ex-Meta, ex-Netflix. Distributed systems and ML infrastructure. Built recommendation systems serving 100M+ users.",
    initials: "MK",
    color: "#06b6d4",
    skills: ["ML Systems", "Distributed Systems", "AI"],
  },
  {
    name: "Rohit Verma",
    role: "VP Engineering",
    bio: "12+ years shipping products at scale. Ex-Flipkart, ex-Razorpay. Obsessed with developer experience and shipping velocity.",
    initials: "RV",
    color: "#10b981",
    skills: ["Platform Engineering", "DevEx", "Scale"],
  },
  {
    name: "Sneha Reddy",
    role: "Design Director",
    bio: "Ex-Airbnb, ex-Figma. Design systems that scale. Champion of accessibility and design-engineering collaboration.",
    initials: "SR",
    color: "#a855f7",
    skills: ["Design Systems", "Accessibility", "Brand"],
  },
  {
    name: "Karan Malhotra",
    role: "AI Lead",
    bio: "Ex-OpenAI, ex-Hugging Face. RAG, fine-tuning, and production ML. Published at NeurIPS, ICML. Building reliable AI products.",
    initials: "KM",
    color: "#f59e0b",
    skills: ["LLMs", "RAG", "MLOps"],
  },
  {
    name: "Ananya Iyer",
    role: "Head of Delivery",
    bio: "Ex-Thoughtworks, ex-Atlassian. Agile at scale. Ensures every project ships on time, on budget, with zero surprises.",
    initials: "AI",
    color: "#ec4899",
    skills: ["Delivery", "Agile", "Client Success"],
  },
];

export function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="team-section relative section-y"
      data-component="team"
    >
      <div className="shell">
        <div className="section-header">
          <span className="section-badge">The people who ship</span>
          <h2 className="section-title">Senior-led. No juniors learning on your dime.</h2>
          <p className="section-subtitle">
            Every project is led by principals with 10+ years shipping at scale.
            You work directly with the people who architect and build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true, margin: "-50px" }}
              className="team-card group"
            >
              <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                <div
                  className="w-full h-full flex items-center justify-center text-4xl font-bold transition-transform duration-500 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${member.color} 0%, ${member.color}dd 100%)`,
                    color: "white",
                  }}
                >
                  {member.initials}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-card)]/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <div className="flex gap-2">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded-md text-xs font-mono"
                        style={{ background: `${member.color}20`, border: `1px solid ${member.color}40`, color: member.color }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-b-2xl glass-strong">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${member.color} 0%, ${member.color}dd 100%)`, color: "white" }}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{member.name}</h3>
                    <p className="text-sm" style={{ color: member.color }}>{member.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{member.bio}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="badge badge-primary text-xs"
                      style={{ background: `${member.color}15`, borderColor: `${member.color}30`, color: member.color }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="absolute inset-0 border-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ borderColor: member.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}