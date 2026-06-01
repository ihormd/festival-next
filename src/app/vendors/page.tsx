"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Mail, Copy, Check } from "lucide-react";
import { useSiteSettings } from "@/lib/site-content";

type Spot = { id: string; code: string; label: string | null; status: "available" | "pending" | "occupied"; x: number; y: number; w: number; h: number; price_cents: number; };
type BookingResult = { id: string; order_number: string; amount_cents: number; payment_method: "stripe" | "etransfer"; pending_until: string | null; };

const VIEW_W = 1181; const VIEW_H = 1440;
const ETRANSFER_RECIPIENT = "info@niagarka.ca";
const dotFill = (s: Spot["status"]) => s === "available" ? "#10b981" : s === "pending" ? "#f59e0b" : "#ef4444";

export default function VendorsPage() {
  const { user } = useAuth();
  const s = useSiteSettings();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selected, setSelected] = useState<Spot | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Spot["status"]>("all");
  const [step, setStep] = useState<"choose" | "form" | "etransfer-done">("choose");
  const [method, setMethod] = useState<"stripe" | "etransfer">("etransfer");
  const [form, setForm] = useState({ business_name: "", contact_name: "", contact_email: "", contact_phone: "" });
  const [busy, setBusy] = useState(false);
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.from("vendor_spots").select("*").order("code").then(({ data }) => setSpots((data as Spot[]) ?? []));
    const ch = supabase.channel("vendor_spots_rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "vendor_spots" }, (payload: any) => {
        setSpots(prev => prev.map(s => s.id === payload.new?.id ? { ...s, ...payload.new } : s));
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  useEffect(() => {
    if (user) setForm(f => ({ ...f, contact_name: user.user_metadata?.full_name ?? "", contact_email: user.email ?? "" }));
  }, [user]);

  const filtered = useMemo(() => filter === "all" ? spots : spots.filter(s => s.status === filter), [spots, filter]);

  const openSpot = (s: Spot) => {
    setSelected(s); setBooking(null); setStep("choose");
    setForm({ business_name: "", contact_name: user?.user_metadata?.full_name ?? "", contact_email: user?.email ?? "", contact_phone: "" });
  };

  const submit = async () => {
    if (!selected || !user) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.rpc("book_vendor_spot", {
        p_spot_id: selected.id, p_payment_method: method,
        p_business_name: form.business_name, p_contact_name: form.contact_name,
        p_contact_email: form.contact_email, p_contact_phone: form.contact_phone,
      });
      if (error) throw error;
      setBooking(data as BookingResult);
      if (method === "etransfer") setStep("etransfer-done");
      else {
        const { data: fresh } = await supabase.from("vendor_spots").select("*").order("code");
        setSpots((fresh as Spot[]) ?? []); setSelected(null);
      }
    } catch (e: any) {
      alert(e?.message ?? "Booking failed");
    } finally { setBusy(false); }
  };

  const copyOrder = () => {
    if (!booking) return;
    navigator.clipboard.writeText(booking.order_number);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <section style={{ background: "var(--primary)", color: "white", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-page">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Become a vendor</p>
          <h1 className="display-lg" style={{ color: "white", marginTop: "0.5rem" }}>Reserve your booth in real time</h1>
          <p style={{ marginTop: "0.75rem", color: "rgba(255,255,255,0.85)", maxWidth: "38rem", fontSize: "0.95rem" }}>Click any green spot to book. Spots turn yellow when in checkout and red once paid — fully automated, no email tag.</p>
        </div>
      </section>

      <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
          {[{ color: "#10b981", label: "Available" }, { color: "#f59e0b", label: "Pending" }, { color: "#ef4444", label: "Sold out" }].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: color, display: "inline-block" }} />
              {label}
            </div>
          ))}
          <Link href="/apply/vendor" style={{ marginLeft: "auto" }}>
            <button style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "0.875rem", fontFamily: "inherit", fontWeight: 600 }}>Vendor application</button>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          <style>{`@media (min-width: 1024px) { .vendor-grid { grid-template-columns: 1fr 320px !important; } }`}</style>
          <div className="vendor-grid" style={{ display: "grid", gap: "1.5rem" }}>
            {/* Map */}
            <div style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: "1rem", border: "1px solid var(--border)", background: "rgba(0,0,0,0.05)" }}>
              <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ display: "block", width: "100%", height: "auto" }}>
                <image href={s.vendor_map_image_url || "/assets/festival-map.jpg"} x={0} y={0} width={VIEW_W} height={VIEW_H} preserveAspectRatio="xMidYMid slice" />
                {spots.map(s => {
                  const cx = s.x + s.w / 2; const cy = s.y + s.h / 2; const r = 18;
                  const fill = dotFill(s.status); const clickable = s.status === "available";
                  return (
                    <g key={s.id} onClick={() => clickable && openSpot(s)} style={{ cursor: clickable ? "pointer" : "not-allowed" }}>
                      {highlight === s.id && <circle cx={cx} cy={cy} r={r + 10} fill={fill} opacity={0.25} />}
                      {clickable && <circle cx={cx} cy={cy} r={r + 4} fill="none" stroke={fill} strokeWidth={2} opacity={0.55} />}
                      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.78} stroke="white" strokeWidth={highlight === s.id ? 3 : 2} />
                      <text x={cx} y={cy + 4} textAnchor="middle" style={{ fill: "white", fontWeight: "bold", fontSize: 13, pointerEvents: "none" }}>{s.code}</text>
                    </g>
                  );
                })}
              </svg>
              {spots.length === 0 && (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "var(--muted)", borderRadius: "1rem" }}>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>Map loading… (add vendor spots in Admin)</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside style={{ borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--card)", display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
              <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.75rem" }}>Spots ({filtered.length})</div>
                <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", fontSize: "0.75rem" }}>
                  {(["all", "available", "pending", "occupied"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.25rem 0.625rem", borderRadius: "9999px", border: "none", cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit", background: filter === f ? "var(--primary)" : "var(--muted)", color: filter === f ? "white" : "inherit", fontWeight: filter === f ? 600 : 400 }}>{f}</button>
                  ))}
                </div>
              </div>
              <div style={{ overflowY: "auto", flex: 1 }}>
                {filtered.map(s => (
                  <button key={s.id} onMouseEnter={() => setHighlight(s.id)} onMouseLeave={() => setHighlight(null)}
                    onClick={() => { setHighlight(s.id); if (s.status === "available") openSpot(s); }}
                    style={{ width: "100%", textAlign: "left", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem", background: highlight === s.id ? "var(--muted)" : "transparent", cursor: s.status === "available" ? "pointer" : "default", border: "none", fontFamily: "inherit" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: dotFill(s.status), flexShrink: 0, display: "inline-block" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{s.code} {s.label && <span style={{ color: "var(--muted-foreground)", fontWeight: 400 }}>— {s.label}</span>}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", textTransform: "capitalize" }}>{s.status} · ${(s.price_cents / 100).toFixed(0)}</div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && <p style={{ padding: "1.5rem", color: "var(--muted-foreground)", fontSize: "0.875rem" }}>No spots match this filter.</p>}
              </div>
            </aside>
          </div>
        </div>

        {/* Booking Modal */}
        {selected && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={() => setSelected(null)}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
            <div style={{ position: "relative", background: "var(--card)", borderRadius: "1rem", padding: "1.5rem", width: "100%", maxWidth: 480, boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setSelected(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", color: "var(--muted-foreground)" }}>✕</button>

              {step === "choose" && (
                <>
                  <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Spot {selected.code} {selected.label ? `— ${selected.label}` : ""}</h2>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "0.25rem" }}>${(selected.price_cents / 100).toFixed(0)} CAD for the weekend</p>
                  {!user ? (
                    <div style={{ marginTop: "1.25rem" }}>
                      <p style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>Please sign in to book this spot.</p>
                      <Link href="/login"><button style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>Sign in</button></Link>
                    </div>
                  ) : (
                    <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>Choose how you'd like to pay:</p>
                      {[
                        { m: "stripe" as const, icon: CreditCard, title: "Credit card / Apple Pay / Google Pay", desc: "Instant confirmation via Stripe." },
                        { m: "etransfer" as const, icon: Mail, title: "Interac e-Transfer", desc: `Spot held 24 hours. Send to ${ETRANSFER_RECIPIENT}.` },
                      ].map(({ m, icon: Icon, title, desc }) => (
                        <button key={m} onClick={() => { setMethod(m); setStep("form"); }}
                          style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem", borderRadius: "0.75rem", border: "2px solid var(--border)", background: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "border-color 0.15s" }}
                          onMouseEnter={e => (e.currentTarget as any).style.borderColor = "var(--primary)"}
                          onMouseLeave={e => (e.currentTarget as any).style.borderColor = "var(--border)"}>
                          <Icon size={22} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
                          <div><div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{title}</div><div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.125rem" }}>{desc}</div></div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === "form" && (
                <>
                  <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Reserve spot {selected.code}</h2>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", marginTop: "0.25rem" }}>{method === "etransfer" ? "We'll hold this spot for 24 hours." : "Card checkout opens after you confirm."}</p>
                  <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    {[{ key: "business_name", label: "Business / Vendor name *" }, { key: "contact_name", label: "Contact name *" }, { key: "contact_email", label: "Email *" }, { key: "contact_phone", label: "Phone" }].map(f => (
                      <div key={f.key}>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>{f.label}</label>
                        <input type={f.key === "contact_email" ? "email" : "text"} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--input)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
                    <button onClick={() => setStep("choose")} style={{ flex: 1, padding: "0.625rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "none", cursor: "pointer", fontSize: "0.875rem", fontFamily: "inherit" }}>Back</button>
                    <button onClick={submit} disabled={busy || !form.business_name || !form.contact_name || !form.contact_email}
                      style={{ flex: 2, padding: "0.625rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", opacity: busy ? 0.7 : 1 }}>
                      {busy ? "Reserving…" : method === "etransfer" ? "Hold spot for 24h" : "Continue to payment"}
                    </button>
                  </div>
                </>
              )}

              {step === "etransfer-done" && booking && (
                <>
                  <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Spot {selected.code} is held for 24 hours</h2>
                  <p style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", marginTop: "0.25rem" }}>Complete your Interac e-Transfer using the details below.</p>
                  <div style={{ marginTop: "1.25rem", padding: "1rem", borderRadius: "0.75rem", background: "var(--cream)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.625rem", fontSize: "0.875rem" }}>
                    {[{ label: "Send to", value: ETRANSFER_RECIPIENT }, { label: "Amount", value: `$${(booking.amount_cents / 100).toFixed(2)} CAD` }].map(r => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--muted-foreground)" }}>{r.label}</span>
                        <span style={{ fontWeight: 600 }}>{r.value}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--muted-foreground)" }}>Memo (Order #)</span>
                      <button onClick={copyOrder} style={{ fontFamily: "monospace", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", cursor: "pointer" }}>
                        {booking.order_number} {copied ? <Check size={16} style={{ color: "#10b981" }} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.75rem", lineHeight: 1.6 }}>Include the Order # in the e-Transfer memo. Once we confirm receipt, your spot is permanently reserved. If we don't receive payment within 24 hours, the spot is automatically released.</p>
                  <button onClick={() => setSelected(null)} style={{ marginTop: "1.25rem", width: "100%", padding: "0.75rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>Done</button>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
