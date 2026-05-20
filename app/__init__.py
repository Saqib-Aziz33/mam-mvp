"""Multi-agent marketing system for Fastbase."""

__version__ = "0.1.0"

# Import API app for direct server startup
from app.api import app as api_app

__all__ = ["api_app", "__version__"]
