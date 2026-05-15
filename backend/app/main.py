from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import generate

app = FastAPI(
    title="Bilan Neuropsycho API",
    description="Génération de blocs de compte rendu neuropsychologique à partir d'un test et de notes brutes.",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router, tags=["génération"])
