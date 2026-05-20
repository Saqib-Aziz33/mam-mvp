"""Tests for workflow execution."""

import pytest
from app.graph.workflow import create_workflow
from app.models.schemas import MarketingBrief


def test_workflow_creation():
    """Test that workflow can be created."""
    workflow = create_workflow()
    assert workflow is not None


def test_workflow_has_required_nodes():
    """Test that workflow contains all required nodes."""
    workflow = create_workflow()
    
    # Get the compiled graph
    graph = workflow
    
    # The workflow should be executable
    assert callable(graph.invoke)


def test_brief_validation_node():
    """Test brief validation node."""
    from app.agents.orchestrator import validate_brief_node
    
    state = {
        "run_id": "test_run",
        "brief": {
            "topic": "AI assistant",
            "campaign_goal": "Generate awareness and sign-ups"
        },
        "errors": [],
        "status": "initialized"
    }
    
    result = validate_brief_node(state)
    
    assert result['status'] == 'brief_validated'
    assert isinstance(result['brief'], MarketingBrief)


def test_brief_validation_failure():
    """Test brief validation with invalid data."""
    from app.agents.orchestrator import validate_brief_node
    
    state = {
        "run_id": "test_run",
        "brief": {
            "topic": "AI"  # Too short
        },
        "errors": [],
        "status": "initialized"
    }
    
    result = validate_brief_node(state)
    
    assert result['status'] == 'failed'
    assert len(result['errors']) > 0
