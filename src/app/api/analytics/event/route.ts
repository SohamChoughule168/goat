import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.eventName || typeof body.eventName !== "string") {
      return NextResponse.json(
        { success: false, error: "eventName is required" },
        { status: 400 }
      );
    }
    
    // Validate event properties
    const allowedEvents = [
      "page_view",
      "scroll_depth",
      "cta_click",
      "form_submit",
      "form_start",
      "form_abandon",
      "download",
      "video_play",
      "video_complete",
      "pricing_view",
      "estimate_request",
      "contact_submit",
      "nav_click",
      "hero_cta_click",
      "work_filter",
      "testimonial_swipe",
      "team_card_hover",
      "process_step_view",
      "footer_cta_click",
      "3d_scene_load",
      "3d_scene_interaction",
      "performance_warning",
      "error",
    ];
    
    if (!allowedEvents.includes(body.eventName)) {
      return NextResponse.json(
        { success: false, error: "Invalid event name" },
        { status: 400 }
      );
    }
    
    // Extract and sanitize properties
    const event = {
      eventName: body.eventName,
      timestamp: body.timestamp || new Date().toISOString(),
      sessionId: body.sessionId || crypto.randomUUID(),
      userId: body.userId || null,
      properties: body.properties || {},
      context: {
        page: body.page || "",
        referrer: body.referrer || "",
        userAgent: request.headers.get("user-agent") || "",
        viewport: body.viewport || null,
        connection: body.connection || null,
      },
    };
    
    // In production, this would:
    // 1. Validate against schema (JSON Schema / Zod)
    // 2. Enrich with user/context data
    // 3. Send to analytics pipeline (PostHog, Mixpanel, Amplitude, custom)
    // 4. Store in data warehouse (BigQuery, Snowflake, ClickHouse)
    // 5. Trigger real-time alerts for key events
    
    console.log("Analytics event:", {
      ...event,
      receivedAt: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
    });
    
    return NextResponse.json({
      success: true,
      eventId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    });
    
  } catch (err) {
    console.error("Analytics event error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process event" },
      { status: 500 }
    );
  }
}