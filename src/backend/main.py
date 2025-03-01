from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from src.backend.routes import router  # Adjust import path if needed
import uvicorn
import os

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to specific frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

# Define absolute path for frontend directory
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend"))

# Ensure frontend directory exists
if not os.path.exists(BASE_DIR):
    raise RuntimeError(f"Frontend directory not found: {BASE_DIR}")

# Mount static files
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# Serve the index.html file at root "/"
@app.get("/")
async def serve_index():
    index_path = os.path.join(BASE_DIR, "index.html")
    if not os.path.exists(index_path):
        return {"error": "index.html not found in frontend directory"}
    return FileResponse(index_path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
