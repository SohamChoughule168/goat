import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ["name", "email", "message"];
    for (const field of requiredFields) {
      if (!body[field] || typeof body[field] !== "string" || body[field].trim() === "") {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }
    
    // Sanitize inputs
    const sanitized = {
      name: body.name.trim().slice(0, 100),
      email: body.email.trim().toLowerCase().slice(0, 255),
      company: body.company?.trim().slice(0, 100) || "",
      budget: body.budget?.trim() || "",
      timeline: body.timeline?.trim() || "",
      message: body.message.trim().slice(0, 5000),
      tier: body.tier?.trim() || "",
      source: "contact-form",
    };
    
    // In production, this would:
    // 1. Save to database (PostgreSQL/Supabase)
    // 2. Send notification email (Resend/SendGrid)
    // 3. Create ticket in CRM (HubSpot/Linear)
    // 4. Send auto-reply to user
    // 5. Trigger Slack/Discord notification
    
    // For now, log and return success
    console.log("Contact form submission:", {
      ...sanitized,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
    });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! We'll respond within one business day.",
      reference: `IC-${Date.now().toString(36).toUpperCase()}`,
    });
    
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}