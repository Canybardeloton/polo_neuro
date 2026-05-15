const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function generateBloc(
  test: string,
  notes: string,
): Promise<{ text: string }> {
  const res = await fetch(`${API_BASE}/generate-bloc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test, notes }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const msg = Array.isArray(err.detail)
      ? err.detail[0]?.msg
      : err.detail ?? res.statusText;
    throw new Error(typeof msg === "string" ? msg : res.statusText);
  }
  return res.json();
}
