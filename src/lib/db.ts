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

// List public files from a storage bucket via server proxy (bypasses allowlist)
export async function listStorageBucket(bucket: string, limit = 50): Promise<{ name: string; url: string }[]> {
  try {
    const res = await fetch("/api/storage-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bucket, limit }),
      cache: "no-store",
    });
    const json = await res.json();
    return json.files ?? [];
  } catch {
    return [];
  }
}
