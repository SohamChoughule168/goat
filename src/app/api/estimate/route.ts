import { NextRequest, NextResponse } from "next/server";

const TIER_BASE_PRICES = {
  launch: { monthly: 8000, yearly: 6500 },
  scale: { monthly: 18000, yearly: 15000 },
  enterprise: { monthly: 45000, yearly: 38000 },
};

const ADDON_PRICES = {
  "ai-chat": 3000,
  "rag": 5000,
  "personalization": 4000,
  "analytics": 2000,
  "ab-testing": 3000,
  "sso": 2000,
  "multi-region": 8000,
  "compliance": 5000,
  "dedicated-infra": 15000,
  "on-premise": 20000,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.tier || !TIER_BASE_PRICES[body.tier as keyof typeof TIER_BASE_PRICES]) {
      return NextResponse.json(
        { success: false, error: "Invalid tier selected" },
        { status: 400 }
      );
    }
    
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Valid email required" },
        { status: 400 }
      );
    }
    
    const tier = body.tier as keyof typeof TIER_BASE_PRICES;
    const billing = body.billing === "monthly" ? "monthly" : "yearly";
    const basePrice = TIER_BASE_PRICES[tier][billing];
    
    const addons = body.addons || [];
    let addonTotal = 0;
    const addonDetails = [];
    
    for (const addon of addons) {
      if (ADDON_PRICES[addon as keyof typeof ADDON_PRICES]) {
        const price = ADDON_PRICES[addon as keyof typeof ADDON_PRICES];
        addonTotal += price;
        addonDetails.push({ name: addon, price });
      }
    }
    
    const subtotal = basePrice + addonTotal;
    const discount = billing === "yearly" ? Math.round(subtotal * 0.18) : 0;
    const total = subtotal - discount;
    
    const estimate = {
      tier,
      billing,
      basePrice,
      addons: addonDetails,
      addonTotal,
      subtotal,
      discount,
      total,
      currency: "INR",
      validFor: "30 days",
      generatedAt: new Date().toISOString(),
      reference: `EST-${Date.now().toString(36).toUpperCase()}`,
    };
    
    // In production, this would:
    // 1. Save estimate to database
    // 2. Send PDF estimate via email
    // 3. Create lead in CRM
    // 4. Schedule follow-up task
    
    console.log("Estimate generated:", estimate);
    
    return NextResponse.json({
      success: true,
      estimate,
      message: "Estimate generated successfully. Check your email for details.",
    });
    
  } catch (err) {
    console.error("Estimate error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate estimate" },
      { status: 500 }
    );
  }
}