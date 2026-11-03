"use client";

import { useState, useEffect } from "react";

interface MetricCard {
  index: string;
  title: string;
  body: string;
}

const CLIENT_METRICS: MetricCard[] = [
  {
    index: "01",
    title: "Enquiries This Month",
    body: "1,248 enquiries received across all branches",
  },
  {
    index: "02",
    title: "Admissions Converted",
    body: "412 students admitted this month",
  },
  {
    index: "03",
    title: "Student Records",
    body: "2,847 student records digitized",
  },
  {
    index: "04",
    title: "Active Batches",
    body: "84 active batches running",
  },
];

export default function ClientPortalDashboard() {
  return (
    <section className="inst-section client-portal-section" aria-labelledby="client-portal">
      <div className="inst-shell">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="inst-label client-portal-label-reveal">Client Portal</p>
            <h2 className="inst-h2 mt-5 max-w-[40ch] headline-reveal">
              Your Institution,<br />
              <span className="inst-serif">Real-Time Dashboard.</span>
            </h2>
            <p className="inst-lede client-portal-lede-reveal max-w-[44ch]">
              Track enrolments, admissions, and student records in real time.
            </p>
          </div>
        </div>

        <div className="metric-grid">
          {CLIENT_METRICS.map((metric, index) => (
            <article key={metric.index} className="metric-card">
              <span className="metric-index">{metric.index}</span>
              <h4 className="metric-title">{metric.title}</h4>
              <p className="metric-value">{metric.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
