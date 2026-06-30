import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Security: only public, read-only buckets can be listed via this proxy
const ALLOWED_BUCKETS = new Set([
  "festival-memories",
  "team-photos",
  "merch-images",
  "sponsor-logos",
  "site-images",
]);

export async function POST(req: NextRequest) {
  try {
    const { bucket, limit } = await req.json();
    if (!bucket || !ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json({ files: [], error: "Bucket not accessible" }, { status: 403 });
    }

    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${bucket}`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit: Math.min(limit || 50, 200),
        sortBy: { column: "created_at", order: "desc" },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ files: [], error: "Storage error" });
    }

    const data = await res.json();
    const files = (data ?? [])
      .filter((f: any) => f.name !== ".emptyFolderPlaceholder")
      .map((f: any) => ({
        name: f.name,
        url: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${f.name}`,
      }));

    return NextResponse.json({ files });
  } catch (e: any) {
    return NextResponse.json({ files: [], error: e.message });
  }
}
