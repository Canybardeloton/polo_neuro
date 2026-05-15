from pydantic import BaseModel, Field

from fastapi import APIRouter

from app.services.llm import generate_bloc_compte_rendu

router = APIRouter()


class GenerateBlocRequest(BaseModel):
    test: str = Field(
        ...,
        description="Nom du test neuropsychologique sélectionné",
    )
    notes: str = Field(
        default="",
        description="Notes brutes du clinicien",
    )


class GenerateBlocResponse(BaseModel):
    text: str


@router.post("/generate-bloc", response_model=GenerateBlocResponse)
def post_generate_bloc(body: GenerateBlocRequest) -> GenerateBlocResponse:
    text = generate_bloc_compte_rendu(body.test, body.notes)
    return GenerateBlocResponse(text=text)
