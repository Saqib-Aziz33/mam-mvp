"""LangGraph state definition."""

from typing import TypedDict, Optional, List, Dict, Any
from app.models.schemas import (
    MarketingBrief,
    ResearchReport,
    BlogDraft,
    SEOReport,
    SocialAssets,
    EmailAssets
)


class GraphState(TypedDict):
    """State object for the marketing workflow graph."""
    run_id: str
    brief: Optional[MarketingBrief]
    research_report: Optional[ResearchReport]
    blog_draft: Optional[BlogDraft]
    seo_optimized_blog: Optional[SEOReport]
    social_assets: Optional[SocialAssets]
    email_assets: Optional[EmailAssets]
    approvals: Dict[str, bool]
    errors: List[str]
    status: str
    artifacts_path: Optional[str]
    retry_count: int
