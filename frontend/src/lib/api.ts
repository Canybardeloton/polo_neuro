const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface ScoreEntry {
  test_name: string;
  subtest_name: string;
  percentile?: number | null;
  note_standard?: number | null;
  qualification?: string | null;
}

export interface GenerateRequest {
  domaine: string;
  observations: string;
  scores: ScoreEntry[];
  tranche_age: string;
  tests_utilises: string[];
}

export interface GenerateResponse {
  texte_genere: string;
  scores_source: ScoreEntry[];
  domaine: string;
}

export async function generateSection(
  req: GenerateRequest,
): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
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
