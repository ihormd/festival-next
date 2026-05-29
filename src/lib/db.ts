// Server-side proxy — bypasses Supabase API Gateway allowlist
export async function dbQuery<T = any>(params: {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  order?: { col: string; asc?: boolean };
  limit?: number;
}): Promise<T[]> {
  try {
    const res = await fetch("/api/db", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      cache: "no-store",
    });
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}
