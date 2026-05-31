import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Service role bypasses all RLS and allowlist restrictions
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || "";

export async function POST(req: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ data: [], error: "Missing env vars" });
    }

    const body = await req.json();
    const { table, select, filters, order, limit } = body;

    let url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select || "*")}`;

    if (filters) {
      for (const [col, val] of Object.entries(filters)) {
        url += `&${col}=eq.${encodeURIComponent(String(val))}`;
      }
    }
    if (order) {
      url += `&order=${order.col}.${order.asc === false ? "desc" : "asc"}`;
    }
    if (limit) url += `&limit=${limit}`;

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
      console.error("[db proxy] error:", res.status, text.slice(0, 200));
      return NextResponse.json({ data: [], error: text.slice(0, 200) });
    }

    const data = await res.json();
    return NextResponse.json({ data: Array.isArray(data) ? data : [] });
  } catch (e: any) {
    console.error("[db proxy] catch:", e.message);
    return NextResponse.json({ data: [], error: e.message });
  }
}
