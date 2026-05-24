"use client";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type MerchItem = { id: string; name: string; description: string; price: number; image_url: string; category: string; in_stock: boolean; };

export default function MerchPage() {
  const [items, setItems] = useState<MerchItem[]>([]);

  useEffect(() => {
    supabase.from("merch_items").select("*").eq("is_active", true).order("sort_order").then(({ data }) => setItems(data ?? []));
  }, []);

  return (
    <div>
      <section style={{ background: "var(--primary)", color: "white", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="container-page">
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>Official store</p>
          <h1 className="display-lg" style={{ color: "white", marginTop: "0.5rem" }}>NUFF Merch</h1>
          <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.85)", maxWidth: "36rem", fontSize: "1rem" }}>Represent NUFF 2026 with official festival merchandise.</p>
        </div>
      </section>
      <section className="container-page" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        {items.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {items.map(item => (
              <div key={item.id} style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--card)" }}>
                <div style={{ aspectRatio: "1/1", background: "var(--muted)", overflow: "hidden" }}>
                  {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ShoppingBag size={48} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.3 }} />}
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>{item.name}</h3>
                  {item.description && <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>{item.description}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--primary)" }}>${item.price}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.625rem", borderRadius: "9999px", background: item.in_stock ? "#dcfce7" : "#fee2e2", color: item.in_stock ? "#166534" : "#991b1b" }}>{item.in_stock ? "In stock" : "Sold out"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted-foreground)" }}>
            <ShoppingBag size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Store coming soon</h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>Official NUFF merchandise will be available soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
