"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, Trash2, Copy, Check, Image } from "lucide-react";

type MediaFile = { name: string; url: string; bucket: string; };

const BUCKETS = [
  { id: "site-images", label: "Site images", hint: "Hero, pillar cards, festival photos" },
  { id: "festival-memories", label: "Past festivals (gallery)", hint: "Photos shown in the masonry gallery on the Festival page" },
  { id: "team-photos", label: "Team / Board photos", hint: "Board member portraits" },
  { id: "merch-images", label: "Merch product images", hint: "Product photos for the store" },
  { id: "sponsor-logos", label: "Sponsor logos", hint: "Used on Partners strip and Sponsors page" },
];

const inp: React.CSSProperties = { display: "none" };

export function MediaManager() {
  const [bucket, setBucket] = useState(BUCKETS[0].id);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = async (b: string) => {
    setLoading(true);
    const { data } = await supabase.storage.from(b).list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (data) {
      const withUrls = data.filter(f => f.name !== ".emptyFolderPlaceholder").map(f => {
        const { data: u } = supabase.storage.from(b).getPublicUrl(f.name);
        return { name: f.name, url: u.publicUrl, bucket: b };
      });
      setFiles(withUrls);
    }
    setLoading(false);
  };

  useEffect(() => { load(bucket); }, [bucket]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files ?? []);
    if (!fs.length) return;
    setUploading(true);
    for (const f of fs) {
      const path = `${Date.now()}-${f.name.replace(/\s+/g, "_")}`;
      await supabase.storage.from(bucket).upload(path, f, { upsert: true });
    }
    e.target.value = "";
    setUploading(false);
    await load(bucket);
  };

  const remove = async (name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await supabase.storage.from(bucket).remove([name]);
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      {/* Bucket tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
        {BUCKETS.map(b => (
          <button key={b.id} onClick={() => setBucket(b.id)}
            style={{ padding: "0.375rem 0.875rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: bucket === b.id ? 700 : 400, fontFamily: "inherit", background: bucket === b.id ? "var(--primary)" : "var(--muted)", color: bucket === b.id ? "white" : "var(--foreground)", transition: "all 0.15s" }}>
            {b.label}
          </button>
        ))}
      </div>

      {/* Hint + upload */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{BUCKETS.find(b => b.id === bucket)?.hint}</p>
        <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif", opacity: uploading ? 0.7 : 1 }}>
          <Upload size={15} /> {uploading ? "Uploading…" : "Upload images"}
          <input type="file" multiple accept="image/*,video/*" onChange={upload} style={inp} />
        </label>
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>Loading…</p>
      ) : files.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--muted-foreground)" }}>
          <Image size={40} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
          <p style={{ fontSize: "0.875rem" }}>No files yet. Upload your first image above.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
          {files.map(f => (
            <div key={f.name} style={{ borderRadius: "0.75rem", border: "1px solid var(--border)", overflow: "hidden", background: "var(--card)", position: "relative" }}>
              <div style={{ aspectRatio: "1/1", background: "var(--muted)", overflow: "hidden" }}>
                <img src={f.url} alt={f.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                  onMouseEnter={e => (e.currentTarget as any).style.transform = "scale(1.05)"}
                  onMouseLeave={e => (e.currentTarget as any).style.transform = "scale(1)"}
                  onError={e => { (e.currentTarget as any).style.display = "none"; }} />
              </div>
              <div style={{ padding: "0.5rem 0.625rem" }}>
                <p style={{ fontSize: "0.65rem", color: "var(--muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "0.375rem" }}>{f.name}</p>
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  <button onClick={() => copy(f.url)} title="Copy URL"
                    style={{ flex: 1, padding: "0.25rem", borderRadius: "0.375rem", border: "1px solid var(--border)", background: "none", cursor: "pointer", display: "grid", placeItems: "center", color: copied === f.url ? "#16a34a" : "var(--muted-foreground)" }}>
                    {copied === f.url ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                  <button onClick={() => remove(f.name)} title="Delete"
                    style={{ flex: 1, padding: "0.25rem", borderRadius: "0.375rem", border: "1px solid var(--border)", background: "none", cursor: "pointer", display: "grid", placeItems: "center", color: "#ef4444" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
