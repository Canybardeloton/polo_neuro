export type Mesure = "percentile" | "note_standard" | "note_composite" | "score_t";

export interface Subtest {
  id: string;
  nom: string;
  mesure: Mesure;
}

export interface TestCatalog {
  id: string;
  nom: string;
  population: string[];
  domaines: string[];
  subtests: Subtest[];
}

export const CATALOG: TestCatalog[] = [
  {
    id: "wais_iv",
    nom: "WAIS-IV",
    population: ["adulte"],
    domaines: ["qi", "attention", "memoire_travail"],
    subtests: [
      { id: "ivc", nom: "IVC – Compréhension Verbale", mesure: "note_composite" },
      { id: "ivs", nom: "IVS – Visuospatial", mesure: "note_composite" },
      { id: "irt", nom: "IRT – Raisonnement Fluide", mesure: "note_composite" },
      { id: "imt", nom: "IMT – Mémoire de Travail", mesure: "note_composite" },
      { id: "ivt", nom: "IVT – Vitesse de Traitement", mesure: "note_composite" },
      { id: "qi_total", nom: "QIT – Quotient Total", mesure: "note_composite" },
      { id: "similitudes", nom: "Similitudes", mesure: "note_standard" },
      { id: "vocabulaire", nom: "Vocabulaire", mesure: "note_standard" },
      { id: "matrices", nom: "Matrices", mesure: "note_standard" },
      { id: "cubes", nom: "Cubes", mesure: "note_standard" },
      { id: "memoire_chiffres", nom: "Mémoire des Chiffres", mesure: "note_standard" },
      { id: "arithmetique", nom: "Arithmétique", mesure: "note_standard" },
      { id: "code", nom: "Code", mesure: "note_standard" },
      { id: "symboles", nom: "Symboles", mesure: "note_standard" },
    ],
  },
  {
    id: "wisc_v",
    nom: "WISC-V",
    population: ["enfant", "adolescent"],
    domaines: ["qi", "memoire_travail"],
    subtests: [
      { id: "icv", nom: "ICV – Compréhension Verbale", mesure: "note_composite" },
      { id: "ivs", nom: "IVS – Visuospatial", mesure: "note_composite" },
      { id: "irf", nom: "IRF – Raisonnement Fluide", mesure: "note_composite" },
      { id: "imt", nom: "IMT – Mémoire de Travail", mesure: "note_composite" },
      { id: "ivt", nom: "IVT – Vitesse de Traitement", mesure: "note_composite" },
      { id: "qit", nom: "QIT – Quotient Total", mesure: "note_composite" },
    ],
  },
  {
    id: "tap",
    nom: "TAP 2.3",
    population: ["adulte", "adolescent"],
    domaines: ["attention", "fonctions_exec", "memoire_travail"],
    subtests: [
      { id: "alerte_phasique", nom: "Alerte phasique", mesure: "percentile" },
      { id: "attention_soutenue", nom: "Attention soutenue", mesure: "percentile" },
      { id: "attention_selective", nom: "Attention sélective", mesure: "percentile" },
      { id: "attention_divisee", nom: "Attention divisée", mesure: "percentile" },
      { id: "flexibilite", nom: "Flexibilité", mesure: "percentile" },
      { id: "go_nogo", nom: "Go/NoGo", mesure: "percentile" },
      { id: "mt_tap", nom: "Mémoire de travail (TAP)", mesure: "percentile" },
    ],
  },
  {
    id: "nepsy_ii",
    nom: "NEPSY-II",
    population: ["enfant", "adolescent"],
    domaines: ["attention", "fonctions_exec"],
    subtests: [
      { id: "att_auditive", nom: "Attention auditive", mesure: "note_standard" },
      { id: "inhibition", nom: "Inhibition", mesure: "note_standard" },
      { id: "categorisation", nom: "Catégorisation", mesure: "note_standard" },
      { id: "fluidite_dessins", nom: "Fluidité de dessins", mesure: "note_standard" },
      { id: "comprehension", nom: "Compréhension de consignes", mesure: "note_standard" },
    ],
  },
  {
    id: "d2r",
    nom: "D2-R",
    population: ["adolescent", "adulte"],
    domaines: ["attention"],
    subtests: [
      { id: "cct", nom: "CCT – Capacité de concentration", mesure: "percentile" },
      { id: "exactitude", nom: "Exactitude", mesure: "percentile" },
      { id: "rythme", nom: "Rythme de traitement", mesure: "percentile" },
    ],
  },
  {
    id: "brief_a",
    nom: "BRIEF-A",
    population: ["adulte"],
    domaines: ["questionnaires"],
    subtests: [
      { id: "inhibition", nom: "Inhibition", mesure: "score_t" },
      { id: "flexibilite", nom: "Flexibilité", mesure: "score_t" },
      { id: "controle_emotionnel", nom: "Contrôle émotionnel", mesure: "score_t" },
      { id: "irc", nom: "IRC – Indice Régulation Comportementale", mesure: "score_t" },
      { id: "initiation", nom: "Initiation", mesure: "score_t" },
      { id: "mt_brief", nom: "Mémoire de travail", mesure: "score_t" },
      { id: "planification", nom: "Planification/Organisation", mesure: "score_t" },
      { id: "im", nom: "IM – Indice Métacognition", mesure: "score_t" },
      { id: "ceg", nom: "CEG – Score Composite Global", mesure: "score_t" },
    ],
  },
  {
    id: "brown_efa",
    nom: "Échelles Brown EF/A",
    population: ["enfant", "adolescent"],
    domaines: ["questionnaires"],
    subtests: [
      { id: "activation", nom: "Activation", mesure: "score_t" },
      { id: "focus", nom: "Focus", mesure: "score_t" },
      { id: "effort", nom: "Effort", mesure: "score_t" },
      { id: "emotion", nom: "Émotion", mesure: "score_t" },
      { id: "memoire", nom: "Mémoire", mesure: "score_t" },
      { id: "action", nom: "Action", mesure: "score_t" },
      { id: "note_totale", nom: "Note totale", mesure: "score_t" },
    ],
  },
  {
    id: "rcmas",
    nom: "RCMAS",
    population: ["enfant"],
    domaines: ["questionnaires"],
    subtests: [
      { id: "anxiete_totale", nom: "Note totale d'anxiété", mesure: "score_t" },
      { id: "anxiete_physio", nom: "Anxiété physiologique", mesure: "note_standard" },
      { id: "inquietude", nom: "Inquiétude/Hypersensibilité", mesure: "note_standard" },
      { id: "social", nom: "Préoccupations sociales", mesure: "note_standard" },
    ],
  },
];

export const DOMAINES = [
  { id: "qi", label: "Efficience intellectuelle" },
  { id: "attention", label: "Fonctions attentionnelles" },
  { id: "fonctions_exec", label: "Fonctions exécutives" },
  { id: "memoire_travail", label: "Mémoire de travail" },
  { id: "questionnaires", label: "Questionnaires comportementaux" },
  { id: "synthese", label: "Synthèse et conclusion" },
] as const;

export const QUALIFICATIONS = [
  { value: "tres_inferieur", label: "Très inférieur (trouble ***)" },
  { value: "inferieur", label: "Inférieur (difficulté **)" },
  { value: "fragile", label: "Fragile / Limite (*)" },
  { value: "moyenne_inferieure", label: "Moyenne inférieure" },
  { value: "moyenne", label: "Moyenne" },
  { value: "moyenne_superieure", label: "Moyenne supérieure" },
  { value: "superieur", label: "Supérieur" },
  { value: "tres_superieur", label: "Très supérieur" },
];
