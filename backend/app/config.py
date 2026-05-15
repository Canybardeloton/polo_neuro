from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mistral_api_key: str = ""
    llm_model: str = "mistral-small-latest"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
