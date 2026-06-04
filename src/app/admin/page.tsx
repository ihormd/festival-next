"use client";
import { useAuth } from "@/context/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { refreshSiteSettings, DEFAULTS } from "@/lib/site-content";
import { Save, Users, Store, Mic2, HandHeart, MessageSquare, Settings, Layout, AlignLeft, ShoppingBag, UserCircle, Globe, Star, ImageIcon } from "lucide-react";
import { MediaManager } from "./MediaManager";
import { toast } from "sonner";

type Tab = "settings" | "header" | "footer" | "about" | "entertainment" | "home_extra" | "vendors_tab" | "artists_tab" | "volunteers_tab" | "messages" | "merch" | "team" | "sponsors_list" | "media";

const inp: React.CSSProperties = { width: "100%", padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--input)", fontSize: "0.875rem", fontFamily: "inherit", outline: "none" };

// ─────────────────────────────────────────
// Generic settings editor
// ─────────────────────────────────────────
const FIELDS: Record<Tab, { key: string; label: string; multiline?: boolean }[]> = {
  settings: [
    { key: "festival_name", label: "Festival name" },
    { key: "festival_short_name", label: "Short name" },
    { key: "festival_dates", label: "Festival dates" },
    { key: "festival_year", label: "Year" },
    { key: "location_name", label: "Venue name" },
    { key: "location_address", label: "Venue address" },
    { key: "hero_tagline", label: "Hero tagline" },
    { key: "hero_subtitle", label: "Hero subtitle", multiline: true },
    { key: "contact_email", label: "Contact email" },
    { key: "contact_phone", label: "Contact phone" },
    { key: "home_hero_cta_primary", label: "Hero CTA — primary" },
    { key: "home_hero_cta_secondary", label: "Hero CTA — secondary" },
    { key: "seo_title", label: "SEO title" },
    { key: "seo_description", label: "SEO description", multiline: true },
    { key: "google_maps_embed", label: "Google Maps embed URL" },
    { key: "hero_image_url", label: "🖼 Hero background image URL" },
    { key: "pillar_food_image_url", label: "🖼 Pillar: Food image URL" },
    { key: "pillar_music_image_url", label: "🖼 Pillar: Music image URL" },
    { key: "pillar_culture_image_url", label: "🖼 Pillar: Culture image URL" },
    { key: "pillar_family_image_url", label: "🖼 Pillar: Family image URL" },
  ],
  header: [
    { key: "header_nav_festival", label: "Nav: Festival" },
    { key: "header_nav_entertainment", label: "Nav: Entertainment" },
    { key: "header_nav_merch", label: "Nav: Merch" },
    { key: "header_nav_about", label: "Nav: About" },
    { key: "header_nav_contact", label: "Nav: Contact" },
    { key: "header_nav_involved_label", label: "Dropdown button label" },
    { key: "header_nav_artists_label", label: "Dropdown: Artists label" },
    { key: "header_nav_artists_desc", label: "Dropdown: Artists desc" },
    { key: "header_nav_vendors_label", label: "Dropdown: Vendors label" },
    { key: "header_nav_vendors_desc", label: "Dropdown: Vendors desc" },
    { key: "header_nav_volunteers_label", label: "Dropdown: Volunteers label" },
    { key: "header_nav_volunteers_desc", label: "Dropdown: Volunteers desc" },
    { key: "header_nav_sponsors_label", label: "Dropdown: Sponsors label" },
    { key: "header_nav_sponsors_desc", label: "Dropdown: Sponsors desc" },
  ],
  footer: [
    { key: "footer_tagline", label: "Footer tagline", multiline: true },
    { key: "footer_col1_title", label: "Column 1 title" },
    { key: "footer_col2_title", label: "Column 2 title" },
    { key: "footer_copyright", label: "Copyright text" },
    { key: "footer_contact_display", label: "Contact/region line" },
  ],
  about: [
    { key: "about_eyebrow", label: "Eyebrow text" },
    { key: "about_title", label: "Page title" },
    { key: "about_subtitle", label: "Page subtitle", multiline: true },
    { key: "about_mission_heading", label: "Mission heading" },
    { key: "about_mission", label: "Mission body", multiline: true },
    { key: "about_history_heading", label: "History heading" },
    { key: "about_history", label: "History body", multiline: true },
  ],
  entertainment: [
    { key: "entertainment_eyebrow", label: "Eyebrow" },
    { key: "entertainment_title", label: "Page title" },
    { key: "entertainment_subtitle", label: "Page subtitle", multiline: true },
    { key: "entertainment_schedule_title", label: "Schedule section title" },
    { key: "entertainment_cta_title", label: "CTA title" },
    { key: "entertainment_cta_body", label: "CTA body", multiline: true },
  ],
  home_extra: [
    { key: "home_pillars_eyebrow", label: "Pillars eyebrow" },
    { key: "home_pillars_heading", label: "Pillars heading" },
    { key: "home_pillar_food_title", label: "Pillar: Food title" },
    { key: "home_pillar_food_body", label: "Pillar: Food body" },
    { key: "home_pillar_music_title", label: "Pillar: Music title" },
    { key: "home_pillar_music_body", label: "Pillar: Music body" },
    { key: "home_pillar_culture_title", label: "Pillar: Culture title" },
    { key: "home_pillar_culture_body", label: "Pillar: Culture body" },
    { key: "home_pillar_family_title", label: "Pillar: Family title" },
    { key: "home_pillar_family_body", label: "Pillar: Family body" },
    { key: "home_involved_eyebrow", label: "Get Involved eyebrow" },
    { key: "home_involved_heading", label: "Get Involved heading" },
    { key: "home_involved_vendors_title", label: "Vendors card title" },
    { key: "home_involved_vendors_body", label: "Vendors card body" },
    { key: "home_involved_artists_title", label: "Artists card title" },
    { key: "home_involved_artists_body", label: "Artists card body" },
    { key: "home_involved_volunteers_title", label: "Volunteers card title" },
    { key: "home_involved_volunteers_body", label: "Volunteers card body" },
    { key: "home_involved_sponsors_title", label: "Sponsors card title" },
    { key: "home_involved_sponsors_body", label: "Sponsors card body" },
    { key: "home_stat_1_value", label: "Stat 1 value" }, { key: "home_stat_1_label", label: "Stat 1 label" },
    { key: "home_stat_2_value", label: "Stat 2 value" }, { key: "home_stat_2_label", label: "Stat 2 label" },
    { key: "home_stat_3_value", label: "Stat 3 value" }, { key: "home_stat_3_label", label: "Stat 3 label" },
    { key: "home_stat_4_value", label: "Stat 4 value" }, { key: "home_stat_4_label", label: "Stat 4 label" },
  ],
  vendors_tab: [], artists_tab: [], volunteers_tab: [], messages: [], merch: [], team: [], sponsors_list: [], media: [],
};

function SettingsEditor({ tab }: { tab: Tab }) {
  const fields = FIELDS[tab];
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("key,value").then(({ data }) => {
      const map: Record<string, string> = { ...DEFAULTS };
      (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
      setValues(map);
    });
  }, [tab]);

  const save = async () => {
    setSaving(true);
    const rows = fields.map(f => ({ key: f.key, value: values[f.key] ?? "" }));
    await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    await refreshSiteSettings();
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 640 }}>
      {fields.map(f => (
        <div key={f.key}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: "0.375rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
          {f.multiline
            ? <textarea value={values[f.key] ?? ""} onChange={e => setValues({ ...values, [f.key]: e.target.value })} rows={3} style={{ ...inp, resize: "vertical" }} />
            : <input value={values[f.key] ?? ""} onChange={e => setValues({ ...values, [f.key]: e.target.value })} style={inp} />}
        </div>
      ))}
      <button onClick={save} disabled={saving} style={{ alignSelf: "flex-start", padding: "0.5rem 1.5rem", borderRadius: "0.5rem", background: saved ? "#166534" : "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "background 0.3s" }}>
        <Save size={15} /> {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// Application lists
// ─────────────────────────────────────────
function AppList({ table, titleField }: { table: string; titleField: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  useEffect(() => { supabase.from(table).select("*").order("created_at", { ascending: false }).limit(100).then(({ data }) => setItems(data ?? [])); }, [table]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await supabase.from(table).update({ status }).eq("id", id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    setUpdating(null);
  };

  if (!items.length) return <p style={{ color: "var(--muted-foreground)", padding: "2rem 0", fontSize: "0.875rem" }}>No applications yet.</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
      {items.map(item => (
        <div key={item.id} style={{ padding: "1rem 1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{item[titleField]}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.125rem" }}>
                {item.contact_email || item.email} · {new Date(item.created_at).toLocaleDateString()}
                {item.contact_phone && ` · ${item.contact_phone}`}
              </div>
              {item.description && <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.375rem", lineHeight: 1.5 }}>{item.description.slice(0, 200)}{item.description.length > 200 ? "…" : ""}</p>}
            </div>
            <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
              {["pending", "approved", "rejected"].map(s => (
                <button key={s} onClick={() => updateStatus(item.id, s)} disabled={updating === item.id || item.status === s}
                  style={{ padding: "0.25rem 0.625rem", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 600, border: "none", cursor: item.status === s ? "default" : "pointer", textTransform: "capitalize", background: item.status === s ? (s === "approved" ? "#166534" : s === "rejected" ? "#991b1b" : "#854d0e") : "var(--muted)", color: item.status === s ? "white" : "var(--muted-foreground)", transition: "all 0.15s" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Messages
// ─────────────────────────────────────────
function MessagesList() {
  const [msgs, setMsgs] = useState<any[]>([]);
  useEffect(() => { supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(100).then(({ data }) => setMsgs(data ?? [])); }, []);
  if (!msgs.length) return <p style={{ color: "var(--muted-foreground)", padding: "2rem 0", fontSize: "0.875rem" }}>No messages yet.</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
      {msgs.map(m => (
        <div key={m.id} style={{ padding: "1rem 1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>{m.name || m.full_name}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{new Date(m.created_at).toLocaleString()}</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--primary)", marginBottom: "0.375rem" }}>{m.email}</div>
          {m.subject && <div style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.25rem" }}>{m.subject}</div>}
          <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{m.message}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// Merch manager
// ─────────────────────────────────────────
function MerchManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price_cents: 0, stock: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => supabase.from("merch_products").select("*").order("created_at", { ascending: false }).then(({ data }) => setProducts(data ?? []));
  useEffect(() => { load(); }, []);

  const add = async () => {
    setAdding(true);
    let image_url: string | null = null;
    if (imageFile) {
      const path = `products/${Date.now()}-${imageFile.name}`;
      await supabase.storage.from("merch-images").upload(path, imageFile);
      const { data } = supabase.storage.from("merch-images").getPublicUrl(path);
      image_url = data.publicUrl;
    }
    await supabase.from("merch_products").insert({ ...form, image_url, active: true });
    setForm({ name: "", description: "", price_cents: 0, stock: 0 }); setImageFile(null); setShowForm(false);
    setAdding(false); load();
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("merch_products").update({ active }).eq("id", id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active } : p));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Merch Products</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem" }}>
          {showForm ? "Cancel" : "+ Add product"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: "2rem", padding: "1.5rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)", display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 560 }}>
          <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>New product</h3>
          {[{ key: "name", label: "Name *" }, { key: "description", label: "Description" }].map(f => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inp} />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Price (cents) *</label>
              <input type="number" value={form.price_cents} onChange={e => setForm({ ...form, price_cents: parseInt(e.target.value) })} style={inp} />
              <p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", marginTop: "0.2rem" }}>e.g. 2500 = $25.00</p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })} style={inp} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Product image</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} style={inp} />
          </div>
          <button onClick={add} disabled={adding || !form.name} style={{ padding: "0.625rem 1.5rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", alignSelf: "flex-start", opacity: adding ? 0.7 : 1 }}>
            {adding ? "Adding…" : "Add product"}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {products.map(p => (
          <div key={p.id} style={{ borderRadius: "0.875rem", border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden", opacity: p.active ? 1 : 0.5 }}>
            {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }} />}
            <div style={{ padding: "0.875rem" }}>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{p.name}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 700, marginTop: "0.25rem" }}>${(p.price_cents / 100).toFixed(2)}</div>
              {p.description && <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>{p.description.slice(0, 80)}</p>}
              <button onClick={() => toggle(p.id, !p.active)} style={{ marginTop: "0.75rem", width: "100%", padding: "0.375rem", borderRadius: "0.375rem", border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: p.active ? "var(--destructive)" : "var(--primary)" }}>
                {p.active ? "Hide from store" : "Show in store"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Team manager
// ─────────────────────────────────────────
function TeamManager() {
  const [members, setMembers] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", bio: "", sort_order: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => supabase.from("team_members").select("*").order("sort_order").then(({ data }) => setMembers(data ?? []));
  useEffect(() => { load(); }, []);

  const startAdd = () => { setEditId(null); setForm({ name: "", role: "", bio: "", sort_order: members.length }); setImageFile(null); setShowForm(true); };
  const startEdit = (m: any) => { setEditId(m.id); setForm({ name: m.name, role: m.role, bio: m.bio || "", sort_order: m.sort_order || 0 }); setImageFile(null); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditId(null); };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!imageFile) return null;
    const path = `${Date.now()}-${imageFile.name.replace(/\s+/g, "_")}`;
    const { error } = await supabase.storage.from("team-photos").upload(path, imageFile, { upsert: true });
    if (error) { toast.error(error.message); return null; }
    const { data } = supabase.storage.from("team-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const save = async () => {
    if (!form.name || !form.role) { toast.error("Name and role are required."); return; }
    setSaving(true);
    const image_url = await uploadPhoto();
    if (editId) {
      const update: any = { name: form.name, role: form.role, bio: form.bio, sort_order: form.sort_order };
      if (image_url) update.image_url = image_url;
      const { error } = await supabase.from("team_members").update(update).eq("id", editId);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Member updated!");
    } else {
      const { error } = await supabase.from("team_members").insert({ ...form, image_url: image_url || null, active: true });
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Member added!");
    }
    setSaving(false); cancel(); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this member?")) return;
    await supabase.from("team_members").update({ active: false }).eq("id", id);
    toast.success("Removed.");
    load();
  };

  const active = members.filter(m => m.active);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Board of Directors</h2>
        <button onClick={showForm && !editId ? cancel : startAdd}
          style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", background: showForm && !editId ? "var(--muted)" : "var(--primary)", color: showForm && !editId ? "var(--foreground)" : "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem" }}>
          {showForm && !editId ? "Cancel" : "+ Add member"}
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div style={{ marginBottom: "2rem", padding: "1.5rem", borderRadius: "1rem", border: `2px solid ${editId ? "var(--primary)" : "var(--border)"}`, background: "var(--card)", display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 560 }}>
          <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1rem" }}>{editId ? "Edit member" : "New member"}</h3>
          {[{ key: "name", label: "Full name *", type: "text" }, { key: "role", label: "Title / Role *", type: "text" }].map(f => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inp} />
            </div>
          ))}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} style={{ ...inp, resize: "vertical" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Sort order</label>
            <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} style={{ ...inp, width: 100 }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>{editId ? "Replace photo (optional)" : "Photo"}</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} style={inp} />
            {imageFile && <p style={{ fontSize: "0.72rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>Selected: {imageFile.name}</p>}
          </div>
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <button onClick={save} disabled={saving} style={{ padding: "0.625rem 1.5rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : editId ? "Save changes" : "Add member"}
            </button>
            <button onClick={cancel} style={{ padding: "0.625rem 1rem", borderRadius: "0.5rem", background: "var(--muted)", color: "var(--foreground)", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Members grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
        {active.map(m => (
          <div key={m.id} style={{ borderRadius: "0.875rem", border: `2px solid ${editId === m.id ? "var(--primary)" : "var(--border)"}`, background: "var(--card)", overflow: "hidden", transition: "border-color 0.15s" }}>
            {/* Photo */}
            <div style={{ aspectRatio: "1/1", background: "var(--muted)", overflow: "hidden", position: "relative" }}>
              {m.image_url
                ? <img src={m.image_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--primary), oklch(0.55 0.18 252))", color: "white", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "2.5rem" }}>
                    {m.name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
                  </div>}
            </div>
            {/* Info */}
            <div style={{ padding: "1rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", fontFamily: "Montserrat, sans-serif" }}>{m.name}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.125rem" }}>{m.role}</div>
              {m.bio && <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.375rem", lineHeight: 1.5 }}>{m.bio.slice(0, 100)}{m.bio.length > 100 ? "…" : ""}</p>}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                <button onClick={() => startEdit(m)}
                  style={{ flex: 1, padding: "0.375rem", borderRadius: "0.375rem", border: "1px solid var(--primary)", background: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, fontFamily: "inherit" }}>
                  Edit
                </button>
                <button onClick={() => remove(m.id)}
                  style={{ flex: 1, padding: "0.375rem", borderRadius: "0.375rem", border: "1px solid var(--border)", background: "none", color: "var(--destructive)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, fontFamily: "inherit" }}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        {active.length === 0 && <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>No team members yet.</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Sponsors list manager
// ─────────────────────────────────────────
function SponsorsManager() {
  const [list, setList] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", website_url: "", level: "bronze", sort_order: 0, logo_url: "" });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => supabase.from("sponsors").select("*").order("sort_order").then(({ data }) => setList(data ?? []));
  useEffect(() => { load(); }, []);

  const startAdd = () => { setEditId(null); setForm({ name: "", website_url: "", level: "bronze", sort_order: list.length, logo_url: "" }); setLogoFile(null); setShowForm(true); };
  const startEdit = (s: any) => { setEditId(s.id); setForm({ name: s.name, website_url: s.website_url || "", level: s.level, sort_order: s.sort_order || 0, logo_url: s.logo_url || "" }); setLogoFile(null); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditId(null); };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;
    const path = `${Date.now()}-${logoFile.name.replace(/\s+/g, "_")}`;
    const { error } = await supabase.storage.from("sponsor-logos").upload(path, logoFile, { upsert: true });
    if (error) { toast.error(error.message); return null; }
    const { data } = supabase.storage.from("sponsor-logos").getPublicUrl(path);
    return data.publicUrl;
  };

  const save = async () => {
    if (!form.name) { toast.error("Company name is required."); return; }
    setSaving(true);
    const uploadedUrl = await uploadLogo();
    const logo_url = uploadedUrl || form.logo_url;
    if (editId) {
      await supabase.from("sponsors").update({ ...form, logo_url }).eq("id", editId);
      toast.success("Sponsor updated!");
    } else {
      await supabase.from("sponsors").insert({ ...form, logo_url, active: true });
      toast.success("Sponsor added!");
    }
    setSaving(false); cancel(); load();
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("sponsors").update({ active }).eq("id", id); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this sponsor?")) return;
    await supabase.from("sponsors").delete().eq("id", id);
    toast.success("Removed."); load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Sponsors / Partners</h2>
        <button onClick={showForm && !editId ? cancel : startAdd}
          style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", background: showForm && !editId ? "var(--muted)" : "var(--primary)", color: showForm && !editId ? "var(--foreground)" : "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem" }}>
          {showForm && !editId ? "Cancel" : "+ Add sponsor"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: "2rem", padding: "1.5rem", borderRadius: "1rem", border: `2px solid ${editId ? "var(--primary)" : "var(--border)"}`, background: "var(--card)", display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 560 }}>
          <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1rem" }}>{editId ? "Edit sponsor" : "New sponsor"}</h3>
          {[{ key: "name", label: "Company name *" }, { key: "website_url", label: "Website URL" }].map(f => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={inp} />
            </div>
          ))}
          {/* Logo upload OR URL */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Logo — upload file</label>
            <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] ?? null)} style={inp} />
            {logoFile && <p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>Selected: {logoFile.name}</p>}
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Logo — or paste URL</label>
            <input value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} placeholder="https://…" style={inp} />
            {form.logo_url && <img src={form.logo_url} alt="preview" style={{ height: 48, marginTop: "0.5rem", objectFit: "contain" }} onError={e => (e.currentTarget.style.display = "none")} />}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Tier</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} style={inp}>
                {["platinum", "gold", "silver", "bronze"].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Sort order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} style={{ ...inp, width: "100%" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <button onClick={save} disabled={saving} style={{ padding: "0.625rem 1.5rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : editId ? "Save changes" : "Add sponsor"}
            </button>
            <button onClick={cancel} style={{ padding: "0.625rem 1rem", borderRadius: "0.5rem", background: "var(--muted)", color: "var(--foreground)", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {list.map(s => (
          <div key={s.id} style={{ padding: "0.875rem 1.25rem", borderRadius: "0.75rem", border: `1px solid ${editId === s.id ? "var(--primary)" : "var(--border)"}`, background: "var(--card)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", opacity: s.active ? 1 : 0.5 }}>
            {s.logo_url && s.logo_url.trim()
              ? <img src={s.logo_url} alt={s.name} style={{ height: 48, width: "auto", maxWidth: 120, objectFit: "contain", flexShrink: 0 }} onError={e => (e.currentTarget.style.display = "none")} />
              : <div style={{ width: 48, height: 48, borderRadius: "0.375rem", background: "var(--muted)", display: "grid", placeItems: "center", fontSize: "0.6rem", fontWeight: 700, color: "var(--muted-foreground)", flexShrink: 0 }}>NO LOGO</div>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textTransform: "capitalize" }}>{s.level} · {s.website_url || "no website"}</div>
            </div>
            <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
              <button onClick={() => startEdit(s)} style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", border: "1px solid var(--primary)", background: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Edit</button>
              <button onClick={() => toggle(s.id, !s.active)} style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>{s.active ? "Hide" : "Show"}</button>
              <button onClick={() => remove(s.id)} style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", border: "1px solid var(--border)", background: "none", color: "var(--destructive)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>No sponsors yet.</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Main Admin Page
// ─────────────────────────────────────────
export default function AdminPage() {
  const { isAdmin, loading, adminLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("settings");

  if (loading || adminLoading) return <div className="container-page" style={{ paddingTop: "4rem" }}>Loading…</div>;
  if (!isAdmin) return (
    <div className="container-page" style={{ paddingTop: "4rem" }}>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 700 }}>Admin access required</h1>
      <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem" }}>Sign in with an admin account or contact the organizer.</p>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: any; group: string }[] = [
    { id: "settings", label: "General", icon: Settings, group: "Site content" },
    { id: "header", label: "Header", icon: Layout, group: "Site content" },
    { id: "footer", label: "Footer", icon: AlignLeft, group: "Site content" },
    { id: "home_extra", label: "Home page", icon: Globe, group: "Site content" },
    { id: "about", label: "About", icon: Star, group: "Site content" },
    { id: "entertainment", label: "Entertainment", icon: Mic2, group: "Site content" },
    { id: "team", label: "Board", icon: UserCircle, group: "People" },
    { id: "sponsors_list", label: "Sponsors", icon: Star, group: "People" },
    { id: "merch", label: "Merch", icon: ShoppingBag, group: "Store" },
    { id: "media", label: "Photos & Media", icon: ImageIcon, group: "Store" },
    { id: "vendors_tab", label: "Vendors", icon: Store, group: "Applications" },
    { id: "artists_tab", label: "Artists", icon: Mic2, group: "Applications" },
    { id: "volunteers_tab", label: "Volunteers", icon: HandHeart, group: "Applications" },
    { id: "messages", label: "Messages", icon: MessageSquare, group: "Applications" },
  ];

  const groups = [...new Set(tabs.map(t => t.group))];

  return (
    <div className="container-page" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>Admin Panel</h1>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        {/* Sidebar nav */}
        <aside style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {groups.map(g => (
            <div key={g}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted-foreground)", marginBottom: "0.5rem" }}>{g}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                {tabs.filter(t => t.group === g).map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: tab === t.id ? 600 : 400, fontFamily: "inherit", background: tab === t.id ? "var(--primary)" : "transparent", color: tab === t.id ? "white" : "var(--foreground)", textAlign: "left", transition: "all 0.15s" }}>
                    <t.icon size={14} /> {t.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {(tab === "settings" || tab === "header" || tab === "footer" || tab === "about" || tab === "entertainment" || tab === "home_extra") && <SettingsEditor tab={tab} />}
          {tab === "merch" && <MerchManager />}
          {tab === "media" && <MediaManager />}
          {tab === "team" && <TeamManager />}
          {tab === "sponsors_list" && <SponsorsManager />}
          {tab === "vendors_tab" && <><h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem", marginBottom: "0.5rem" }}>Vendor Applications</h2><AppList table="vendor_applications" titleField="business_name" /></>}
          {tab === "artists_tab" && <><h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem", marginBottom: "0.5rem" }}>Artist Applications</h2><AppList table="artist_applications" titleField="stage_name" /></>}
          {tab === "volunteers_tab" && <><h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem", marginBottom: "0.5rem" }}>Volunteer Applications</h2><AppList table="volunteer_applications" titleField="full_name" /></>}
          {tab === "messages" && <><h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem", marginBottom: "0.5rem" }}>Contact Messages</h2><MessagesList /></>}
        </main>
      </div>
    </div>
  );
}
import React from "react";
