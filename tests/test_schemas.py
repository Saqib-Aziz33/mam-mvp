"""Tests for Pydantic schemas."""

import pytest
from pydantic import ValidationError
from app.models.schemas import (
    MarketingBrief,
    KeywordAnalysis,
    ResearchReport,
    BlogDraft,
    SEOReport,
    SocialPost,
    SocialAssets,
    EmailAssets
)


def test_marketing_brief_creation():
    """Test creating a valid marketing brief."""
    brief = MarketingBrief(
        topic="AI database assistant",
        campaign_goal="Drive sign-ups"
    )
    
    assert brief.topic == "AI database assistant"
    assert brief.campaign_goal == "Drive sign-ups"
    assert brief.brand_voice == "professional, engaging, and informative"


def test_marketing_brief_with_all_fields():
    """Test creating a brief with all fields."""
    brief = MarketingBrief(
        topic="AI assistant",
        brand_voice="technical",
        target_audience="developers",
        campaign_goal="awareness",
        keywords=["AI", "SQL"],
        additional_context="Beta launch"
    )
    
    assert brief.keywords == ["AI", "SQL"]
    assert brief.additional_context == "Beta launch"


def test_keyword_analysis_creation():
    """Test creating keyword analysis."""
    analysis = KeywordAnalysis(
        primary_keywords=["AI SQL", "database assistant"],
        secondary_keywords=["query tool", "SQL generator"],
        search_intent="informational"
    )
    
    assert len(analysis.primary_keywords) == 2
    assert analysis.search_intent == "informational"


def test_blog_draft_structure():
    """Test blog draft structure."""
    blog = BlogDraft(
        title="Test Blog",
        introduction="Intro text",
        body_sections=[
            {"heading": "Section 1", "content": "Content 1"},
            {"heading": "Section 2", "content": "Content 2"}
        ],
        conclusion="Conclusion text",
        call_to_action="Sign up now",
        word_count=150
    )
    
    assert blog.title == "Test Blog"
    assert len(blog.body_sections) == 2
    assert blog.word_count == 150


def test_seo_report_meta_constraints():
    """Test SEO report meta tag length constraints."""
    seo = SEOReport(
        meta_title="Short Title",
        meta_description="A description that is within the character limit for meta descriptions.",
        optimized_title="Optimized Title",
        optimized_content="Full content here",
        heading_structure=["H1", "H2", "H2"],
        keyword_placement={"keyword1": 5, "keyword2": 3},
        internal_link_suggestions=["link1", "link2"]
    )
    
    assert len(seo.meta_title) <= 60
    assert len(seo.meta_description) <= 160


def test_social_post_creation():
    """Test social media post creation."""
    post = SocialPost(
        platform="LinkedIn",
        content="Check out our new feature!",
        hashtags=["AI", "Database", "SQL"],
        character_count=28
    )
    
    assert post.platform == "LinkedIn"
    assert len(post.hashtags) == 3


def test_email_assets_creation():
    """Test email assets creation."""
    email = EmailAssets(
        subject_line="Introducing AI Assistant",
        preview_text="Transform your SQL workflow",
        email_body="Full email content here...",
        cta_text="Join Beta"
    )
    
    assert email.subject_line == "Introducing AI Assistant"
    assert email.cta_text == "Join Beta"
