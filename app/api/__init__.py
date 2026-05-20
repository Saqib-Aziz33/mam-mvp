"""FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.api.websockets import router as ws_router

# Create FastAPI app
app = FastAPI(
    title="Multi-Agent Marketing System API",
    description="API for the AI-powered marketing content generation system",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(router, prefix="/api/v1", tags=["marketing"])
app.include_router(ws_router, tags=["websockets"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Multi-Agent Marketing System API",
        "version": "0.1.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}