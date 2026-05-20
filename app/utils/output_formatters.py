"""Output formatting utilities for CLI display."""

from typing import Any


def format_research_summary(research: Any) -> str:
    """Format research report for CLI display."""
    lines = [
        "\n" + "="*60,
        "RESEARCH REPORT SUMMARY",
        "="*60,
        f"\n{research.summary}\n",
        f"Primary Keywords: {', '.join(research.keyword_analysis.primary_keywords)}",
        f"Search Intent: {research.keyword_analysis.search_intent}",
        f"\nCompetitors Analyzed: {len(research.competitor_insights)}",
        f"Content Opportunities: {len(research.content_opportunities)}",
        "\nRecommended Angles:",
    ]
    
    for i, angle in enumerate(research.recommended_angles[:3], 1):
        lines.append(f"  {i}. {angle}")
    
    lines.append("="*60 + "\n")
    return "\n".join(lines)


def format_blog_preview(blog: Any) -> str:
    """Format blog draft preview for CLI display."""
    lines = [
        "\n" + "="*60,
        "BLOG DRAFT PREVIEW",
        "="*60,
        f"\nTitle: {blog.title}",
        f"Word Count: {blog.word_count}",
        f"Sections: {len(blog.body_sections)}",
        "\nIntroduction Preview:",
        f"{blog.introduction[:200]}...",
        "\nSection Headings:",
    ]
    
    for i, section in enumerate(blog.body_sections, 1):
        heading = section.heading if hasattr(section, 'heading') else section['heading']
        lines.append(f"  {i}. {heading}")
    
    lines.append(f"\nCall to Action: {blog.call_to_action}")
    lines.append("="*60 + "\n")
    return "\n".join(lines)


def format_social_preview(social: Any) -> str:
    """Format social assets preview for CLI display."""
    lines = [
        "\n" + "="*60,
        "SOCIAL MEDIA ASSETS PREVIEW",
        "="*60,
        f"\nTotal Posts: {len(social.posts)}\n",
    ]
    
    for post in social.posts:
        lines.append(f"Platform: {post.platform}")
        lines.append(f"Preview: {post.content[:100]}...")
        lines.append(f"Hashtags: {' '.join(post.hashtags[:5])}")
        lines.append("")
    
    lines.append("="*60 + "\n")
    return "\n".join(lines)


def format_seo_preview(seo: Any) -> str:
    """Format SEO report preview for CLI display."""
    lines = [
        "\n" + "="*60,
        "SEO OPTIMIZATION PREVIEW",
        "="*60,
        f"\nMeta Title: {seo.meta_title}",
        f"Meta Description: {seo.meta_description}",
        f"\nOptimized Title: {seo.optimized_title}",
        "\nKeyword Placement:",
    ]
    
    # Parse keyword_placement if it's a string
    import json
    try:
        if isinstance(seo.keyword_placement, str):
            keyword_dict = json.loads(seo.keyword_placement)
        else:
            keyword_dict = seo.keyword_placement
        
        for keyword, count in list(keyword_dict.items())[:5]:
            lines.append(f"  - {keyword}: {count} times")
    except:
        lines.append(f"  {seo.keyword_placement}")
    
    lines.append(f"\nInternal Link Suggestions: {len(seo.internal_link_suggestions)}")
    lines.append("="*60 + "\n")
    return "\n".join(lines)


def format_email_preview(email: Any) -> str:
    """Format email assets preview for CLI display."""
    lines = [
        "\n" + "="*60,
        "EMAIL CAMPAIGN PREVIEW",
        "="*60,
        f"\nSubject: {email.subject_line}",
        f"Preview Text: {email.preview_text}",
        f"\nBody Preview: {email.email_body[:150]}...",
        f"\nCTA: {email.cta_text}",
        "="*60 + "\n",
    ]
    return "\n".join(lines)
