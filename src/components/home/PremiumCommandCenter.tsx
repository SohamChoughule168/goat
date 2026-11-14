"use client";

import { useEffect, useId, useRef, useState } from "react";
import * as THREE from "three";
import { useThreeCanvas, getParticleCount } from "@/components/premium/ThreeProvider";

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

const views: { id: ViewId; label: string }[] = [
  { id: "enquiries", label: "Enquiries" },
  { id: "admissions", label: "Admissions" },
  { id: "records", label: "Records" },
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
  enquiries: {
    rows: enquiryRows,
    caption: "Recent enquiries",
    columns: ["Contact", "Interest", "Source", "Stage"],
  },
  admissions: {
    rows: admissionRows,
    caption: "Admissions pipeline",
    columns: ["Applicant", "Course", "Branch", "Stage"],
  },
  records: {
    rows: recordRows,
    caption: "Recent records",
    columns: ["Student", "Record", "Branch", "Status"],
  },
} as const;

const branchLabel: Record<string, string> = {
  main: "Main",
  north: "North",
  online: "Online",
};

const colorMap = {
  enquiries: new THREE.Color(0x14d896),
  admissions: new THREE.Color(0x3b82f6),
  records: new THREE.Color(0xd946ef),
};

export default function CommandCenter() {
  const [view, setView] = useState<ViewId>("enquiries");
  const [branch, setBranch] = useState<BranchId>("all");
  const baseId = useId();
  const data = branchData[branch];
  const current = tables[view];

  const rows = current.rows.filter(
    (row) => branch === "all" || row.branch === branch,
  );

  const offers = Math.round(data.qualified * 0.78);
  const enrolled = Math.round(data.qualified * 0.46);

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

  const barSeed = { all: 3, main: 9, north: 15, online: 21 }[branch];

  // Three.js background
  const { canvasRef, context, performanceLevel } = useThreeCanvas("command-center", { cameraZ: 50 });
  const particlesRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.Line[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const colorAttrRef = useRef<THREE.BufferAttribute | null>(null);

  useEffect(() => {
    if (!context) return;

    const { scene, camera, animate, stop } = context;
    const particleCount = getParticleCount("command", performanceLevel);

    // Data flow particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      sizes[i] = Math.random() * 0.6 + 0.2;
      const color = colorMap[view];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometryRef.current = geometry;

    const colorAttr = new THREE.BufferAttribute(colors, 3);
    colorAttrRef.current = colorAttr;

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    // Flow lines
    const lines: THREE.Line[] = [];
    for (let i = 0; i < 8; i++) {
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = new Float32Array(30 * 3);
      for (let j = 0; j < 30; j++) {
        linePositions[j * 3] = (Math.random() - 0.5) * 60;
        linePositions[j * 3 + 1] = (Math.random() - 0.5) * 40;
        linePositions[j * 3 + 2] = (Math.random() - 0.5) * 30;
      }
      lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      const lineMaterial = new THREE.LineBasicMaterial({
        color: colorMap[view],
        transparent: true,
        opacity: 0.1,
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
      const color = colorMap[view];
      for (let i = 0; i < particleCount; i++) {
        colorAttrRef.current!.setXYZ(i, color.r, color.g, color.b);
      }
      colorAttrRef.current!.needsUpdate = true;

      // Particles flow
      const positions = geometryRef.current!.attributes.position.array as Float32Array;
      const velocities = geometryRef.current!.attributes.velocity.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1] + 0.01;
        positions[i3 + 2] += velocities[i3 + 2];

        if (positions[i3 + 1] > 25) {
          positions[i3] = (Math.random() - 0.5) * 60;
          positions[i3 + 1] = -25;
          positions[i3 + 2] = (Math.random() - 0.5) * 30;
        }
      }
      geometryRef.current!.attributes.position.needsUpdate = true;

      // Lines flow
      linesRef.current.forEach((line) => {
        const linePos = line.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j < 30; j++) {
          const j3 = j * 3;
          linePos[j3 + 1] += 0.02;
          if (linePos[j3 + 1] > 25) {
            linePos[j3] = (Math.random() - 0.5) * 60;
            linePos[j3 + 1] = -25;
            linePos[j3 + 2] = (Math.random() - 0.5) * 30;
          }
        }
        line.geometry.attributes.position.needsUpdate = true;
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
    <div className="command-center-shell command-center-premium" role="region" aria-label="Illustrative institute command centre">
      <div className="command-bg">
        <canvas ref={canvasRef} className="command-canvas" aria-hidden="true" />
      </div>

      <div className="command-top command-top-premium">
        <div className="command-tabs command-tabs-premium" role="tablist" aria-label="Command centre views">
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={view === item.id}
              aria-controls={`${baseId}-panel`}
              className="command-tab command-tab-premium magnetic specular"
              onClick={() => setView(item.id)}
            >
              {item.label}
              <span className="command-tab-indicator" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="command-filters command-filters-premium">
          <label htmlFor={`${baseId}-branch`} className="visually-hidden">
            Branch
          </label>
          <select
            id={`${baseId}-branch`}
            className="command-select command-select-premium glass-liquid"
            value={branch}
            onChange={(event) => setBranch(event.target.value as BranchId)}
          >
            {branches.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <span className="command-note command-note-premium">FY 2026</span>
        </div>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${view}`}
        className="command-body command-body-premium"
      >
        <div className="command-kpis command-kpis-premium">
          {kpis[view].map((kpi) => (
            <div key={kpi.label} className="command-kpi command-kpi-premium magnetic specular glass-liquid">
              <span className="command-kpi-label">{kpi.label}</span>
              <span className="command-kpi-value command-kpi-value-premium">{kpi.value}</span>
              <span className="command-kpi-spark" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="command-split command-split-premium">
          <div className="command-panel command-panel-premium glass-liquid magnetic specular">
            <h3 className="command-panel-title">{view === "records" ? "Monthly records" : "Monthly intake"}</h3>
            <div className="command-bars command-bars-premium" aria-hidden="true">
              {Array.from({ length: 12 }, (_, index) => {
                const height = 38 + ((index * 17 + barSeed * 7) % 58);
                return (
                  <span
                    key={index}
                    className="command-bar command-bar-premium magnetic"
                    data-signal={index === 8 || index === 9}
                    style={{ height: `${height}%`, transitionDelay: `${index * 40}ms` }}
                  />
                );
              })}
            </div>
            <div className="command-axis command-axis-premium">
              <span>Apr</span>
              <span>Jul</span>
              <span>Oct</span>
              <span>Jan</span>
              <span>Mar</span>
            </div>
          </div>

          <div className="command-panel command-panel-premium glass-liquid magnetic specular">
            <h3 className="command-panel-title">{rowCaption(view)}</h3>
            <div className="command-table-wrap command-table-wrap-premium">
              <table className="command-table command-table-premium">
                <thead>
                  <tr className="command-table-header-row">
                    {current.columns.map((column) => (
                      <th key={column} scope="col" className="command-table-header magnetic specular">
                        {column}
                        <span className="command-table-sort" aria-hidden="true" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((row) => (
                    <tr key={row.name} className="command-table-row command-table-row-premium magnetic specular">
                      <td className="command-table-cell">{row.name}</td>
                      <td className="command-table-cell command-table-cell-muted" data-muted="true">{row.detail}</td>
                      <td className="command-table-cell command-table-cell-muted" data-muted="true">
                        {view === "enquiries" ? row.source : branchLabel[row.branch]}
                      </td>
                      <td className="command-table-cell">
                        <span
                          className="command-status command-status-premium"
                          data-status={stageTone(view, row.status, row.source)}
                        >
                          {stageLabel(view, row.status, row.source)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="command-foot command-foot-premium">
        <span className="command-note command-note-premium">Illustrative interface / sample figures</span>
        <span className="command-note command-note-premium">Not client data</span>
      </div>
    </div>
  );
}

function rowCaption(view: ViewId) {
  if (view === "records") return "Monthly records";
  if (view === "admissions") return "Pipeline";
  return "Monthly intake";
}

function statusLabel(status: string) {
  if (status === "qualified") return "Qualified";
  if (status === "paid") return "Paid";
  return "Pending";
}

function stageLabel(view: ViewId, status: string, source: string) {
  if (view === "admissions") return source;
  if (view === "records") {
    if (status === "issued") return "Issued";
    if (status === "verified") return "Verified";
    return "Pending";
  }
  return statusLabel(status);
}

function stageTone(view: ViewId, status: string, source: string) {
  if (view === "admissions") {
    if (source === "Enrolled") return "paid";
    if (source === "Offer") return "qualified";
    return "pending";
  }
  if (view === "records") {
    return status === "pending" ? "pending" : "qualified";
  }
  return status;
}