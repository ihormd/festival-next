import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { table, select, filters, order, limit } = await req.json();

    let url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select || "*")}`;

    if (filters) {
      for (const [col, val] of Object.entries(filters)) {
        url += `&${col}=eq.${encodeURIComponent(String(val))}`;
      }
    }
    if (order) url += `&order=${order.col}.${order.asc === false ? "desc" : "asc"}`;
    if (limit) url += `&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text, data: [] }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, data: [] }, { status: 200 });
  }
}
