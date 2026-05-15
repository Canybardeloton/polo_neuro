# Bilan Neuropsycho — MVP

Application web pour générer des bilans neuropsychologiques à partir de notes brutes et cotations, avec aide à la rédaction par LLM.

## Stack

- **Backend** : FastAPI, SQLite, SQLAlchemy, OpenAI (LLM)
- **Frontend** : React (TypeScript), Vite, Shadcn UI

## Prérequis

- Python 3.9+
- Node.js 18+
- Clé API OpenAI (pour la génération anamnèse / conclusions)

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Éditer .env et renseigner OPENAI_API_KEY
```

### Frontend

```bash
cd frontend
npm install
```

## Lancement

### 1. Démarrer l’API

Depuis la racine du projet :

```bash
cd backend
uvicorn app.main:app --reload
```

L’API est disponible sur `http://localhost:8000`. Docs : `http://localhost:8000/docs`.

### 2. Démarrer le frontend

Dans un autre terminal :

```bash
cd frontend
npm run dev
```

Ouvrir `http://localhost:5173`.

### Variables d’environnement (backend)

| Variable         | Description                          | Défaut              |
|-----------------|--------------------------------------|---------------------|
| `DATABASE_URL`  | URL SQLite                           | `sqlite:///./app/data/bilan.db` |
| `OPENAI_API_KEY`| Clé API OpenAI                       | — (obligatoire pour LLM) |
| `LLM_MODEL`     | Modèle utilisé (ex. gpt-4o-mini)     | `gpt-4o-mini`       |

Le fichier `.env` doit se trouver dans le dossier `backend/`.

## Utilisation

1. **Patients** : créer des patients (nom, prénom, date de naissance, tranche d’âge).
2. **Bilans** : pour chaque patient, créer un bilan et renseigner pathologie / motif.
3. **Anamnèse** : saisir les notes brutes, puis cliquer sur « Générer anamnèse (LLM) » pour obtenir un paragraphe structuré (éditable).
4. **Tests & cotations** : ajouter des tests (ex. WAIS, NEPSY selon l’âge), renseigner scores brut et standard ; l’interprétation peut être remplie automatiquement si des normes sont définies.
5. **Conclusions** : rédiger ou générer avec « Générer conclusions (LLM) » à partir des tests et de l’anamnèse.
6. **Aperçu** : consulter le bilan complet avant export (PDF à prévoir ultérieurement).

## Structure du projet

```
Polo/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py, database.py
│   │   ├── models/      # Patient, Bilan, Test
│   │   ├── schemas/
│   │   ├── routers/     # patients, bilans, llm, normes
│   │   ├── services/    # cotation, llm
│   │   └── data/normes/ # JSON de normes par test/âge
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/ui/  # Shadcn
│   │   ├── lib/api.ts
│   │   └── pages/
│   └── package.json
└── README.md
```

## Données de santé / RGPD

Les données restent stockées localement (SQLite). Les appels LLM envoient uniquement le texte saisi vers l’API OpenAI ; ne pas logger de données de santé côté fournisseur et respecter les bonnes pratiques RGPD pour un usage professionnel.
