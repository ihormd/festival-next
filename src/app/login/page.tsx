"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setLoading(true);
    const { error: e } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (e) { setError(e.message); return; }
    router.push("/dashboard");
  };

  return (
    <div className="container-page" style={{ paddingTop: "5rem", paddingBottom: "5rem", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Sign in</h1>
        <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem", fontSize: "0.9rem" }}>Welcome back to NUFF.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
              style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
              style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }} />
          </div>
          {error && <p style={{ color: "var(--accent)", fontSize: "0.875rem" }}>{error}</p>}
          <button onClick={submit} disabled={loading} style={{ padding: "0.75rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            No account? <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
