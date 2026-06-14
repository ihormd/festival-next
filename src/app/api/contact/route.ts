import { NextRequest, NextResponse } from "next/server";

const submissions = new Map<string, number[]>();
const LIMIT = 3;
const WINDOW = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const times = (submissions.get(ip) || []).filter(t => now - t < WINDOW);
  if (times.length >= LIMIT) {
    return NextResponse.json({ error: "Too many submissions. Try again in an hour." }, { status: 429 });
  }
  submissions.set(ip, [...times, now]);
  return NextResponse.json({ ok: true });
}
