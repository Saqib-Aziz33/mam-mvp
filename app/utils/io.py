"""File I/O utilities."""

import json
from pathlib import Path
from typing import Any, Dict
from datetime import datetime
from app.config import RUNS_DIR


def create_run_directory(run_id: str) -> Path:
    """Create a directory for the current run."""
    run_dir = RUNS_DIR / run_id
    run_dir.mkdir(parents=True, exist_ok=True)
    return run_dir


def save_artifact(run_id: str, filename: str, content: Any, as_json: bool = False) -> Path:
    """Save an artifact to the run directory."""
    run_dir = create_run_directory(run_id)
    filepath = run_dir / filename
    
    if as_json:
        with open(filepath, 'w', encoding='utf-8') as f:
            if hasattr(content, 'model_dump'):
                json.dump(content.model_dump(), f, indent=2, default=str)
            else:
                json.dump(content, f, indent=2, default=str)
    else:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(content))
    
    return filepath


def load_artifact(run_id: str, filename: str, as_json: bool = False) -> Any:
    """Load an artifact from the run directory."""
    filepath = RUNS_DIR / run_id / filename
    
    if not filepath.exists():
        raise FileNotFoundError(f"Artifact not found: {filepath}")
    
    if as_json:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()


def save_final_package(run_id: str, package: Any) -> Dict[str, Path]:
    """Save all final package artifacts."""
    saved_files = {}
    
    # Save JSON package
    saved_files['package'] = save_artifact(
        run_id, 'final_package.json', package, as_json=True
    )
    
    # Save brief
    saved_files['brief'] = save_artifact(
        run_id, 'brief.json', package.brief, as_json=True
    )
    
    # Save research
    saved_files['research'] = save_artifact(
        run_id, 'research.json', package.research_report, as_json=True
    )
    
    # Save blog draft
    blog_md = format_blog_markdown(package.blog_draft)
    saved_files['blog'] = save_artifact(run_id, 'blog.md', blog_md)
    
    # Save SEO blog
    saved_files['seo_blog'] = save_artifact(
        run_id, 'seo_blog.md', package.seo_optimized_blog.optimized_content
    )
    
    # Save social posts
    social_md = format_social_markdown(package.social_assets)
    saved_files['social'] = save_artifact(run_id, 'social.md', social_md)
    
    # Save email
    email_md = format_email_markdown(package.email_assets)
    saved_files['email'] = save_artifact(run_id, 'email.md', email_md)
    
    return saved_files


def format_blog_markdown(blog: Any) -> str:
    """Format blog draft as markdown."""
    lines = [
        f"# {blog.title}\n",
        "## Introduction\n",
        f"{blog.introduction}\n",
    ]
    
    for section in blog.body_sections:
        heading = section.heading if hasattr(section, 'heading') else section['heading']
        content = section.content if hasattr(section, 'content') else section['content']
        lines.append(f"## {heading}\n")
        lines.append(f"{content}\n")
    
    lines.append("## Conclusion\n")
    lines.append(f"{blog.conclusion}\n")
    lines.append(f"\n**{blog.call_to_action}**\n")
    lines.append(f"\n---\nWord count: {blog.word_count}")
    
    return "\n".join(lines)


def format_social_markdown(social: Any) -> str:
    """Format social assets as markdown."""
    lines = ["# Social Media Posts\n"]
    
    for post in social.posts:
        lines.append(f"## {post.platform}\n")
        lines.append(f"{post.content}\n")
        lines.append(f"**Hashtags:** {' '.join(post.hashtags)}\n")
        lines.append(f"*Character count: {post.character_count}*\n")
    
    if social.content_calendar_notes:
        lines.append(f"\n## Content Calendar Notes\n{social.content_calendar_notes}\n")
    
    return "\n".join(lines)


def format_email_markdown(email: Any) -> str:
    """Format email assets as markdown."""
    return f"""# Email Campaign

## Subject Line
{email.subject_line}

## Preview Text
{email.preview_text}

## Email Body
{email.email_body}

## Call to Action
{email.cta_text}
"""
