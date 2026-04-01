from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

from pathlib import Path

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

# ==========================================================
# CORS
# ==========================================================
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",

    # ✅ produção (Cloudflare)
    "https://dashboard.smartsenseia.org",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# API
# ==========================================================
app.include_router(api_router, prefix=settings.API_V1_STR)

# ==========================================================
# Startup
# ==========================================================
@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Banco de Dados inicializado com sucesso.")
    except Exception as e:
        print(f"⚠️ Erro ao conectar no DB durante o startup: {e}")

# ==========================================================
# Frontend React (PROD)
# ==========================================================
APP_DIR = Path(__file__).resolve().parent
FASTAPI_DIR = APP_DIR.parent
PROJECT_DIR = FASTAPI_DIR.parent

FRONTEND_DIST = PROJECT_DIR / "REACT" / "frontend" / "dist"
print(f"🔎 Procurando React build em: {FRONTEND_DIST}")

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    ico = FRONTEND_DIST / "favicon.ico"
    if ico.is_file():
        return FileResponse(ico, media_type="image/x-icon")
    return Response(status_code=204)

assets_dir = FRONTEND_DIST / "assets"
if assets_dir.is_dir():
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
else:
    print("⚠️ Pasta assets não encontrada (ok em dev).")

@app.get("/", include_in_schema=False)
async def serve_index():
    index = FRONTEND_DIST / "index.html"
    if index.is_file():
        return FileResponse(index)
    return Response(content="React build não encontrado. Rode: npm run build", status_code=404)

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_react(full_path: str):
    index = FRONTEND_DIST / "index.html"
    if index.is_file():
        return FileResponse(index)
    return Response(status_code=404)
