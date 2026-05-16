import { useRef, useState } from "react";
import { generateSection, type ScoreEntry } from "@/lib/api";
import {
  CATALOG,
  DOMAINES,
  QUALIFICATIONS,
  type TestCatalog,
} from "@/data/neuropsyCatalog";
import { BlockEditor } from "@/components/editor/BlockEditor";

type DomaineId = (typeof DOMAINES)[number]["id"];

interface ScoreRow {
  test_name: string;
  subtest_name: string;
  mesure: string;
  percentile: string;
  note_standard: string;
  qualification: string;
}

function buildScoreKey(testId: string, subtestId: string) {
  return `${testId}__${subtestId}`;
}

export function BlocPage() {
  const [domaine, setDomaine] = useState<DomaineId>("attention");
  const [trancheAge, setTrancheAge] = useState("adulte");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, ScoreRow>>({});
  const [observations, setObservations] = useState("");
  const [output, setOutput] = useState("");
  const [generationCount, setGenerationCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const getEditorTextRef = useRef<() => string>(() => "");

  const compatibleTests = CATALOG.filter((t) =>
    t.domaines.includes(domaine) &&
    (trancheAge === "" || t.population.includes(trancheAge))
  );

  const isSynthese = domaine === "synthese";

  function toggleTest(testId: string) {
    setSelectedTests((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId]
    );
  }

  function updateScore(
    key: string,
    field: keyof ScoreRow,
    value: string,
    row: Partial<ScoreRow>
  ) {
    setScores((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? row), [field]: value } as ScoreRow,
    }));
  }

  function handleDomaineChange(id: DomaineId) {
    setDomaine(id);
    setSelectedTests([]);
    setScores({});
    setOutput("");
    setError("");
  }

  function buildPayload(): ScoreEntry[] {
    return Object.values(scores)
      .filter((s) => s.percentile || s.note_standard)
      .map((s) => ({
        test_name: s.test_name,
        subtest_name: s.subtest_name,
        percentile: s.percentile ? Number(s.percentile) : null,
        note_standard: s.note_standard ? Number(s.note_standard) : null,
        qualification: s.qualification || null,
      }));
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await generateSection({
        domaine,
        observations,
        scores: buildPayload(),
        tranche_age: trancheAge,
        tests_utilises: selectedTests,
      });
      setOutput(res.texte_genere);
      setGenerationCount((n) => n + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    const text = getEditorTextRef.current();
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function renderScoreInputs(test: TestCatalog) {
    const subtests = test.subtests.filter((s) =>
      s.mesure !== "note_composite"
        ? true
        : test.domaines.includes(domaine)
    );
    return subtests.map((subtest) => {
      const key = buildScoreKey(test.id, subtest.id);
      const row = scores[key];
      const isPercentile =
        subtest.mesure === "percentile" || subtest.mesure === "score_t";

      return (
        <div
          key={key}
          className="grid gap-2 items-center py-1.5 border-b border-gray-100 last:border-0"
          style={{ gridTemplateColumns: "1fr 80px 80px 160px" }}
        >
          <span className="text-xs text-gray-600 truncate pr-2">
            {subtest.nom}
          </span>

          {/* Valeur numérique principale */}
          <input
            type="number"
            placeholder={isPercentile ? "Pc" : "NS"}
            className="border border-gray-300 rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={
              isPercentile
                ? (row?.percentile ?? "")
                : (row?.note_standard ?? "")
            }
            onChange={(e) =>
              updateScore(
                key,
                isPercentile ? "percentile" : "note_standard",
                e.target.value,
                {
                  test_name: test.nom,
                  subtest_name: subtest.nom,
                  mesure: subtest.mesure,
                }
              )
            }
          />

          {/* Champ libre complémentaire */}
          <input
            type="number"
            placeholder={isPercentile ? "NS" : "Pc"}
            className="border border-gray-300 rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={
              isPercentile
                ? (row?.note_standard ?? "")
                : (row?.percentile ?? "")
            }
            onChange={(e) =>
              updateScore(
                key,
                isPercentile ? "note_standard" : "percentile",
                e.target.value,
                {
                  test_name: test.nom,
                  subtest_name: subtest.nom,
                  mesure: subtest.mesure,
                }
              )
            }
          />

          {/* Qualification */}
          <select
            className="border border-gray-300 rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            value={row?.qualification ?? ""}
            onChange={(e) =>
              updateScore(key, "qualification", e.target.value, {
                test_name: test.nom,
                subtest_name: subtest.nom,
                mesure: subtest.mesure,
              })
            }
          >
            <option value="">—</option>
            {QUALIFICATIONS.map((q) => (
              <option key={q.value} value={q.value}>
                {q.label}
              </option>
            ))}
          </select>
        </div>
      );
    });
  }

  return (
    <div
      className="flex h-screen bg-gray-50 text-gray-900 antialiased"
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {/* ── Panneau gauche : saisie ── */}
      <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-6 space-y-5">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Bilan neuropsychologique
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Sélectionnez un domaine, saisissez les scores cotés, puis générez
              le bloc clinique.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Domaine + tranche d'âge */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Domaine
                </label>
                <select
                  value={domaine}
                  onChange={(e) =>
                    handleDomaineChange(e.target.value as DomaineId)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DOMAINES.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-36">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Population
                </label>
                <select
                  value={trancheAge}
                  onChange={(e) => {
                    setTrancheAge(e.target.value);
                    setSelectedTests([]);
                    setScores({});
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="adulte">Adulte</option>
                  <option value="adolescent">Adolescent</option>
                  <option value="enfant">Enfant</option>
                </select>
              </div>
            </div>

            {/* Sélection des tests + grille de scores (pas pour synthèse) */}
            {!isSynthese && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Sélecteur de tests */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Tests utilisés
                  </p>
                  {compatibleTests.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      Aucun test disponible pour cette combinaison
                      domaine/population.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {compatibleTests.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleTest(t.id)}
                          className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                            selectedTests.includes(t.id)
                              ? "bg-blue-50 border-blue-400 text-blue-700 font-medium"
                              : "bg-white border-gray-300 text-gray-500 hover:border-gray-400"
                          }`}
                        >
                          {t.nom}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Grille de scores */}
                {selectedTests.length > 0 && (
                  <div className="divide-y divide-gray-100">
                    {selectedTests.map((testId) => {
                      const test = CATALOG.find((t) => t.id === testId);
                      if (!test) return null;
                      return (
                        <div key={testId} className="px-4 py-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            {test.nom}
                          </p>
                          {/* En-têtes colonnes */}
                          <div
                            className="grid gap-2 mb-1"
                            style={{
                              gridTemplateColumns:
                                "1fr 80px 80px 160px",
                            }}
                          >
                            <span className="text-xs text-gray-400">
                              Sous-test
                            </span>
                            <span className="text-xs text-gray-400 text-center">
                              Pc / T
                            </span>
                            <span className="text-xs text-gray-400 text-center">
                              NS
                            </span>
                            <span className="text-xs text-gray-400">
                              Qualification
                            </span>
                          </div>
                          {renderScoreInputs(test)}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Observations */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {isSynthese
                  ? "Éléments des domaines déjà rédigés (collez vos blocs ici)"
                  : "Observations de séance"}
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder={
                  isSynthese
                    ? "Collez ici le texte des domaines déjà rédigés pour que l'IA génère la synthèse…"
                    : "Comportement observé, stratégies, fatigabilité, verbalisations, temps de passation…"
                }
                rows={isSynthese ? 10 : 5}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              />
              <p className="mt-1.5 flex items-start gap-1.5 text-xs text-orange-700">
                <span className="shrink-0 mt-px">⚠</span>
                <span>
                  Ne saisissez pas de données identifiantes (nom, date de
                  naissance, profession, lieu). Ces observations transitent
                  vers un service externe.
                </span>
              </p>
            </div>

            {/* Avertissement synthèse */}
            {isSynthese && (
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <span className="text-amber-500">⚠</span>
                <span>
                  <strong>Relecture indispensable.</strong> Ce texte est un
                  premier jet. L'hypothèse diagnostique finale vous appartient.
                </span>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              {loading ? "Génération en cours…" : "Générer le bloc ✦"}
            </button>
          </form>
        </div>
      </div>

      {/* ── Panneau droit : texte généré ── */}
      <div className="w-1/2 flex flex-col bg-gray-50">
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Bloc structuré
            </span>
            {output && !loading && (
              <span className="text-xs text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">
                éditable
              </span>
            )}
            {loading && (
              <span className="text-xs text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 animate-pulse">
                génération…
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output || loading}
            className="text-xs text-gray-500 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed border border-gray-300 hover:border-gray-400 disabled:border-gray-200 rounded-md px-3 py-1.5 transition-colors"
          >
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>

        <div className="flex-1 min-h-0 p-6">
          {output ? (
            <BlockEditor
              key={generationCount}
              generatedText={output}
              onCopy={(fn) => { getEditorTextRef.current = fn; }}
            />
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-lg bg-white">
              <p className="text-sm text-gray-400 text-center leading-relaxed px-8">
                {loading
                  ? "Génération en cours…"
                  : "Le bloc clinique apparaîtra ici.\nVous pourrez l'éditer directement avant de l'intégrer dans votre rapport."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
