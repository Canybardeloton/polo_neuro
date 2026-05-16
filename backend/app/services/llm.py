"""Génération de sections de bilans via Mistral."""

import json
from typing import Dict, List, Optional

from mistralai import Mistral

from app.config import settings
from app.services.prompts import PROMPT_MAP, REGLES_COMMUNES


def _build_scores_json(scores: List[Dict]) -> str:
    filtered = [
        {
            "test": s.get("test_name", ""),
            "subtest": s.get("subtest_name", ""),
            "percentile": s.get("percentile"),
            "note_standard": s.get("note_standard"),
            "qualification": s.get("qualification"),
            "score_brut": s.get("score_brut"),
        }
        for s in scores
        if s.get("percentile") is not None
        or s.get("note_standard") is not None
    ]
    return json.dumps(filtered, ensure_ascii=False, indent=2)


async def generate_section_text(
    domaine: str,
    scores: List[Dict],
    observations: str,
    tranche_age: str,
    tests_utilises: List[str],
    blocs_domaines: Optional[Dict] = None,
    motif: Optional[str] = None,
) -> str:
    if not settings.mistral_api_key:
        return (
            "Clé API Mistral non configurée. "
            "Renseignez MISTRAL_API_KEY dans .env."
        )

    prompt_template = PROMPT_MAP.get(domaine)
    if not prompt_template:
        return f"Domaine inconnu : {domaine}"

    scores_json = _build_scores_json(scores)

    if domaine == "synthese":
        prompt = prompt_template.format(
            blocs_domaines=blocs_domaines or "",
            contexte_patient=f"Tranche d'âge : {tranche_age}",
            motif=motif or "",
        )
    else:
        tests_str = (
            ", ".join(tests_utilises)
            if tests_utilises
            else "non précisé"
        )
        prompt = prompt_template.format(
            scores_json=scores_json,
            observations=(
                observations or "Aucune observation fournie."
            ),
            tranche_age=tranche_age,
            tests_utilises=tests_str,
        )

    client = Mistral(api_key=settings.mistral_api_key)
    response = client.chat.complete(
        model=settings.llm_model,
        messages=[
            {"role": "system", "content": REGLES_COMMUNES},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=1500,
    )
    return (response.choices[0].message.content or "").strip()
