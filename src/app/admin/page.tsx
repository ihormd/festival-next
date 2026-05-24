"use client";
import { useAuth } from "@/context/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { refreshSiteSettings, DEFAULTS } from "@/lib/site-content";
import { Save, Users, Store, Mic2, HandHeart, MessageSquare, Settings, Layout, AlignLeft } from "lucide-react";

type Tab = "settings" | "header" | "footer" | "vendors" | "artists" | "volunteers" | "messages";

const SETTINGS_FIELDS = [
  { key: "festival_name", label: "Festival name" },
  { key: "festival_short_name", label: "Short name (NUFF)" },
  { key: "festival_dates", label: "Festival dates" },
  { key: "location_name", label: "Venue name" },
  { key: "location_address", label: "Venue address" },
  { key: "hero_tagline", label: "Hero tagline" },
  { key: "hero_subtitle", label: "Hero subtitle", multiline: true },
  { key: "contact_email", label: "Contact email" },
  { key: "home_stat_1_value", label: "Stat 1 value" }, { key: "home_stat_1_label", label: "Stat 1 label" },
  { key: "home_stat_2_value", label: "Stat 2 value" }, { key: "home_stat_2_label", label: "Stat 2 label" },
  { key: "home_stat_3_value", label: "Stat 3 value" }, { key: "home_stat_3_label", label: "Stat 3 label" },
  { key: "home_stat_4_value", label: "Stat 4 value" }, { key: "home_stat_4_label", label: "Stat 4 label" },
  { key: "home_hero_cta_primary", label: "Hero CTA primary button" },
  { key: "home_hero_cta_secondary", label: "Hero CTA secondary button" },
  { key: "about_mission", label: "About: Mission", multiline: true },
  { key: "about_history", label: "About: History", multiline: true },
];

const HEADER_FIELDS = [
  { key: "header_nav_festival", label: "Nav: Festival" },
  { key: "header_nav_entertainment", label: "Nav: Entertainment" },
  { key: "header_nav_merch", label: "Nav: Merch" },
  { key: "header_nav_about", label: "Nav: About" },
  { key: "header_nav_contact", label: "Nav: Contact" },
  { key: "header_nav_involved_label", label: "Dropdown button label" },
  { key: "header_nav_artists_label", label: "Dropdown: Artists label" },
  { key: "header_nav_artists_desc", label: "Dropdown: Artists description" },
  { key: "header_nav_vendors_label", label: "Dropdown: Vendors label" },
  { key: "header_nav_vendors_desc", label: "Dropdown: Vendors description" },
  { key: "header_nav_volunteers_label", label: "Dropdown: Volunteers label" },
  { key: "header_nav_volunteers_desc", label: "Dropdown: Volunteers description" },
  { key: "header_nav_sponsors_label", label: "Dropdown: Sponsors label" },
  { key: "header_nav_sponsors_desc", label: "Dropdown: Sponsors description" },
];

const FOOTER_FIELDS = [
  { key: "footer_tagline", label: "Tagline", multiline: true },
  { key: "footer_col1_title", label: "Column 1 title" },
  { key: "footer_col2_title", label: "Column 2 title" },
  { key: "footer_copyright", label: "Copyright text" },
  { key: "footer_contact_display", label: "Contact/region line" },
  { key: "seo_title", label: "SEO: Page title" },
  { key: "seo_description", label: "SEO: Description", multiline: true },
];

function SettingsEditor({ fields }: { fields: { key: string; label: string; multiline?: boolean }[] }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("key,value").then(({ data }) => {
      const map: Record<string, string> = { ...DEFAULTS };
      (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
      setValues(map);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const rows = fields.map(f => ({ key: f.key, value: values[f.key] ?? "" }));
    await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    await refreshSiteSettings();
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "640px" }}>
      {fields.map(f => (
        <div key={f.key}>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.375rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
          {f.multiline ? (
            <textarea value={values[f.key] ?? ""} onChange={e => setValues({ ...values, [f.key]: e.target.value })} rows={3}
              style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", resize: "vertical", outline: "none" }} />
          ) : (
            <input value={values[f.key] ?? ""} onChange={e => setValues({ ...values, [f.key]: e.target.value })}
              style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }} />
          )}
        </div>
      ))}
      <button onClick={save} disabled={saving} style={{ alignSelf: "flex-start", padding: "0.625rem 1.5rem", borderRadius: "0.5rem", background: saved ? "#166534" : "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem", fontFamily: "Montserrat, sans-serif", transition: "background 0.3s" }}>
        <Save size={16} /> {saving ? "Saving…" : saved ? "Saved!" : "Save changes"}
      </button>
    </div>
  );
}

function AppList({ table, titleField }: { table: string; titleField: string }) {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { supabase.from(table).select("*").order("created_at", { ascending: false }).limit(50).then(({ data }) => setItems(data ?? [])); }, [table]);
  if (!items.length) return <p style={{ color: "var(--muted-foreground)", padding: "2rem 0" }}>No applications yet.</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
      {items.map(item => (
        <div key={item.id} style={{ padding: "1rem 1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--card)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{item[titleField]}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.125rem" }}>{item.email} · {new Date(item.created_at).toLocaleDateString()}</div>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.625rem", borderRadius: "9999px", background: item.status === "approved" ? "#dcfce7" : item.status === "rejected" ? "#fee2e2" : "#fef9c3", color: item.status === "approved" ? "#166534" : item.status === "rejected" ? "#991b1b" : "#854d0e", textTransform: "capitalize" }}>{item.status}</span>
        </div>
      ))}
    </div>
  );
}

function MessagesList() {
  const [msgs, setMsgs] = useState<any[]>([]);
  useEffect(() => { supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(50).then(({ data }) => setMsgs(data ?? [])); }, []);
  if (!msgs.length) return <p style={{ color: "var(--muted-foreground)", padding: "2rem 0" }}>No messages yet.</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
      {msgs.map(m => (
        <div key={m.id} style={{ padding: "1rem 1.25rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
            <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{m.full_name}</span>
            <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{new Date(m.created_at).toLocaleDateString()}</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--primary)", marginBottom: "0.375rem" }}>{m.email}</div>
          <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>{m.message}</p>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const { isAdmin, loading, adminLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("settings");

  if (loading || adminLoading) return <div className="container-page" style={{ paddingTop: "4rem" }}>Loading…</div>;
  if (!isAdmin) return (
    <div className="container-page" style={{ paddingTop: "4rem" }}>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.5rem", fontWeight: 700 }}>Admin access required</h1>
      <p style={{ color: "var(--muted-foreground)", marginTop: "0.5rem" }}>Contact a NUFF organizer to grant admin access.</p>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "header", label: "Header", icon: Layout },
    { id: "footer", label: "Footer", icon: AlignLeft },
    { id: "vendors", label: "Vendors", icon: Store },
    { id: "artists", label: "Artists", icon: Mic2 },
    { id: "volunteers", label: "Volunteers", icon: HandHeart },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="container-page" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
      <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 800, marginBottom: "2rem" }}>Admin Panel</h1>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.375rem", fontFamily: "inherit", background: tab === t.id ? "var(--primary)" : "transparent", color: tab === t.id ? "white" : "var(--muted-foreground)", transition: "all 0.15s" }}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>
      {tab === "settings" && <SettingsEditor fields={SETTINGS_FIELDS} />}
      {tab === "header" && <SettingsEditor fields={HEADER_FIELDS} />}
      {tab === "footer" && <SettingsEditor fields={FOOTER_FIELDS} />}
      {tab === "vendors" && <><h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Vendor Applications</h2><AppList table="vendor_applications" titleField="business_name" /></>}
      {tab === "artists" && <><h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Artist Applications</h2><AppList table="artist_applications" titleField="stage_name" /></>}
      {tab === "volunteers" && <><h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Volunteer Applications</h2><AppList table="volunteer_applications" titleField="full_name" /></>}
      {tab === "messages" && <><h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Contact Messages</h2><MessagesList /></>}
    </div>
  );
}
