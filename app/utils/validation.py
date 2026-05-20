"""Input validation utilities."""

from typing import Dict, List, Optional
from app.models.schemas import MarketingBrief


def validate_brief(brief_data: Dict) -> tuple[bool, Optional[List[str]]]:
    """
    Validate marketing brief data.
    
    Returns:
        (is_valid, errors)
    """
    errors = []
    
    # Required fields
    if not brief_data.get('topic'):
        errors.append("Topic is required")
    
    if not brief_data.get('campaign_goal'):
        errors.append("Campaign goal is required")
    
    # Length validations
    topic = brief_data.get('topic', '')
    if len(topic) < 5:
        errors.append("Topic must be at least 5 characters")
    
    if len(topic) > 500:
        errors.append("Topic must be less than 500 characters")
    
    campaign_goal = brief_data.get('campaign_goal', '')
    if len(campaign_goal) < 10:
        errors.append("Campaign goal must be at least 10 characters")
    
    # Try to create the model
    if not errors:
        try:
            MarketingBrief(**brief_data)
        except Exception as e:
            errors.append(f"Invalid brief format: {str(e)}")
    
    return (len(errors) == 0, errors if errors else None)
