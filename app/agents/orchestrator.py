"""Orchestrator agent for workflow management."""

from typing import Dict, Any
from app.models.schemas import WorkflowState, MarketingBrief
from app.utils.validation import validate_brief
from app.utils.logging import log_step
import logging


def validate_brief_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate the marketing brief.
    
    This is the entry point of the workflow.
    """
    logger = logging.getLogger(f"marketing_system.{state['run_id']}")
    log_step(logger, "Brief Validation", "started")
    
    try:
        # Extract brief data
        brief_data = state.get('brief')
        
        if not brief_data:
            return {
                **state,
                "status": "failed",
                "errors": state.get("errors", []) + ["No brief provided"]
            }
        
        # Convert to dict if it's a Pydantic model
        if hasattr(brief_data, 'model_dump'):
            brief_dict = brief_data.model_dump()
        else:
            brief_dict = brief_data
        
        # Validate
        is_valid, errors = validate_brief(brief_dict)
        
        if not is_valid:
            log_step(logger, "Brief Validation", "failed")
            return {
                **state,
                "status": "failed",
                "errors": state.get("errors", []) + errors
            }
        
        # Create validated brief model
        validated_brief = MarketingBrief(**brief_dict)
        
        log_step(logger, "Brief Validation", "completed")
        logger.info(f"Topic: {validated_brief.topic}")
        logger.info(f"Goal: {validated_brief.campaign_goal}")
        
        return {
            **state,
            "brief": validated_brief,
            "status": "brief_validated"
        }
        
    except Exception as e:
        log_step(logger, "Brief Validation", f"error: {str(e)}")
        return {
            **state,
            "status": "failed",
            "errors": state.get("errors", []) + [f"Validation error: {str(e)}"]
        }
