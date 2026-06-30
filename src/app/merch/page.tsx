"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShoppingBag, Plus, Minus, Trash2, X } from "lucide-react";
import { cart, useCart } from "@/lib/cart-store";
import { dbQuery } from "@/lib/db";

type Product = { id: string; name: string; description: string | null; price_cents: number; image_url: string | null; stock: number; };

export default function MerchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const items = useCart();
  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  const cartTotal = items.reduce((s, i) => s + i.qty * i.price_cents, 0);

  useEffect(() => {
    dbQuery<Product>({ table: "merch_products", filters: { active: true } }).then(setProducts);
  }, []);

  return (
    <>
      <PageHeader eyebrow="Festival Store" title="Wear the festival home" subtitle="Limited-run apparel and gifts inspired by Ukrainian craft." />

      <section className="container-page" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
          <button onClick={() => setCartOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", fontSize: "0.875rem", fontFamily: "inherit", fontWeight: 500 }}>
            <ShoppingBag size={16} /> Cart
            {cartCount > 0 && <span style={{ display: "inline-flex", width: 20, height: 20, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "var(--primary)", color: "white", fontSize: "0.7rem", fontWeight: 700 }}>{cartCount}</span>}
          </button>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--muted-foreground)" }}>
            <ShoppingBag size={48} style={{ margin: "0 auto 1rem", opacity: 0.35 }} />
            <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>Store coming soon</h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>Official NUFF merchandise will be available soon!</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {products.map(p => (
              <article key={p.id} style={{ borderRadius: "0.875rem", border: "1px solid var(--border)", overflow: "hidden", background: "var(--card)", transition: "box-shadow 0.2s" }}
                onMouseEnter={e => (e.currentTarget as any).style.boxShadow = "0 8px 30px -8px rgba(0,87,183,0.15)"}
                onMouseLeave={e => (e.currentTarget as any).style.boxShadow = "none"}>
                <div style={{ aspectRatio: "1/1", background: "var(--muted)", overflow: "hidden" }}>
                  {p.image_url
                    ? <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                        onMouseEnter={e => (e.currentTarget as any).style.transform = "scale(1.05)"}
                        onMouseLeave={e => (e.currentTarget as any).style.transform = "scale(1)"} />
                    : <div style={{ height: "100%", display: "grid", placeItems: "center", color: "var(--muted-foreground)", fontSize: "0.875rem" }}>No image</div>}
                </div>
                <div style={{ padding: "1rem" }}>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "1rem" }}>{p.name}</h3>
                  {p.description && <p style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.25rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.description}</p>}
                  <div style={{ marginTop: "0.875rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.1rem", fontWeight: 700 }}>${(p.price_cents / 100).toFixed(2)}</span>
                    <button onClick={() => cart.add({ id: p.id, name: p.name, price_cents: p.price_cents, image_url: p.image_url })}
                      style={{ padding: "0.375rem 0.875rem", borderRadius: "0.375rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setCartOpen(false)} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "min(400px, 100vw)", background: "var(--card)", display: "flex", flexDirection: "column", boxShadow: "-4px 0 24px rgba(0,0,0,0.15)" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>Your cart</h2>
              <button onClick={() => setCartOpen(false)} aria-label="Close cart" style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}><X size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.length === 0 && <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Cart is empty.</p>}
              {items.map(i => (
                <div key={i.id} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  {i.image_url && <img src={i.image_url} alt={i.name} style={{ width: 56, height: 56, borderRadius: "0.375rem", objectFit: "cover", flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{i.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>${(i.price_cents / 100).toFixed(2)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <button onClick={() => cart.setQty(i.id, i.qty - 1)} aria-label={`Decrease quantity of ${i.name}`} style={{ padding: "0.25rem", borderRadius: "0.25rem", background: "var(--muted)", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}><Minus size={14} /></button>
                    <span style={{ width: 24, textAlign: "center", fontSize: "0.875rem" }}>{i.qty}</span>
                    <button onClick={() => cart.setQty(i.id, i.qty + 1)} aria-label={`Increase quantity of ${i.name}`} style={{ padding: "0.25rem", borderRadius: "0.25rem", background: "var(--muted)", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}><Plus size={14} /></button>
                    <button onClick={() => cart.remove(i.id)} aria-label={`Remove ${i.name} from cart`} style={{ padding: "0.25rem", borderRadius: "0.25rem", background: "none", border: "none", cursor: "pointer", color: "#ef4444", marginLeft: "0.25rem", display: "grid", placeItems: "center" }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                <span>Total</span><span>${(cartTotal / 100).toFixed(2)} CAD</span>
              </div>
              <button disabled={items.length === 0} onClick={() => alert("Stripe checkout activates once Payments is enabled.")}
                style={{ padding: "0.75rem", borderRadius: "0.5rem", background: items.length === 0 ? "var(--muted)" : "var(--primary)", color: items.length === 0 ? "var(--muted-foreground)" : "white", border: "none", cursor: items.length === 0 ? "not-allowed" : "pointer", fontWeight: 600, fontFamily: "Montserrat, sans-serif", fontSize: "0.95rem" }}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
