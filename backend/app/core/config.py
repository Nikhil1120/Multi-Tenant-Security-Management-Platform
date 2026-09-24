from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./deep_trace.db"
    secret_key: str = "dev-secret-change-in-production"
    access_token_expire_minutes: int = 60
    cors_origins: str = "http://localhost:5173"
    seed_database: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
