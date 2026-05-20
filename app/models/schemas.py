"""Pydantic schemas for structured data."""

from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime


class MarketingBrief(BaseModel):
    """Input marketing brief."""
    topic: str = Field(..., description="Main topic or product to market")
    brand_voice: str = Field(default="professional, engaging, and informative")
    target_audience: str = Field(default="B2B decision makers and technical professionals")
    campaign_goal: str = Field(..., description="Primary goal of the campaign")
    keywords: Optional[List[str]] = Field(default=None, description="Target keywords")
    additional_context: Optional[str] = Field(default=None)


class KeywordAnalysis(BaseModel):
    """Keyword research data."""
    primary_keywords: List[str]
    secondary_keywords: List[str]
    search_intent: str
    difficulty_score: Optional[str] = None


class CompetitorInsight(BaseModel):
    """Competitor analysis."""
    competitor_name: str
    key_points: List[str]
    content_gaps: List[str]


class ResearchReport(BaseModel):
    """Research agent output."""
    summary: str = Field(..., description="Executive summary of research")
    keyword_analysis: KeywordAnalysis
    competitor_insights: List[CompetitorInsight]
    content_opportunities: List[str]
    recommended_angles: List[str]
    sources: Optional[List[str]] = Field(default=None)


class BodySection(BaseModel):
    """Blog body section."""
    heading: str
    content: str


class BlogDraft(BaseModel):
    """Copywriter agent output."""
    title: str
    introduction: str
    body_sections: List[BodySection] = Field(
        ..., description="List of sections with heading and content"
    )
    conclusion: str
    call_to_action: str
    word_count: int


class SEOReport(BaseModel):
    """SEO agent output."""
    meta_title: str = Field(..., max_length=60)
    meta_description: str = Field(..., max_length=160)
    optimized_title: str
    optimized_content: str = Field(..., description="Full SEO-optimized blog content")
    heading_structure: List[str]
    keyword_placement: str = Field(..., description="JSON string of keyword counts, e.g. '{\"keyword1\": 5, \"keyword2\": 3}'")
    internal_link_suggestions: List[str]
    seo_score: Optional[str] = None


class SocialPost(BaseModel):
    """Individual social media post."""
    platform: str = Field(..., description="e.g., LinkedIn, Twitter, Facebook")
    content: str
    hashtags: List[str]
    character_count: int


class SocialAssets(BaseModel):
    """Social repurposing agent output."""
    posts: List[SocialPost]
    content_calendar_notes: Optional[str] = None


class EmailAssets(BaseModel):
    """Email marketing content."""
    subject_line: str
    preview_text: str
    email_body: str
    cta_text: str


class FinalPackage(BaseModel):
    """Consolidated output package."""
    run_id: str
    brief: MarketingBrief
    research_report: ResearchReport
    blog_draft: BlogDraft
    seo_optimized_blog: SEOReport
    social_assets: SocialAssets
    email_assets: EmailAssets
    created_at: datetime
    artifacts_path: str


class WorkflowState(BaseModel):
    """LangGraph shared state."""
    run_id: str
    brief: Optional[MarketingBrief] = None
    research_report: Optional[ResearchReport] = None
    blog_draft: Optional[BlogDraft] = None
    seo_optimized_blog: Optional[SEOReport] = None
    social_assets: Optional[SocialAssets] = None
    email_assets: Optional[EmailAssets] = None
    approvals: Dict[str, bool] = Field(default_factory=dict)
    errors: List[str] = Field(default_factory=list)
    status: str = Field(default="initialized")
    artifacts_path: Optional[str] = None
    retry_count: int = Field(default=0)

    class Config:
        arbitrary_types_allowed = True
