"use client";
// Invisible field that bots fill in but humans never see.
// If filled, the submission is silently treated as spam.
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      name="website_url_confirm"
      value={value}
      onChange={e => onChange(e.target.value)}
      autoComplete="off"
      tabIndex={-1}
      aria-hidden="true"
      style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
    />
  );
}
