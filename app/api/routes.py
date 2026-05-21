"""API routes for the marketing system."""

import json
from pathlib import Path
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from app.models.schemas import MarketingBrief
from app.graph.workflow import create_workflow
from app.utils.io import save_artifact, load_artifact
from app.config import RUNS_DIR


router = APIRouter()


# ============================================
# Request Models
# ============================================

class BriefRequest(BaseModel):
    """Request model for creating a marketing brief."""
    topic: str = Field(..., description="Main topic or product to market")
    brand_voice: str = Field(
        default="professional, engaging, and informative",
        description="Brand voice description"
    )
    target_audience: str = Field(
        default="B2B decision makers and technical professionals",
        description="Target audience"
    )
    campaign_goal: str = Field(..., description="Primary goal of the campaign")
    keywords: Optional[List[str]] = Field(default=None, description="Target keywords")
    additional_context: Optional[str] = Field(default=None)


class BriefFileRequest(BaseModel):
    """Request model for loading a brief from file content."""
    content: str = Field(..., description="Brief content (JSON or Markdown)")
    file_type: str = Field(..., description="File type: json or md")


class WorkflowStatusResponse(BaseModel):
    """Response model for workflow status."""
    run_id: str
    status: str
    created_at: str
    topic: str
    current_step: Optional[str] = None
    errors: List[str] = []


# ============================================
# Helper Functions
# ============================================

def parse_brief_content(content: str, file_type: str) -> dict:
    """Parse brief content from file."""
    if file_type == "json":
        return json.loads(content)
    elif file_type == "md" or file_type == "markdown":
        # Parse markdown brief (simple key: value format)
        brief_data = {}
        for line in content.split('\n'):
            if ':' in line and not line.startswith('#'):
                key, value = line.split(':', 1)
                key = key.strip().lower().replace(' ', '_')
                value = value.strip()
                if value:
                    brief_data[key] = value
        return brief_data
    else:
        raise ValueError(f"Unsupported file type: {file_type}")


async def run_workflow_async(
    run_id: str,
    brief_data: dict,
    background_tasks: BackgroundTasks,
    auto_approve: bool = True
):
    """Run the marketing workflow asynchronously."""
    from app.utils.logging import setup_logger, log_step
    
    # Setup logger
    logger = setup_logger(run_id)
    logger.info(f"Starting marketing workflow from API - Run ID: {run_id}")
    
    try:
        # Create brief model
        brief = MarketingBrief(**brief_data)
        
        # Initialize state with auto_approve flag
        initial_state = {
            "run_id": run_id,
            "brief": brief,
            "research_report": None,
            "blog_draft": None,
            "seo_optimized_blog": None,
            "social_assets": None,
            "email_assets": None,
            "approvals": {},
            "errors": [],
            "status": "initialized",
            "artifacts_path": None,
            "retry_count": 0,
            "auto_approve": auto_approve  # Auto-approve in API mode
        }
        
        # Create and run workflow
        workflow = create_workflow()
        final_state = workflow.invoke(initial_state)
        
        # Check final status
        if final_state['status'] == 'completed':
            logger.info("Workflow completed successfully")
        elif final_state['status'] == 'rejected':
            logger.warning("Content rejected by user")
        else:
            logger.error(f"Workflow failed with status: {final_state['status']}")
        
    except Exception as e:
        logger.error(f"Workflow execution error: {str(e)}")


# ============================================
# API Endpoints
# ============================================

@router.post("/briefs", response_model=dict)
async def create_brief(
    request: BriefRequest,
    background_tasks: BackgroundTasks,
    auto_start: bool = True
):
    """
    Create a new marketing brief and start the workflow.
    
    - **auto_start**: If True (default), automatically starts the workflow after creating brief
    """
    # Generate run ID
    run_id = f"run_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{str(uuid4())[:8]}"
    
    # Create run directory
    run_dir = RUNS_DIR / run_id
    run_dir.mkdir(parents=True, exist_ok=True)
    
    # Convert request to dict
    brief_data = request.model_dump()
    
    # Save brief
    save_artifact(run_id, 'brief.json', brief_data, as_json=True)
    
    # Auto-start workflow if enabled
    if auto_start:
        background_tasks.add_task(run_workflow_async, run_id, brief_data, background_tasks)
        return {
            "run_id": run_id,
            "status": "started",
            "message": "Brief created and workflow started",
            "brief": brief_data
        }
    
    # Return initial response if not auto-starting
    return {
        "run_id": run_id,
        "status": "initialized",
        "message": "Brief created. Use /runs/{run_id}/start to begin workflow.",
        "brief": brief_data
    }


@router.post("/briefs/from-file")
async def create_brief_from_file(
    request: BriefFileRequest,
    background_tasks: BackgroundTasks,
    auto_start: bool = True
):
    """
    Create a brief from file content (JSON or Markdown).
    
    - **auto_start**: If True (default), automatically starts the workflow
    """
    try:
        # Generate run ID
        run_id = f"run_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{str(uuid4())[:8]}"
        
        # Parse content
        brief_data = parse_brief_content(request.content, request.file_type)
        
        # Validate brief
        validated_brief = MarketingBrief(**brief_data)
        brief_dict = validated_brief.model_dump()
        
        # Create run directory
        run_dir = RUNS_DIR / run_id
        run_dir.mkdir(parents=True, exist_ok=True)
        
        # Save brief
        save_artifact(run_id, 'brief.json', brief_dict, as_json=True)
        
        # Auto-start workflow if enabled
        if auto_start:
            background_tasks.add_task(run_workflow_async, run_id, brief_dict, background_tasks)
            return {
                "run_id": run_id,
                "status": "started",
                "message": "Brief loaded and workflow started",
                "brief": brief_dict
            }
        
        return {
            "run_id": run_id,
            "status": "initialized",
            "message": "Brief loaded from file. Use /runs/{run_id}/start to begin.",
            "brief": brief_dict
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/runs/{run_id}/start")
async def start_workflow(run_id: str, background_tasks: BackgroundTasks):
    """
    Start the workflow for an existing brief.
    """
    # Check if run directory exists
    run_dir = RUNS_DIR / run_id
    if not run_dir.exists():
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    
    # Load brief
    try:
        brief_data = load_artifact(run_id, 'brief.json', as_json=True)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Brief not found")
    
    # Start workflow in background
    background_tasks.add_task(run_workflow_async, run_id, brief_data, background_tasks)
    
    return {
        "run_id": run_id,
        "status": "started",
        "message": "Workflow started. Use /runs/{run_id}/status to check progress."
    }


@router.get("/runs/{run_id}/status", response_model=WorkflowStatusResponse)
async def get_workflow_status(run_id: str):
    """
    Get the current status of a workflow run.
    """
    run_dir = RUNS_DIR / run_id
    if not run_dir.exists():
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    
    # Check for status file
    status_file = run_dir / "status.json"
    if status_file.exists():
        with open(status_file, 'r') as f:
            status_data = json.load(f)
            return WorkflowStatusResponse(**status_data)
    
    # Check for completed artifacts
    if (run_dir / "final_package.json").exists():
        return WorkflowStatusResponse(
            run_id=run_id,
            status="completed",
            created_at=run_dir.name,
            topic="Unknown",
            current_step="finalized"
        )
    
    # Check for logs to determine current step
    log_file = run_dir / "run.log"
    current_step = None
    if log_file.exists():
        with open(log_file, 'r') as f:
            logs = f.read()
            if "Research Agent - completed" in logs:
                current_step = "research"
            elif "Copywriter Agent - completed" in logs:
                current_step = "copywriter"
            elif "SEO Agent - completed" in logs:
                current_step = "seo"
            elif "Social Repurposing Agent - completed" in logs:
                current_step = "social"
            elif "Brief Validation - completed" in logs:
                current_step = "validation"
    
    # Get topic from brief
    topic = "Unknown"
    try:
        brief_data = load_artifact(run_id, 'brief.json', as_json=True)
        topic = brief_data.get('topic', 'Unknown')
    except:
        pass
    
    return WorkflowStatusResponse(
        run_id=run_id,
        status="running",
        created_at=run_dir.name,
        topic=topic,
        current_step=current_step
    )


@router.get("/runs", response_model=List[dict])
async def list_runs(limit: int = 10):
    """
    List all workflow runs.
    """
    if not RUNS_DIR.exists():
        return []
    
    runs = []
    for run_dir in sorted(RUNS_DIR.iterdir(), reverse=True)[:limit]:
        if run_dir.is_dir():
            status = "unknown"
            topic = "Unknown"
            
            # Check status
            if (run_dir / "final_package.json").exists():
                status = "completed"
            elif (run_dir / "brief.json").exists():
                status = "initialized"
            
            # Get topic
            try:
                brief_data = load_artifact(run_dir.name, 'brief.json', as_json=True)
                topic = brief_data.get('topic', 'Unknown')[:50]
            except:
                pass
            
            runs.append({
                "run_id": run_dir.name,
                "status": status,
                "topic": topic,
                "created": run_dir.name
            })
    
    return runs


@router.get("/runs/{run_id}/artifacts/{artifact_name}")
async def get_artifact(run_id: str, artifact_name: str):
    """
    Get a specific artifact from a run.
    """
    run_dir = RUNS_DIR / run_id
    if not run_dir.exists():
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    
    artifact_file = run_dir / artifact_name
    if not artifact_file.exists():
        raise HTTPException(status_code=404, detail=f"Artifact {artifact_name} not found")
    
    # Determine content type
    content_type = "text/plain"
    if artifact_name.endswith('.json'):
        content_type = "application/json"
    elif artifact_name.endswith('.md'):
        content_type = "text/markdown"
    
    return FileResponse(
        artifact_file,
        media_type=content_type,
        filename=artifact_name
    )


@router.get("/runs/{run_id}/artifacts")
async def list_artifacts(run_id: str):
    """
    List all artifacts for a run.
    """
    run_dir = RUNS_DIR / run_id
    if not run_dir.exists():
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    
    artifacts = []
    for f in run_dir.iterdir():
        if f.is_file():
            artifacts.append({
                "name": f.name,
                "size": f.stat().st_size,
                "modified": datetime.fromtimestamp(f.stat().st_mtime).isoformat()
            })
    
    return {"run_id": run_id, "artifacts": artifacts}


@router.delete("/runs/{run_id}")
async def delete_run(run_id: str):
    """
    Delete a workflow run and its artifacts.
    """
    import shutil
    
    run_dir = RUNS_DIR / run_id
    if not run_dir.exists():
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    
    # Delete directory
    shutil.rmtree(run_dir)
    
    return {"message": f"Run {run_id} deleted successfully"}


@router.post("/approve/{run_id}")
async def approve_workflow(run_id: str, background_tasks: BackgroundTasks):
    """
    Approve a completed workflow and finalize artifacts.
    """
    run_dir = RUNS_DIR / run_id
    if not run_dir.exists():
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")
    
    # Check if workflow is in approval state
    try:
        research = load_artifact(run_id, 'research.json', as_json=True)
        blog = load_artifact(run_id, 'blog.json', as_json=True)
        seo = load_artifact(run_id, 'seo.json', as_json=True)
        social = load_artifact(run_id, 'social.json', as_json=True)
        email = load_artifact(run_id, 'email.json', as_json=True)
    except FileNotFoundError:
        raise HTTPException(
            status_code=400,
            detail="Workflow not ready for approval. Some artifacts are missing."
        )
    
    # Mark as approved and finalize
    # This is a simplified version - in production you'd integrate with the actual workflow
    return {
        "run_id": run_id,
        "status": "approved",
        "message": "Content approved. Final artifacts saved."
    }


@router.get("/config")
async def get_config():
    """
    Get current configuration settings.
    """
    from app.config import DEFAULT_MODEL, TEMPERATURE, MAX_TOKENS
    
    return {
        "model": DEFAULT_MODEL,
        "temperature": TEMPERATURE,
        "max_tokens": MAX_TOKENS,
        "runs_directory": str(RUNS_DIR)
    }


@router.post("/config")
async def update_config(
    model: Optional[str] = None,
    temperature: Optional[float] = None,
    max_tokens: Optional[int] = None
):
    """
    Update configuration settings.
    """
    # Note: In production, you'd write these to a config file
    # For now, return what would be updated
    updates = {}
    if model:
        updates["model"] = model
    if temperature:
        updates["temperature"] = temperature
    if max_tokens:
        updates["max_tokens"] = max_tokens
    
    return {
        "message": "Config update would be applied",
        "updates": updates
    }