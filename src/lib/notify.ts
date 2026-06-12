export async function notifyAdmin(type: string, data: Record<string, any>) {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data }),
    });
  } catch {
    // Silent fail — don't block user flow on email errors
  }
}
