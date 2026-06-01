"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { refreshSiteSettings, DEFAULTS } from "@/lib/site-content";
import { Upload, Trash2, Check, X, Pencil, Image as ImageIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";

// ─── Keyed site images — every slot that appears on the site ───────────────
const SITE_SLOTS: { key: string; label: string; hint: string; bucket: string }[] = [
  { key: "hero_image_url",           label: "Hero background",        hint: "Main banner on the homepage",                     bucket: "site-images" },
  { key: "logo_url",                 label: "NUFF Logo",               hint: "Shown in Header and Footer",                      bucket: "site-images" },
  { key: "vendor_map_image_url",     label: "Vendor map",              hint: "Interactive map background on the Vendors page",  bucket: "site-images" },
  { key: "pillar_food_image_url",    label: "Pillar — Food",           hint: "Card image on the homepage pillars section",      bucket: "site-images" },
  { key: "pillar_music_image_url",   label: "Pillar — Music",          hint: "Card image on the homepage pillars section",      bucket: "site-images" },
  { key: "pillar_culture_image_url", label: "Pillar — Culture",        hint: "Card image on the homepage pillars section",      bucket: "site-images" },
  { key: "pillar_family_image_url",  label: "Pillar — Family",         hint: "Card image on the homepage pillars section",      bucket: "site-images" },
  { key: "entertainment_stage_url",  label: "Entertainment — stage",   hint: "Photo on the Entertainment page",                 bucket: "site-images" },
  { key: "entertainment_culture_url",label: "Entertainment — culture", hint: "Photo on the Entertainment CTA section",         bucket: "site-images" },
  { key: "about_hero_url",           label: "About — hero photo",      hint: "Optional photo on the About page",               bucket: "site-images" },
];

// ─── Gallery buckets — free-form photo collections ───────────────────────
const GALLERIES = [
  { id: "festival-memories", label: "Past festivals gallery", hint: "Masonry gallery on the Festival page — add, remove freely" },
  { id: "team-photos",       label: "Board of Directors",     hint: "Portrait photos for team members" },
  { id: "merch-images",      label: "Merch products",         hint: "Product images for the store" },
  { id: "sponsor-logos",     label: "Sponsor logos",          hint: "Logos shown on the Partners strip and Sponsors page" },
];

const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

async function uploadToBucket(bucket: string, file: File): Promise<string | null> {
  const path = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) { toast.error(error.message); return null; }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

async function listBucket(bucket: string) {
  const { data } = await supabase.storage.from(bucket).list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  return (data ?? []).filter(f => f.name !== ".emptyFolderPlaceholder").map(f => {
    const { data: u } = supabase.storage.from(bucket).getPublicUrl(f.name);
    return { name: f.name, url: u.publicUrl };
  });
}

// ─── Single slot editor ───────────────────────────────────────────────────
function SlotCard({ slot, currentUrl, onSaved }: { slot: typeof SITE_SLOTS[0]; currentUrl: string; onSaved: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [editing, setEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setUrlInput(currentUrl); }, [currentUrl]);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    const url = await uploadToBucket(slot.bucket, f);
    if (url) { await saveUrl(url); }
    setUploading(false);
    e.target.value = "";
  };

  const saveUrl = async (url: string) => {
    const { error } = await supabase.from("site_settings").upsert({ key: slot.key, value: url }, { onConflict: "key" });
    if (error) { toast.error(error.message); return; }
    await refreshSiteSettings();
    onSaved(url);
    setEditing(false);
    toast.success(`${slot.label} updated!`);
  };

  const clear = async () => {
    if (!confirm(`Remove ${slot.label}?`)) return;
    await supabase.from("site_settings").upsert({ key: slot.key, value: "" }, { onConflict: "key" });
    await refreshSiteSettings();
    onSaved("");
    setUrlInput("");
    toast.success("Removed.");
  };

  const preview = urlInput || currentUrl;

  return (
    <div style={{ borderRadius: "0.875rem", border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden" }}>
      {/* Preview */}
      <div style={{ position: "relative", aspectRatio: "16/9", background: "var(--muted)", overflow: "hidden" }}>
        {preview ? (
          <img src={preview} alt={slot.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => (e.currentTarget.style.display = "none")} />
        ) : (
          <div style={{ height: "100%", display: "grid", placeItems: "center", flexDirection: "column", gap: "0.5rem" }}>
            <ImageIcon size={32} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.5rem" }}>No image</p>
          </div>
        )}
        {/* Overlay actions */}
        <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", display: "flex", gap: "0.375rem" }}>
          <label title="Upload new image" style={{ width: 32, height: 32, borderRadius: "0.375rem", background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", cursor: "pointer" }}>
            {uploading ? <RefreshCw size={14} style={{ color: "white", animation: "spin 1s linear infinite" }} /> : <Upload size={14} style={{ color: "white" }} />}
            <input ref={fileRef} type="file" accept="image/*" onChange={uploadFile} style={{ display: "none" }} />
          </label>
          <button title="Paste URL" onClick={() => setEditing(!editing)} style={{ width: 32, height: 32, borderRadius: "0.375rem", background: editing ? "var(--primary)" : "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}>
            <Pencil size={14} style={{ color: "white" }} />
          </button>
          {preview && <button title="Remove" onClick={clear} style={{ width: 32, height: 32, borderRadius: "0.375rem", background: "rgba(180,0,0,0.75)", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}>
            <Trash2 size={14} style={{ color: "white" }} />
          </button>}
        </div>
      </div>

      {/* Info + URL editor */}
      <div style={{ padding: "0.75rem 1rem" }}>
        <div style={{ fontWeight: 600, fontSize: "0.9rem", fontFamily: "Montserrat, sans-serif" }}>{slot.label}</div>
        <div style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", marginTop: "0.125rem" }}>{slot.hint}</div>
        {editing && (
          <div style={{ marginTop: "0.625rem", display: "flex", gap: "0.375rem" }}>
            <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://…"
              style={{ flex: 1, padding: "0.375rem 0.625rem", borderRadius: "0.375rem", border: "1px solid var(--border)", fontSize: "0.75rem", fontFamily: "inherit", outline: "none", background: "var(--input)" }} />
            <button onClick={() => saveUrl(urlInput)} style={{ padding: "0.375rem 0.625rem", borderRadius: "0.375rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Save</button>
            <button onClick={() => setEditing(false)} style={{ padding: "0.375rem", borderRadius: "0.375rem", background: "var(--muted)", border: "none", cursor: "pointer" }}><X size={14} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Gallery manager ──────────────────────────────────────────────────────
function GalleryManager({ gallery }: { gallery: typeof GALLERIES[0] }) {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    setFiles(await listBucket(gallery.id));
    setLoading(false);
  };
  useEffect(() => { load(); }, [gallery.id]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files ?? []); if (!fs.length) return;
    setUploading(true);
    for (const f of fs) { await uploadToBucket(gallery.id, f); }
    e.target.value = "";
    setUploading(false);
    await load();
    toast.success(`${fs.length} photo(s) uploaded`);
  };

  const remove = async (name: string) => {
    if (!confirm(`Delete this photo?`)) return;
    await supabase.storage.from(gallery.id).remove([name]);
    setFiles(prev => prev.filter(f => f.name !== name));
    toast.success("Deleted.");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>{gallery.hint}</p>
        <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif", opacity: uploading ? 0.7 : 1 }}>
          <Upload size={15} /> {uploading ? "Uploading…" : "Upload photos"}
          <input type="file" multiple accept="image/*" onChange={upload} style={{ display: "none" }} />
        </label>
      </div>
      {loading ? (
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>Loading…</p>
      ) : files.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted-foreground)", borderRadius: "1rem", border: "2px dashed var(--border)" }}>
          <ImageIcon size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
          <p style={{ fontSize: "0.875rem" }}>No photos yet. Upload your first one above.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
          {files.map(f => (
            <div key={f.name} style={{ borderRadius: "0.625rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--muted)", position: "relative", aspectRatio: "1/1" }}>
              <img src={f.url} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={e => (e.currentTarget as any).style.background = "rgba(0,0,0,0.45)"}
                onMouseLeave={e => (e.currentTarget as any).style.background = "rgba(0,0,0,0)"}>
                <button onClick={() => remove(f.name)} style={{ padding: "0.375rem", borderRadius: "0.375rem", background: "rgba(180,0,0,0.85)", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}>
                  <Trash2 size={16} style={{ color: "white" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────
export function MediaManager() {
  const [tab, setTab] = useState<"slots" | string>("slots");
  const [siteValues, setSiteValues] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("site_settings").select("key,value").then(({ data }) => {
      const map: Record<string, string> = { ...DEFAULTS };
      (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
      setSiteValues(map);
    });
  }, []);

  const allTabs = [
    { id: "slots", label: "Site images" },
    ...GALLERIES.map(g => ({ id: g.id, label: g.label })),
  ];

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
        {allTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "0.375rem 0.875rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: tab === t.id ? 700 : 400, fontFamily: "inherit", background: tab === t.id ? "var(--primary)" : "var(--muted)", color: tab === t.id ? "white" : "var(--foreground)", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Site image slots */}
      {tab === "slots" && (
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Site Images</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>Click <strong>↑</strong> to upload a new file, or <strong>✏</strong> to paste a URL. Changes apply immediately.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {SITE_SLOTS.map(slot => (
              <SlotCard key={slot.key} slot={slot} currentUrl={siteValues[slot.key] || ""}
                onSaved={url => setSiteValues(prev => ({ ...prev, [slot.key]: url }))} />
            ))}
          </div>
        </div>
      )}

      {/* Gallery tabs */}
      {GALLERIES.map(g => tab === g.id && (
        <div key={g.id}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem", marginBottom: "1.5rem" }}>{g.label}</h2>
          <GalleryManager gallery={g} />
        </div>
      ))}
    </div>
  );
}
