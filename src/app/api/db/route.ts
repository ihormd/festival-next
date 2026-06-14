import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || "";

// ⚠️ SECURITY: Only these tables can be read via public proxy
// Never add user_roles, auth.users, or any sensitive tables here
const ALLOWED_TABLES = new Set([
  "festival_schedule",
  "team_members",
  "sponsors",
  "merch_products",
  "site_settings",
  "vendor_spots",
  "volunteer_shifts",
  "performers",
]);

// Tables that require authentication
const AUTH_REQUIRED_TABLES = new Set([
  "vendor_applications",
  "artist_applications",
  "volunteer_applications",
  "contact_messages",
  "sponsorship_inquiries",
  "vendor_bookings",
  "user_roles",
]);

export async function POST(req: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ data: [], error: "Missing env vars" });
    }

    const body = await req.json();
    const { table, select, filters, order, limit } = body;

    // Security: reject unknown or sensitive tables
    if (!table || typeof table !== "string") {
      return NextResponse.json({ data: [], error: "Invalid table" }, { status: 400 });
    }

    if (AUTH_REQUIRED_TABLES.has(table)) {
      return NextResponse.json({ data: [], error: "Authentication required" }, { status: 401 });
    }

    if (!ALLOWED_TABLES.has(table)) {
      return NextResponse.json({ data: [], error: "Table not accessible" }, { status: 403 });
    }

    // Security: sanitize column names (only allow alphanumeric + underscore)
    const safeCol = (s: string) => /^[a-z_][a-z0-9_]*$/i.test(s) ? s : null;

    let url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select || "*")}`;

    if (filters && typeof filters === "object") {
      for (const [col, val] of Object.entries(filters)) {
        const safe = safeCol(col);
        if (safe) url += `&${safe}=eq.${encodeURIComponent(String(val))}`;
      }
    }

    if (order && safeCol(order.col)) {
      url += `&order=${order.col}.${order.asc === false ? "desc" : "asc"}`;
    }

    if (limit && typeof limit === "number" && limit > 0 && limit <= 500) {
      url += `&limit=${limit}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[db proxy] error:", res.status, text.slice(0, 100));
      return NextResponse.json({ data: [], error: "Database error" });
    }

    const data = await res.json();
    return NextResponse.json({ data: Array.isArray(data) ? data : [] });
  } catch (e: any) {
    console.error("[db proxy] catch:", e.message);
    return NextResponse.json({ data: [], error: "Server error" });
  }
}
