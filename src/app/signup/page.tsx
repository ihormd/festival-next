"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setLoading(true);
    const { error: e } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    setLoading(false);
    if (e) { setError(e.message); return; }
    router.push("/dashboard");
  };

  return (
    <div className="container-page" style={{ paddingTop: "5rem", paddingBottom: "5rem", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Create account</h1>
        <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem", fontSize: "0.9rem" }}>Join NUFF 2026.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[{ key: "name", label: "Full name", type: "text", val: name, set: setName }, { key: "email", label: "Email", type: "email", val: email, set: setEmail }, { key: "password", label: "Password", type: "password", val: password, set: setPassword }].map(f => (
            <div key={f.key}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.375rem" }}>{f.label}</label>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                style={{ width: "100%", padding: "0.625rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--card)", fontSize: "0.9rem", fontFamily: "inherit", outline: "none" }} />
            </div>
          ))}
          {error && <p style={{ color: "var(--accent)", fontSize: "0.875rem" }}>{error}</p>}
          <button onClick={submit} disabled={loading} style={{ padding: "0.75rem", borderRadius: "0.5rem", background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 600, fontFamily: "Montserrat, sans-serif", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creating account…" : "Sign up"}
          </button>
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            Have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
