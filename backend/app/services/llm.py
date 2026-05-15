"""Génération de blocs de compte rendu neuropsychologique."""

from openai import OpenAI

from app.config import settings

MISTRAL_BASE_URL = "https://api.mistral.ai/v1"

SYSTEM_BLOC_NEUROPSY = (
    "Tu es un assistant de rédaction en neuropsychologie clinique.\n"
    "Ta tâche est de transformer des notes brutes de clinicien en un texte\n"
    "structuré, clair, académique et neutre, destiné à être intégré dans un\n"
    "compte rendu neuropsychologique.\n\n"
    "Tu ne dois jamais :\n"
    "- poser de diagnostic\n"
    "- ajouter d'informations non présentes dans les notes\n"
    "- interpréter au-delà des données fournies\n\n"
    "Tu dois uniquement :\n"
    "- reformuler de manière clinique\n"
    "- structurer le contenu\n"
    "- standardiser le langage professionnel\n\n"
    "Le style attendu est : académique, objectif,"
    " synthétique, professionnel."
)


def build_user_prompt_bloc(test: str, notes: str) -> str:
    return (
        "Rédige un bloc de compte rendu neuropsychologique structuré"
        " à partir des éléments suivants.\n\n"
        f"Test réalisé :\n{test}\n\n"
        f"Notes brutes du clinicien :\n{notes}\n\n"
        "Consignes de sortie :\n"
        "- Produire un texte structuré en 4 sections obligatoires :\n"
        "1. Description du test\n"
        "   (objectif du test + domaine cognitif évalué)\n"
        "2. Conditions de passation / observations comportementales\n"
        "   (uniquement les éléments présents dans les notes)\n"
        "3. Résultats\n"
        "   (reformulation des performances, sans interprétation ajoutée)\n"
        "4. Analyse clinique\n"
        "   (interprétation limitée aux éléments fournis,"
        " formulation prudente)\n\n"
        "Contraintes importantes :\n"
        "- Ne jamais ajouter de scores ou normes non fournis\n"
        "- Ne jamais inférer un diagnostic\n"
        "- Ne jamais inventer de résultats\n"
        "- Utiliser un langage neuropsychologique professionnel\n"
        "- Rester concis et intégrable dans un rapport clinique\n\n"
        "Style : neutre, académique, structuré, sans phrases inutiles."
    )


def generate_bloc_compte_rendu(test: str, notes: str) -> str:
    """Appelle Mistral pour produire le bloc structuré (4 sections)."""
    if not settings.mistral_api_key:
        return (
            "Clé API Mistral non configurée. "
            "Renseignez MISTRAL_API_KEY dans le fichier .env."
        )

    client = OpenAI(
        base_url=MISTRAL_BASE_URL,
        api_key=settings.mistral_api_key,
    )

    test_val = test.strip() or "(non précisé)"
    notes_val = notes.strip() or "(aucune note)"
    user_content = build_user_prompt_bloc(test_val, notes_val)

    try:
        resp = client.chat.completions.create(
            model=settings.llm_model,
            messages=[
                {"role": "system", "content": SYSTEM_BLOC_NEUROPSY},
                {"role": "user", "content": user_content[:14000]},
            ],
            max_tokens=2048,
            temperature=0.3,
        )
        return (resp.choices[0].message.content or "").strip()
    except Exception as e:
        return f"Erreur lors de l'appel au modèle : {e!s}"
