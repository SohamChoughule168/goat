import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    checks: {
      database: { status: "ok", latency: 0 },
      cache: { status: "ok", latency: 0 },
      storage: { status: "ok", latency: 0 },
      external: { status: "ok", latency: 0 },
    },
  };

  // Simulate checks (replace with real checks)
  const start = Date.now();
  checks.checks.database.latency = Date.now() - start;
  checks.checks.cache.latency = Date.now() - start;
  checks.checks.storage.latency = Date.now() - start;
  checks.checks.external.latency = Date.now() - start;

  // Determine overall status
  const allOk = Object.values(checks.checks).every(c => c.status === "ok");
  checks.status = allOk ? "healthy" : "degraded";

  const statusCode = allOk ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}