"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/auth";
import { supabase } from "@/lib/supabase";
import { refreshSiteSettings, DEFAULTS } from "@/lib/site-content";
import { Save, Users, Store, Mic2, HandHeart, MessageSquare, Settings, Layout, AlignLeft, ShoppingBag, UserCircle, Globe, Star, ImageIcon, Calendar, MapPin } from "lucide-react";
import { MediaManager } from "./MediaManager";
import { toast } from "sonner";

type Tab = "settings" | "header" | "footer" | "about" | "entertainment" | "home_extra" | "vendors_tab" | "artists_tab" | "volunteers_tab" | "messages" | "merch" | "team" | "sponsors_list" | "media" | "schedule" | "vendor_spots";

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
    { key: "about_board_eyebrow", label: "Board section — eyebrow" },
    { key: "about_board_title", label: "Board section — heading" },
    { key: "about_board_subtitle", label: "Board section — subtitle", multiline: true },
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
  vendors_tab: [], artists_tab: [], volunteers_tab: [], messages: [], merch: [], team: [], sponsors_list: [], media: [], schedule: [], vendor_spots: [],
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
  const [bucketFiles, setBucketFiles] = useState<{ name: string; url: string }[]>([]);

  const load = () => supabase.from("sponsors").select("*").order("sort_order").then(({ data }) => setList(data ?? []));
  const loadBucket = async () => {
    const { data } = await supabase.storage.from("sponsor-logos").list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
    const files = (data ?? []).filter(f => f.name !== ".emptyFolderPlaceholder").map(f => {
      const { data: u } = supabase.storage.from("sponsor-logos").getPublicUrl(f.name);
      return { name: f.name, url: u.publicUrl };
    });
    setBucketFiles(files);
  };
  useEffect(() => { load(); loadBucket(); }, []);

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
          {bucketFiles.length > 0 && (
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem" }}>Or pick from already-uploaded logos (Photos & Media)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {bucketFiles.map(f => (
                  <button key={f.name} type="button" onClick={() => setForm({ ...form, logo_url: f.url })}
                    style={{ padding: "0.375rem", borderRadius: "0.5rem", border: `2px solid ${form.logo_url === f.url ? "var(--primary)" : "var(--border)"}`, background: "white", cursor: "pointer", height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={f.url} alt="" style={{ maxHeight: 40, maxWidth: 80, objectFit: "contain" }} />
                  </button>
                ))}
              </div>
            </div>
          )}
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
// Schedule Manager
// ─────────────────────────────────────────
function ScheduleManager() {
  const [items, setItems] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ day: "saturday", start_time: "12:00", end_time: "13:00", title: "", area: "Main Stage", sort_order: 0 });

  const load = () => supabase.from("festival_schedule").select("*").order("day").order("sort_order").then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const startAdd = () => { setEditId(null); setForm({ day: "saturday", start_time: "12:00", end_time: "13:00", title: "", area: "Main Stage", sort_order: items.length }); setShowForm(true); };
  const startEdit = (r: any) => { setEditId(r.id); setForm({ day: r.day, start_time: r.start_time || "", end_time: r.end_time || "", title: r.title, area: r.area || "Main Stage", sort_order: r.sort_order || 0 }); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditId(null); };

  const save = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    setSaving(true);
    if (editId) {
      await supabase.from("festival_schedule").update(form).eq("id", editId);
      toast.success("Updated!");
    } else {
      await supabase.from("festival_schedule").insert({ ...form, active: true });
      toast.success("Added!");
    }
    setSaving(false); cancel(); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this schedule item?")) return;
    await supabase.from("festival_schedule").delete().eq("id", id);
    toast.success("Deleted."); load();
  };

  const days = ["saturday", "sunday"];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Festival Schedule</h2>
        <button onClick={showForm && !editId ? cancel : startAdd}
          style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", background: showForm && !editId ? "var(--muted)" : "var(--primary)", color: showForm && !editId ? "var(--foreground)" : "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem" }}>
          {showForm && !editId ? "Cancel" : "+ Add item"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: "2rem", padding: "1.5rem", borderRadius: "1rem", border: `2px solid ${editId ? "var(--primary)" : "var(--border)"}`, background: "var(--card)", display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 560 }}>
          <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1rem" }}>{editId ? "Edit item" : "New schedule item"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Day</label>
              <select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} style={inp}>
                <option value="saturday">Saturday · July 11</option>
                <option value="sunday">Sunday · July 12</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Area / Stage</label>
              <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="Main Stage" style={inp} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Opening Ceremony" style={inp} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Start time</label>
              <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>End time</label>
              <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Sort order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} style={inp} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <button onClick={save} disabled={saving} style={{ padding: "0.625rem 1.5rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : editId ? "Save changes" : "Add item"}
            </button>
            <button onClick={cancel} style={{ padding: "0.625rem 1rem", borderRadius: "0.5rem", background: "var(--muted)", color: "var(--foreground)", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {days.map(day => {
        const dayItems = items.filter(r => r.day === day);
        return (
          <div key={day} style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", fontWeight: 600, textTransform: "capitalize", padding: "0.5rem 0.875rem", background: "var(--primary)", color: "white", borderRadius: "0.5rem", marginBottom: "0.75rem", display: "inline-block" }}>
              {day === "saturday" ? "Saturday · July 11" : "Sunday · July 12"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {dayItems.length === 0 && <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>No items yet.</p>}
              {dayItems.map(r => (
                <div key={r.id} style={{ padding: "0.75rem 1rem", borderRadius: "0.625rem", border: `1px solid ${editId === r.id ? "var(--primary)" : "var(--border)"}`, background: "var(--card)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, flexShrink: 0 }}>{r.start_time?.slice(0, 5)}–{r.end_time?.slice(0, 5)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{r.title}</div>
                    {r.area && <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{r.area}</div>}
                  </div>
                  <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                    <button onClick={() => startEdit(r)} style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", border: "1px solid var(--primary)", background: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Edit</button>
                    <button onClick={() => remove(r.id)} style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", border: "1px solid var(--border)", background: "none", color: "var(--destructive)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────
// Vendor Spot Editor (drag spots on map)
// ─────────────────────────────────────────
const MAP_W = 1181; const MAP_H = 1440;

function VendorSpotEditor() {
  const [spots, setSpots] = useState<any[]>([]);
  const [mapUrl, setMapUrl] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newSpot, setNewSpot] = useState({ code: "", label: "", price_cents: 15000, w: 80, h: 80 });
  const svgRef = React.useRef<SVGSVGElement>(null);

  const load = () => supabase.from("vendor_spots").select("*").order("code").then(({ data }) => setSpots(data ?? []));
  useEffect(() => {
    load();
    supabase.from("site_settings").select("value").eq("key", "vendor_map_image_url").single().then(({ data }) => {
      setMapUrl(data?.value || "/assets/festival-map.jpg");
    });
  }, []);

  const getSVGCoords = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = MAP_W / rect.width;
    const scaleY = MAP_H / rect.height;
    return { x: Math.round((e.clientX - rect.left) * scaleX), y: Math.round((e.clientY - rect.top) * scaleY) };
  };

  const handleMouseMove = async (e: React.MouseEvent) => {
    if (!dragging) return;
    const { x, y } = getSVGCoords(e);
    setSpots(prev => prev.map(s => s.id === dragging ? { ...s, x: x - s.w / 2, y: y - s.h / 2 } : s));
  };

  const handleMouseUp = async () => {
    if (!dragging) return;
    const spot = spots.find(s => s.id === dragging);
    if (spot) {
      await supabase.from("vendor_spots").update({ x: spot.x, y: spot.y }).eq("id", spot.id);
      toast.success(`Spot ${spot.code} moved`);
    }
    setDragging(null);
  };

  const addSpot = async () => {
    if (!newSpot.code) { toast.error("Code is required"); return; }
    setSaving(true);
    await supabase.from("vendor_spots").insert({ ...newSpot, x: MAP_W / 2, y: MAP_H / 2, status: "available" });
    toast.success("Spot added!"); setSaving(false); setShowAdd(false);
    setNewSpot({ code: "", label: "", price_cents: 15000, w: 80, h: 80 }); load();
  };

  const removeSpot = async (id: string) => {
    if (!confirm("Delete this spot?")) return;
    await supabase.from("vendor_spots").delete().eq("id", id);
    toast.success("Deleted."); load();
  };

  const updateField = async (id: string, field: string, value: any) => {
    await supabase.from("vendor_spots").update({ [field]: value }).eq("id", id);
    setSpots(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const dotColor = (status: string) => status === "available" ? "#10b981" : status === "pending" ? "#f59e0b" : "#ef4444";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Vendor Spot Positions</h2>
          <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>Drag spots on the map to reposition. Click a spot to edit its details.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", background: showAdd ? "var(--muted)" : "var(--primary)", color: showAdd ? "var(--foreground)" : "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", fontSize: "0.875rem" }}>
          {showAdd ? "Cancel" : "+ Add spot"}
        </button>
      </div>

      {showAdd && (
        <div style={{ marginBottom: "1.5rem", padding: "1.25rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)", maxWidth: 480, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1rem" }}>New vendor spot</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Code *</label><input value={newSpot.code} onChange={e => setNewSpot({ ...newSpot, code: e.target.value })} placeholder="A1" style={inp} /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Label</label><input value={newSpot.label} onChange={e => setNewSpot({ ...newSpot, label: e.target.value })} placeholder="Corner booth" style={inp} /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Price (cents)</label><input type="number" value={newSpot.price_cents} onChange={e => setNewSpot({ ...newSpot, price_cents: parseInt(e.target.value) || 0 })} style={inp} /><p style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>15000 = $150</p></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Size (px)</label><div style={{ display: "flex", gap: "0.375rem" }}><input type="number" value={newSpot.w} onChange={e => setNewSpot({ ...newSpot, w: parseInt(e.target.value) || 80 })} style={{ ...inp, width: "50%" }} /><input type="number" value={newSpot.h} onChange={e => setNewSpot({ ...newSpot, h: parseInt(e.target.value) || 80 })} style={{ ...inp, width: "50%" }} /></div></div>
          </div>
          <p style={{ fontSize: "0.72rem", color: "var(--muted-foreground)" }}>Spot will be placed in the center of the map — drag it to the correct position.</p>
          <button onClick={addSpot} disabled={saving} style={{ padding: "0.625rem 1.5rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", alignSelf: "flex-start", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Adding…" : "Add spot"}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gap: "1.5rem" }}>
        <style>{`@media (min-width: 1024px) { .spot-editor-grid { grid-template-columns: 1fr 280px !important; } }`}</style>
        <div className="spot-editor-grid" style={{ display: "grid", gap: "1rem", alignItems: "start" }}>
          {/* Map */}
          <div style={{ borderRadius: "0.875rem", overflow: "hidden", border: "1px solid var(--border)", cursor: dragging ? "grabbing" : "default", userSelect: "none" }}
            onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <svg ref={svgRef} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ display: "block", width: "100%", height: "auto" }}>
              <image href={mapUrl} x={0} y={0} width={MAP_W} height={MAP_H} preserveAspectRatio="xMidYMid slice" />
              {spots.map(s => {
                const cx = s.x + s.w / 2; const cy = s.y + s.h / 2; const r = 22;
                const fill = dotColor(s.status);
                const isSelected = selected === s.id;
                return (
                  <g key={s.id} onMouseDown={e => { e.preventDefault(); setDragging(s.id); setSelected(s.id); }} style={{ cursor: "grab" }}>
                    {isSelected && <circle cx={cx} cy={cy} r={r + 12} fill={fill} opacity={0.2} />}
                    <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={isSelected ? "white" : fill} strokeWidth={isSelected ? 3 : 1.5} opacity={0.6} />
                    <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.85} stroke="white" strokeWidth={2} />
                    <text x={cx} y={cy + 5} textAnchor="middle" style={{ fill: "white", fontWeight: "bold", fontSize: 14, pointerEvents: "none", fontFamily: "Montserrat, sans-serif" }}>{s.code}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Spot list */}
          <div style={{ borderRadius: "0.875rem", border: "1px solid var(--border)", background: "var(--card)", overflow: "hidden", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid var(--border)", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.9rem" }}>
              {spots.length} spots
            </div>
            {spots.map(s => (
              <div key={s.id} onClick={() => setSelected(s.id)}
                style={{ padding: "0.625rem 1rem", borderBottom: "1px solid var(--border)", cursor: "pointer", background: selected === s.id ? "var(--muted)" : "transparent", transition: "background 0.15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor(s.status), display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{s.code}</span>
                  {s.label && <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>— {s.label}</span>}
                </div>
                {selected === s.id && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                      <input value={s.code} onChange={e => updateField(s.id, "code", e.target.value)} placeholder="Code" style={{ ...inp, flex: 1, padding: "0.25rem 0.5rem", fontSize: "0.75rem" }} />
                      <input value={s.label || ""} onChange={e => updateField(s.id, "label", e.target.value)} placeholder="Label" style={{ ...inp, flex: 2, padding: "0.25rem 0.5rem", fontSize: "0.75rem" }} />
                    </div>
                    <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
                      <select value={s.status} onChange={e => updateField(s.id, "status", e.target.value)} style={{ ...inp, flex: 1, padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="occupied">Occupied</option>
                      </select>
                      <input type="number" value={s.price_cents} onChange={e => updateField(s.id, "price_cents", parseInt(e.target.value) || 0)} style={{ ...inp, flex: 1, padding: "0.25rem 0.5rem", fontSize: "0.75rem" }} />
                    </div>
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>x:{Math.round(s.x)} y:{Math.round(s.y)}</span>
                      <button onClick={() => removeSpot(s.id)} style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--destructive)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {spots.length === 0 && <p style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>No spots yet.</p>}
          </div>
        </div>
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
    { id: "schedule", label: "Schedule", icon: Calendar, group: "Festival" },
    { id: "vendor_spots", label: "Vendor Spots", icon: MapPin, group: "Festival" },
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
          {tab === "schedule" && <ScheduleManager />}
          {tab === "vendor_spots" && <VendorSpotEditor />}
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
