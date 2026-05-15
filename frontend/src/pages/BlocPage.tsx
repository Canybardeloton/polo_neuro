import { useState } from "react";
import { generateBloc } from "@/lib/api";
import { NEUROPSY_TESTS } from "@/data/neuropsyTests";

const NOTES_PLACEHOLDER =
  "Notes brutes de passation : comportement, stratégies, temps, erreurs, fatigabilité, remarques du patient…\n\nNe pas inventer de scores ou normes non observés.";

export function BlocPage() {
  const [test, setTest] = useState("");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!test.trim()) {
      setOutput("Sélectionnez un test dans le menu déroulant.");
      return;
    }
    setLoading(true);
    try {
      const { text } = await generateBloc(test, notes);
      setOutput(text);
    } catch (err) {
      setOutput(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 antialiased" style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* ── Left panel : inputs ── */}
      <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-1 min-h-0 p-8 gap-6">

          <div>
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">
              Compte rendu neuropsychologique
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Sélectionnez un test, saisissez vos notes brutes, puis générez le bloc structuré.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 gap-5">

            {/* Test selector */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="test" className="text-sm font-medium text-gray-700">
                Test neuropsychologique
              </label>
              <select
                id="test"
                value={test}
                onChange={(e) => setTest(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">— Choisir un test —</option>
                {NEUROPSY_TESTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Notes textarea — grows to fill remaining height */}
            <div className="flex flex-col flex-1 min-h-0 gap-1.5">
              <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes brutes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={NOTES_PLACEHOLDER}
                className="flex-1 min-h-0 border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors duration-150"
            >
              {loading ? "Génération en cours…" : "Générer le bloc"}
            </button>

          </form>
        </div>
      </div>

      {/* ── Right panel : editable output editor ── */}
      <div className="w-1/2 flex flex-col bg-gray-50">

        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Bloc structuré</span>
            {output && !loading && (
              <span className="text-xs text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">éditable</span>
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
            className="text-xs text-gray-500 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed border border-gray-300 hover:border-gray-400 disabled:border-gray-200 rounded-md px-3 py-1.5 transition-colors duration-150"
          >
            {copied ? "Copié !" : "Copier"}
          </button>
        </div>

        {/* Text editor area */}
        <div className="flex-1 min-h-0 p-6">
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            disabled={loading}
            placeholder="Le bloc structuré apparaîtra ici.&#10;&#10;Vous pourrez éditer le texte directement avant de l'intégrer dans votre rapport."
            className="w-full h-full border border-gray-200 rounded-lg p-5 text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed placeholder:text-gray-400"
          />
        </div>

      </div>
    </div>
  );
}
