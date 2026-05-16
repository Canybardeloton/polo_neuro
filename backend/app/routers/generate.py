from typing import Dict, List, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.llm import generate_section_text

router = APIRouter()


class GenerateRequest(BaseModel):
    domaine: str
    observations: str = ""
    scores: List[Dict] = []
    tranche_age: str = "adulte"
    tests_utilises: List[str] = []
    blocs_domaines: Optional[Dict] = None
    motif: Optional[str] = None


class GenerateResponse(BaseModel):
    texte_genere: str
    scores_source: List[Dict]
    domaine: str


@router.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest) -> GenerateResponse:
    texte = await generate_section_text(
        domaine=req.domaine,
        scores=req.scores,
        observations=req.observations,
        tranche_age=req.tranche_age,
        tests_utilises=req.tests_utilises,
        blocs_domaines=req.blocs_domaines,
        motif=req.motif,
    )
    return GenerateResponse(
        texte_genere=texte,
        scores_source=req.scores,
        domaine=req.domaine,
    )
