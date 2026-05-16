# polo_neuro

Outil d'aide à la rédaction de bilans neuropsychologiques. Le praticien saisit les scores cotés et ses observations de séance ; l'IA génère un bloc clinique structuré, éditable avant copie dans le rapport.

## Principes non négociables

- **Aucune donnée patient n'est envoyée au LLM** — seuls les scores numériques et observations partent à l'API Mistral.
- **L'IA ne génère aucun chiffre qu'elle n'a pas reçu.** Zéro inférence de score.
- **Toute affirmation clinique est modalisée** : "semble", "suggère", "est en faveur de". Le prompt système l'impose.
- **Tout reste local** — pas de base de données, pas de serveur tiers, pas de stockage patient.

## Stack

- **Backend** : FastAPI · Python 3.9 · mistralai SDK
- **Frontend** : React · TypeScript · Vite · Tailwind CSS

## Prérequis

- Python 3.9+
- Node.js 18+
- Clé API Mistral ([console.mistral.ai](https://console.mistral.ai))

## Installation

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows : .venv\Scripts\activate
pip install -r requirements.txt
```

Créer un fichier `backend/.env` :

```env
MISTRAL_API_KEY=sk-...
LLM_MODEL=mistral-small-latest
```

### Frontend

```bash
cd frontend
npm install
```

## Lancement

```bash
# Terminal 1 — API
cd backend
.venv/bin/uvicorn app.main:app --reload
# → http://localhost:8000  |  docs : http://localhost:8000/docs

# Terminal 2 — UI
cd frontend
npm run dev
# → http://localhost:5173
```

## Utilisation

1. **Choisir un domaine** parmi : Efficience intellectuelle · Fonctions attentionnelles · Fonctions exécutives · Mémoire de travail · Questionnaires comportementaux · Synthèse.
2. **Sélectionner la population** (adulte / adolescent / enfant) — filtre les tests compatibles.
3. **Activer les tests utilisés** (ex. WAIS-IV, TAP) — la grille de scores correspondante apparaît.
4. **Saisir les scores cotés** : percentile, note standard et/ou qualification pour chaque sous-test.
5. **Ajouter des observations** de séance (comportement, stratégies, fatigabilité…).
6. **Générer** — le bloc clinique apparaît à droite, directement éditable.
7. **Copier** dans le rapport.

### Exemple — WAIS-IV / Efficience intellectuelle

| Sous-test | NS  | Qualification      |
| --------- | --- | ------------------ |
| IVC       | 105 | Moyenne            |
| IVS       | 82  | Fragile / Limite   |
| IMT       | 74  | Inférieur          |
| IVT       | 68  | Très inférieur     |
| QIT       | 85  | Moyenne inférieure |

Observations : *"Ralentissement notable sur les épreuves chronométrées, stratégies verbales spontanées pour compenser les difficultés visuospatiales."*

→ Le modèle génère un paragraphe mentionnant l'hétérogénéité du profil (IVC 105 vs IVT 68) sans jamais inférer de diagnostic.

## Tests supportés

| Test                | Population          | Domaines                                        |
| ------------------- | ------------------- | ----------------------------------------------- |
| WAIS-IV             | Adulte              | QI, Attention, Mémoire de travail               |
| WISC-V              | Enfant, Adolescent  | QI, Mémoire de travail                          |
| TAP 2.3             | Adulte, Adolescent  | Attention, Fonctions exec., Mémoire de travail  |
| NEPSY-II            | Enfant, Adolescent  | Attention, Fonctions exécutives                 |
| D2-R                | Adulte, Adolescent  | Attention                                       |
| BRIEF-A             | Adulte              | Questionnaires                                  |
| Échelles Brown EF/A | Enfant, Adolescent  | Questionnaires                                  |
| RCMAS               | Enfant              | Questionnaires                                  |

## Variables d'environnement

| Variable          | Description     | Défaut                 |
| ----------------- | --------------- | ---------------------- |
| `MISTRAL_API_KEY` | Clé API Mistral | — (obligatoire)        |
| `LLM_MODEL`       | Modèle Mistral  | `mistral-small-latest` |

## Structure du projet

```
polo_neuro/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI + CORS
│   │   ├── config.py            # Settings (pydantic-settings)
│   │   ├── routers/
│   │   │   └── generate.py      # POST /generate
│   │   └── services/
│   │       ├── llm.py           # Client Mistral, temperature=0.3
│   │       └── prompts.py       # 6 prompts par domaine cognitif
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── neuropsyTests.ts    # Liste de tests (existant)
│   │   │   └── neuropsyCatalog.ts  # Catalogue structuré (subtests, mesures)
│   │   ├── lib/
│   │   │   └── api.ts           # generateSection()
│   │   └── pages/
│   │       └── BlocPage.tsx     # Page principale
│   └── package.json
└── README.md
```

## Sécurité et RGPD

- La clé API Mistral reste dans `backend/.env`, jamais en base ni dans le code.
- Seuls les **scores numériques** et les **observations textuelles** saisies par le praticien partent vers l'API Mistral — aucun nom, prénom ou date de naissance.
- Aucune donnée n'est persistée côté serveur : l'application est sans état.
- Usage professionnel : le praticien reste responsable de tout texte généré avant de l'intégrer dans un rapport clinique.
