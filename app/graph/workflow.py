"""LangGraph workflow definition."""

from typing import Dict, Any
from langgraph.graph import StateGraph, END
from app.graph.state import GraphState
from app.agents import (
    validate_brief_node,
    research_agent_node,
    copywriter_agent_node,
    seo_agent_node,
    social_repurposing_agent_node
)
from app.utils.output_formatters import (
    format_research_summary,
    format_blog_preview,
    format_seo_preview,
    format_social_preview,
    format_email_preview
)
from app.utils.io import save_final_package
from app.models.schemas import FinalPackage
from datetime import datetime
import logging


def human_approval_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Human approval checkpoint.
    
    In CLI mode, this prompts the user for approval.
    In API mode, this auto-approves by default.
    Set auto_approve=True in the state to skip manual approval.
    """
    logger = logging.getLogger(f"marketing_system.{state['run_id']}")
    
    # Check if all required content is present
    missing_content = []
    if not state.get('research_report'):
        missing_content.append('research_report')
    if not state.get('blog_draft'):
        missing_content.append('blog_draft')
    if not state.get('seo_optimized_blog'):
        missing_content.append('seo_optimized_blog')
    if not state.get('social_assets'):
        missing_content.append('social_assets')
    if not state.get('email_assets'):
        missing_content.append('email_assets')
    
    if missing_content:
        logger.error(f"Cannot proceed to approval - missing content: {', '.join(missing_content)}")
        return {
            **state,
            "status": "failed",
            "errors": state.get("errors", []) + [f"Missing content for approval: {', '.join(missing_content)}"]
        }
    
    # Check for auto-approve flag (default to True for API)
    auto_approve = state.get('auto_approve', True)
    
    # CLI-specific approval (only when auto_approve is False)
    if not auto_approve:
        print("\n" + "="*60)
        print("CONTENT REVIEW - APPROVAL REQUIRED")
        print("="*60)
        
        # Show research summary
        if state.get('research_report'):
            print(format_research_summary(state['research_report']))
        
        # Show blog preview
        if state.get('blog_draft'):
            print(format_blog_preview(state['blog_draft']))
        
        # Show SEO preview
        if state.get('seo_optimized_blog'):
            print(format_seo_preview(state['seo_optimized_blog']))
        
        # Show social preview
        if state.get('social_assets'):
            print(format_social_preview(state['social_assets']))
        
        # Show email preview
        if state.get('email_assets'):
            print(format_email_preview(state['email_assets']))
        
        # Get manual approval
        print("\nReview the content above.")
        approval = input("Approve and finalize? (yes/no): ").strip().lower()
        
        approved = approval in ['yes', 'y']
    else:
        # Auto-approve for API mode
        approved = True
        logger.info("Auto-approved content (API mode)")
    
    if approved:
        logger.info("Content approved")
        return {
            **state,
            "approvals": {**state.get("approvals", {}), "final": True},
            "status": "approved"
        }
    else:
        logger.info("Content rejected by user")
        return {
            **state,
            "approvals": {**state.get("approvals", {}), "final": False},
            "status": "rejected"
        }


def finalize_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Finalize and save all artifacts.
    """
    logger = logging.getLogger(f"marketing_system.{state['run_id']}")
    logger.info("Finalizing content package...")
    
    try:
        # Create final package
        package = FinalPackage(
            run_id=state['run_id'],
            brief=state['brief'],
            research_report=state['research_report'],
            blog_draft=state['blog_draft'],
            seo_optimized_blog=state['seo_optimized_blog'],
            social_assets=state['social_assets'],
            email_assets=state['email_assets'],
            created_at=datetime.now(),
            artifacts_path=f"runs/{state['run_id']}"
        )
        
        # Save all artifacts
        saved_files = save_final_package(state['run_id'], package)
        
        logger.info("All artifacts saved successfully")
        print("\n" + "="*60)
        print("CONTENT PACKAGE FINALIZED")
        print("="*60)
        print(f"\nArtifacts saved to: runs/{state['run_id']}/")
        print("\nFiles created:")
        for name, path in saved_files.items():
            print(f"  - {path.name}")
        print("\n" + "="*60)
        
        return {
            **state,
            "status": "completed",
            "artifacts_path": f"runs/{state['run_id']}"
        }
        
    except Exception as e:
        logger.error(f"Finalization error: {str(e)}")
        return {
            **state,
            "status": "failed",
            "errors": state.get("errors", []) + [f"Finalization error: {str(e)}"]
        }


def should_continue_after_validation(state: Dict[str, Any]) -> str:
    """Route after brief validation."""
    if state['status'] == 'failed':
        return 'end'
    return 'research'


def should_retry_or_continue(state: Dict[str, Any]) -> str:
    """Route based on agent status."""
    status = state.get('status', '')
    
    # If failed, end workflow
    if status == 'failed':
        return 'end'
    
    # Continue to next step based on status
    if status == 'research_completed':
        return 'copywriter'
    elif status == 'blog_drafted':
        return 'seo'
    elif status == 'seo_completed':
        return 'social'
    elif status == 'social_completed':
        return 'approval'
    
    # Default: end
    return 'end'


def should_continue_after_approval(state: Dict[str, Any]) -> str:
    """Route after human approval."""
    if state['status'] == 'approved':
        return 'finalize'
    return 'end'


def create_workflow() -> StateGraph:
    """
    Create the LangGraph workflow.
    
    Flow:
    validate_brief -> research -> copywriter -> seo -> social -> approval -> finalize
    """
    workflow = StateGraph(GraphState)
    
    # Add nodes
    workflow.add_node("validate_brief", validate_brief_node)
    workflow.add_node("research", research_agent_node)
    workflow.add_node("copywriter", copywriter_agent_node)
    workflow.add_node("seo", seo_agent_node)
    workflow.add_node("social", social_repurposing_agent_node)
    workflow.add_node("approval", human_approval_node)
    workflow.add_node("finalize", finalize_node)
    
    # Set entry point
    workflow.set_entry_point("validate_brief")
    
    # Add edges
    workflow.add_conditional_edges(
        "validate_brief",
        should_continue_after_validation,
        {
            "research": "research",
            "end": END
        }
    )
    
    # Add conditional edges for each agent to handle failures
    workflow.add_conditional_edges(
        "research",
        should_retry_or_continue,
        {
            "copywriter": "copywriter",
            "end": END
        }
    )
    
    workflow.add_conditional_edges(
        "copywriter",
        should_retry_or_continue,
        {
            "seo": "seo",
            "end": END
        }
    )
    
    workflow.add_conditional_edges(
        "seo",
        should_retry_or_continue,
        {
            "social": "social",
            "end": END
        }
    )
    
    workflow.add_conditional_edges(
        "social",
        should_retry_or_continue,
        {
            "approval": "approval",
            "end": END
        }
    )
    
    workflow.add_conditional_edges(
        "approval",
        should_continue_after_approval,
        {
            "finalize": "finalize",
            "end": END
        }
    )
    
    workflow.add_edge("finalize", END)
    
    return workflow.compile()
