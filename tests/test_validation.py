"""Tests for brief validation."""

import pytest
from app.utils.validation import validate_brief


def test_valid_brief():
    """Test validation of a valid brief."""
    brief_data = {
        "topic": "AI-powered database assistant",
        "campaign_goal": "Generate awareness and drive sign-ups",
        "target_audience": "Software developers",
        "brand_voice": "technical and approachable"
    }
    
    is_valid, errors = validate_brief(brief_data)
    assert is_valid is True
    assert errors is None


def test_missing_topic():
    """Test validation fails when topic is missing."""
    brief_data = {
        "campaign_goal": "Generate awareness",
    }
    
    is_valid, errors = validate_brief(brief_data)
    assert is_valid is False
    assert "Topic is required" in errors


def test_missing_campaign_goal():
    """Test validation fails when campaign goal is missing."""
    brief_data = {
        "topic": "AI assistant",
    }
    
    is_valid, errors = validate_brief(brief_data)
    assert is_valid is False
    assert "Campaign goal is required" in errors


def test_topic_too_short():
    """Test validation fails when topic is too short."""
    brief_data = {
        "topic": "AI",
        "campaign_goal": "Generate awareness and drive sign-ups",
    }
    
    is_valid, errors = validate_brief(brief_data)
    assert is_valid is False
    assert "Topic must be at least 5 characters" in errors


def test_topic_too_long():
    """Test validation fails when topic is too long."""
    brief_data = {
        "topic": "A" * 501,
        "campaign_goal": "Generate awareness",
    }
    
    is_valid, errors = validate_brief(brief_data)
    assert is_valid is False
    assert "Topic must be less than 500 characters" in errors


def test_campaign_goal_too_short():
    """Test validation fails when campaign goal is too short."""
    brief_data = {
        "topic": "AI assistant",
        "campaign_goal": "Awareness",
    }
    
    is_valid, errors = validate_brief(brief_data)
    assert is_valid is False
    assert "Campaign goal must be at least 10 characters" in errors


def test_brief_with_optional_fields():
    """Test validation succeeds with optional fields."""
    brief_data = {
        "topic": "AI-powered database assistant",
        "campaign_goal": "Generate awareness and drive sign-ups",
        "target_audience": "Developers",
        "brand_voice": "Technical",
        "keywords": ["AI", "SQL", "database"],
        "additional_context": "First AI feature launch"
    }
    
    is_valid, errors = validate_brief(brief_data)
    assert is_valid is True
    assert errors is None
