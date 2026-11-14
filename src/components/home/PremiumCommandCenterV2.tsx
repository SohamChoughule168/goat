"use client";

import { useEffect, useId, useRef, useState } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "motion/react";
import { 
  useThreeCanvas, 
  getParticleCount,
  MOTION_VARIANTS,
  DESIGN_COLORS,
  INTERACTIONS,
  SPRINGS,
} from "@/components/premium";
import NectarlineTerminal from "./NectarlineTerminal";

type BranchId = "all" | "main" | "north" | "online";
type ViewId = "enquiries" | "admissions" | "records";

const branches: { id: BranchId; label: string }[] = [
  { id: "all", label: "All branches" },
  { id: "main", label: "Main campus" },
  { id: "north", label: "North campus" },
  { id: "online", label: "Online" },
];

const branchData: Record<BranchId, { enquiries: number; qualified: number; fill: number }> = {
  all: { enquiries: 1248, qualified: 412, fill: 78 },
  main: { enquiries: 542, qualified: 186, fill: 82 },
  north: { enquiries: 438, qualified: 141, fill: 76 },
  online: { enquiries: 268, qualified: 85, fill: 70 },
};

const views: { id: ViewId; label: string; color: string }[] = [
  { id: "enquiries", label: "Enquiries", color: DESIGN_COLORS.primary.main },
  { id: "admissions", label: "Admissions", color: DESIGN_COLORS.secondary.main },
  { id: "records", label: "Records", color: DESIGN_COLORS.accent.purple },
];

const enquiryRows = [
  { name: "Aditi Mane", detail: "NEET two-year", branch: "main", source: "Meta Ads", status: "qualified" },
  { name: "Rohan Shah", detail: "JEE foundation", branch: "north", source: "Walk-in", status: "pending" },
  { name: "Sara Khan", detail: "CBSE board", branch: "online", source: "Website", status: "qualified" },
  { name: "Ishaan Patil", detail: "CET crash", branch: "main", source: "Google Search", status: "paid" },
  { name: "Meera Joshi", detail: "NEET repeat", branch: "north", source: "WhatsApp", status: "pending" },
  { name: "Kabir Rao", detail: "Foundation", branch: "online", source: "Referral", status: "qualified" },
];

const admissionRows = [
  { name: "Aarav Deshmukh", detail: "NEET two-year", branch: "main", source: "Offer", status: "pending" },
  { name: "Diya Nair", detail: "NEET repeat", branch: "north", source: "Offer", status: "qualified" },
  { name: "Vivaan Kulkarni", detail: "Foundation", branch: "online", source: "Enrolled", status: "paid" },
  { name: "Ananya Iyer", detail: "JEE advanced", branch: "main", source: "Offer", status: "qualified" },
  { name: "Rehan Shaikh", detail: "CET crash", branch: "north", source: "Waitlist", status: "pending" },
  { name: "Saanvi Bhat", detail: "CBSE board", branch: "online", source: "Enrolled", status: "paid" },
];

const recordRows = [
  { name: "Aarav Deshmukh", detail: "ID card", branch: "main", source: "", status: "issued" },
  { name: "Diya Nair", detail: "Attendance", branch: "north", source: "", status: "verified" },
  { name: "Vivaan Kulkarni", detail: "Term report", branch: "online", source: "", status: "issued" },
  { name: "Ananya Iyer", detail: "Transfer certificate", branch: "main", source: "", status: "pending" },
  { name: "Rehan Shaikh", detail: "Attendance", branch: "north", source: "", status: "verified" },
  { name: "Saanvi Bhat", detail: "ID card", branch: "online", source: "", status: "issued" },
];

const tables = {
  enquiries: { rows: enquiryRows, caption: "Recent enquiries", columns: ["Contact", "Interest", "Source", "Stage"] },
  admissions: { rows: admissionRows, caption: "Admissions pipeline", columns: ["Applicant", "Course", "Branch", "Stage"] },
  records: { rows: recordRows, caption: "Recent records", columns: ["Student", "Record", "Branch", "Status"] },
} as const;

const branchLabel: Record<string, string> = { main: "Main", north: "North", online: "Online" };
const statusColors = {
  qualified: DESIGN_COLORS.primary.main,
  paid: DESIGN_COLORS.secondary.main,
  pending: DESIGN_COLORS.accent.orange,
  issued: DESIGN_COLORS.primary.main,
  verified: DESIGN_COLORS.secondary.main,
};

export default function PremiumCommandCenterV2() {
  const [view, setView] = useState<ViewId>("enquiries");
  const [branch, setBranch] = useState<BranchId>("all");
  const baseId = useId();
  const data = branchData[branch];
  const current = tables[view];
  const viewConfig = views.find(v => v.id === view)!;

  const rows = current.rows.filter((row) => branch === "all" || row.branch === branch);
  const offers = Math.round(data.qualified * 0.78);
  const enrolled = Math.round(data.qualified * 0.46);
  const barSeed = { all: 3, main: 9, north: 15, online: 21 }[branch];

  const kpis: Record<ViewId, { label: string; value: string }[]> = {
    enquiries: [
      { label: "Enquiries", value: data.enquiries.toLocaleString("en-IN") },
      { label: "Qualified", value: data.qualified.toLocaleString("en-IN") },
      { label: "Qualified rate", value: `${Math.round((data.qualified / data.enquiries) * 100)}%` },
      { label: "Enrolled", value: enrolled.toLocaleString("en-IN") },
    ],
    admissions: [
      { label: "Applications", value: data.qualified.toLocaleString("en-IN") },
      { label: "Offers", value: offers.toLocaleString("en-IN") },
      { label: "Enrolled", value: enrolled.toLocaleString("en-IN") },
      { label: "Seat fill", value: `${data.fill}%` },
    ],
    records: [
      { label: "Documents issued", value: Math.round(data.qualified * 2.4).toLocaleString("en-IN") },
      { label: "Attendance logged", value: `${93 + (data.fill % 3)}%` },
      { label: "Active batches", value: Math.round(data.fill / 2).toLocaleString("en-IN") },
      { label: "Records complete", value: `${94 + (data.fill % 3)}%` },
    ],
  };

  // Three.js background
  const { canvasRef, context, performanceLevel } = useThreeCanvas("command-center-v2", { cameraZ: 55 });
  const particlesRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.Line[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const colorAttrRef = useRef<THREE.BufferAttribute | null>(null);
  const viewColorRef = useRef(new THREE.Color(viewConfig.color));

  useEffect(() => {
    if (!context) return;

    const { scene, camera, animate, stop } = context;
    const particleCount = getParticleCount("command", performanceLevel);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 70;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      velocities[i3] = (Math.random() - 0.5) * 0.015;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.015 + 0.008;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.015;

      sizes[i] = Math.random() * 0.8 + 0.3;
      phases[i] = Math.random() * Math.PI * 2;

      const color = new THREE.Color(viewConfig.color);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    geometryRef.current = geometry;

    const colorAttr = new THREE.BufferAttribute(colors, 3);
    colorAttrRef.current = colorAttr;

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    // Flow lines
    const lines: THREE.Line[] = [];
    for (let i = 0; i < 10; i++) {
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = new Float32Array(40 * 3);
      for (let j = 0; j < 40; j++) {
        linePositions[j * 3] = (Math.random() - 0.5) * 70;
        linePositions[j * 3 + 1] = (Math.random() - 0.5) * 50;
        linePositions[j * 3 + 2] = (Math.random() - 0.5) * 40;
      }
      lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      const lineMaterial = new THREE.LineBasicMaterial({
        color: viewConfig.color,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      lines.push(line);
    }
    linesRef.current = lines;

    const animateFn = () => {
      if (!particlesRef.current || !geometryRef.current || !colorAttrRef.current) return;

      // Update colors based on view
      const color = new THREE.Color(viewConfig.color);
      viewColorRef.current.lerp(color, 0.1);
      for (let i = 0; i < particleCount; i++) {
        colorAttrRef.current!.setXYZ(i, viewColorRef.current.r, viewColorRef.current.g, viewColorRef.current.b);
      }
      colorAttrRef.current!.needsUpdate = true;

      // Particles flow upward
      const positions = geometryRef.current.attributes.position.array as Float32Array;
      const velocities = geometryRef.current.attributes.velocity.array as Float32Array;
      const phases = geometryRef.current.attributes.phase.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1] + 0.008;
        positions[i3 + 2] += velocities[i3 + 2];

        // Subtle horizontal drift
        positions[i3] += Math.sin(performance.now() * 0.0005 + phases[i]) * 0.003;

        if (positions[i3 + 1] > 30) {
          positions[i3] = (Math.random() - 0.5) * 70;
          positions[i3 + 1] = -30;
          positions[i3 + 2] = (Math.random() - 0.5) * 40;
        }
      }
      geometryRef.current.attributes.position.needsUpdate = true;

      // Lines flow
      linesRef.current.forEach((line) => {
        const linePos = line.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j < 40; j++) {
          const j3 = j * 3;
          linePos[j3 + 1] += 0.015;
          if (linePos[j3 + 1] > 30) {
            linePos[j3] = (Math.random() - 0.5) * 70;
            linePos[j3 + 1] = -30;
            linePos[j3 + 2] = (Math.random() - 0.5) * 40;
          }
        }
        line.geometry.attributes.position.needsUpdate = true;
        // Update line color
        (line.material as THREE.LineBasicMaterial).color.lerp(new THREE.Color(viewConfig.color), 0.05);
      });
    };

    animate(animateFn);

    return () => {
      stop();
      geometry.dispose();
      (particles.material as THREE.Material).dispose();
      lines.forEach(l => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
    };
  }, [view, context, performanceLevel]);

  return (
    <motion.div 
      className="command-center-v2" 
      role="region" 
      aria-label="Illustrative institute command centre"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="command-bg">
        <canvas ref={canvasRef} className="command-canvas" aria-hidden="true" />
      </div>

      <div className="command-top">
        <div className="command-tabs" role="tablist" aria-label="Command centre views">
          {views.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={view === item.id}
              aria-controls={`${baseId}-panel`}
              className="command-tab"
              onClick={() => setView(item.id)}
              variants={MOTION_VARIANTS.button}
              style={{ borderColor: view === item.id ? item.color : "transparent" }}
              whileHover={{ scale: 1.02, borderColor: item.color }}
            >
              {item.label}
              <motion.span
                className="command-tab-indicator"
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: view === item.id ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ background: item.color }}
              />
            </motion.button>
          ))}
        </div>
        <div className="command-filters">
          <label htmlFor={`${baseId}-branch`} className="visually-hidden">Branch</label>
          <motion.select
            id={`${baseId}-branch`}
            className="command-select glass-morph"
            value={branch}
            onChange={(event) => setBranch(event.target.value as BranchId)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {branches.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </motion.select>
          <span className="command-note">FY 2026</span>
        </div>
      </div>

      <motion.div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${view}`}
        className="command-body"
        variants={MOTION_VARIANTS.card}
      >
        <motion.div 
          className="command-kpis" 
          variants={MOTION_VARIANTS.staggerContainer}
        >
          {kpis[view].map((kpi, i) => (
            <motion.div 
              key={kpi.label} 
              className="command-kpi glass-morph"
              variants={MOTION_VARIANTS.staggerItem}
              style={{ borderLeftColor: viewConfig.color }}
              {...INTERACTIONS.card}
            >
              <span className="kpi-label">{kpi.label}</span>
              <motion.span 
                className="kpi-value" 
                variants={MOTION_VARIANTS.staggerItem}
              >
                {kpi.value}
              </motion.span>
              <span className="kpi-spark" aria-hidden="true" />
            </motion.div>
          ))}
        </motion.div>

        <div className="command-split">
          <motion.div 
            className="command-panel glass-morph" 
            variants={MOTION_VARIANTS.card}
            {...INTERACTIONS.card}
          >
            <h3 className="panel-title">{view === "records" ? "Monthly records" : "Monthly intake"}</h3>
            <div className="command-bars" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => {
                const height = 38 + ((index * 17 + barSeed * 7) % 58);
                return (
                  <motion.span
                    key={index}
                    className="command-bar"
                    data-signal={index === 8 || index === 9}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15, 
                      delay: index * 0.04 
                    }}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            <div className="command-axis">
              <span>Apr</span><span>Jul</span><span>Oct</span><span>Jan</span><span>Mar</span>
            </div>
          </motion.div>

          <motion.div 
            className="command-panel glass-morph" 
            variants={MOTION_VARIANTS.card}
            {...INTERACTIONS.card}
          >
            <h3 className="panel-title">{rowCaption(view)}</h3>
            <div className="command-table-wrap">
              <table className="command-table">
                <thead>
                  <tr className="command-table-header-row">
                    {current.columns.map((column) => (
                      <th key={column} scope="col" className="command-table-header">
                        {column}
                        <span className="command-table-sort" aria-hidden="true" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((row, i) => (
                    <motion.tr 
                      key={row.name} 
                      className="command-table-row"
                      variants={MOTION_VARIANTS.staggerItem}
                      custom={{ delay: i * 0.05 }}
                      {...INTERACTIONS.card}
                    >
                      <td className="command-table-cell">{row.name}</td>
                      <td className="command-table-cell muted">{row.detail}</td>
                      <td className="command-table-cell muted">
                        {view === "enquiries" ? row.source : branchLabel[row.branch]}
                      </td>
                      <td className="command-table-cell">
                        <motion.span
                          className="command-status"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                          style={{ 
                            backgroundColor: `${statusColors[row.status as keyof typeof statusColors] || DESIGN_COLORS.primary.main}20`,
                            color: statusColors[row.status as keyof typeof statusColors] || DESIGN_COLORS.primary.main,
                            borderColor: statusColors[row.status as keyof typeof statusColors] || DESIGN_COLORS.primary.main,
                          }}
                        >
                          {stageLabel(view, row.status, row.source)}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <NectarlineTerminal />

      <motion.div 
        className="command-foot" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="command-note">Illustrative interface / sample figures</span>
        <span className="command-note">Not client data</span>
      </motion.div>
    </motion.div>
  );
}

function rowCaption(view: ViewId) {
  if (view === "records") return "Monthly records";
  if (view === "admissions") return "Pipeline";
  return "Monthly intake";
}

function stageLabel(view: ViewId, status: string, source: string) {
  if (view === "admissions") return source;
  if (view === "records") {
    if (status === "issued") return "Issued";
    if (status === "verified") return "Verified";
    return "Pending";
  }
  if (status === "qualified") return "Qualified";
  if (status === "paid") return "Paid";
  return "Pending";
}