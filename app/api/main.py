"""FastAPI server entry point."""

import uvicorn
from pathlib import Path


def start_server(
    host: str = "127.0.0.1",
    port: int = 8000,
    reload: bool = False,
    log_level: str = "info"
):
    """
    Start the FastAPI server.
    
    Args:
        host: Host to bind to
        port: Port to listen on
        reload: Enable auto-reload
        log_level: Logging level
    """
    # Get the project root
    project_root = Path(__file__).parent.parent.parent
    
    # Configure uvicorn
    config = uvicorn.Config(
        "app.api:app",
        host=host,
        port=port,
        reload=reload,
        log_level=log_level,
        cwd=str(project_root),
    )
    
    server = uvicorn.Server(config)
    
    print(f"""
🚀 Starting Multi-Agent Marketing System API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   
   Server: http://{host}:{port}
   API Docs: http://{host}:{port}/docs
   ReDoc: http://{host}:{port}/redoc
   Health: http://{host}:{port}/health
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Press Ctrl+C to stop
""")
    
    server.run()


if __name__ == "__main__":
    start_server()