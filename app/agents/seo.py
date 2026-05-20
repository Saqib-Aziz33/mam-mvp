"""SEO optimization agent."""

from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.models.schemas import SEOReport
from app.config import DEFAULT_MODEL, TEMPERATURE, OPENAI_API_KEY, PROMPTS_DIR
from app.utils.logging import log_step
import logging


def load_prompt(filename: str) -> str:
    """Load prompt template from file."""
    prompt_path = PROMPTS_DIR / filename
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()


def format_blog_for_seo(blog: Any) -> str:
    """Format blog draft as plain text for SEO optimization."""
    sections = []
    sections.append(f"# {blog.title}\n")
    sections.append(blog.introduction)
    
    for section in blog.body_sections:
        heading = section.heading if hasattr(section, 'heading') else section['heading']
        content = section.content if hasattr(section, 'content') else section['content']
        sections.append(f"\n## {heading}\n")
        sections.append(content)
    
    sections.append(f"\n## Conclusion\n")
    sections.append(blog.conclusion)
    sections.append(f"\n{blog.call_to_action}")
    
    return "\n".join(sections)


def seo_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Optimize blog content for SEO.
    """
    logger = logging.getLogger(f"marketing_system.{state['run_id']}")
    log_step(logger, "SEO Agent", "started")
    
    try:
        brief = state['brief']
        research = state['research_report']
        blog = state['blog_draft']
        
        # Load system prompt
        system_prompt = load_prompt('seo.txt')
        
        # Create the LLM with structured output
        llm = ChatOpenAI(
            model=DEFAULT_MODEL,
            temperature=0.3,  # Lower temperature for SEO precision
            api_key=OPENAI_API_KEY,
            max_tokens=4000
        )
        
        structured_llm = llm.with_structured_output(SEOReport)
        
        # Format blog content
        blog_content = format_blog_for_seo(blog)
        
        # Create prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", """Optimize this blog post for SEO:

PRIMARY KEYWORDS: {primary_keywords}
SECONDARY KEYWORDS: {secondary_keywords}
SEARCH INTENT: {search_intent}

BLOG CONTENT:
{blog_content}

Provide comprehensive SEO optimization including meta tags, optimized content, keyword placement analysis, and internal linking suggestions.""")
        ])
        
        # Create chain
        chain = prompt | structured_llm
        
        # Invoke
        logger.info("Calling OpenAI for SEO optimization...")
        seo_report = chain.invoke({
            "primary_keywords": ", ".join(research.keyword_analysis.primary_keywords),
            "secondary_keywords": ", ".join(research.keyword_analysis.secondary_keywords),
            "search_intent": research.keyword_analysis.search_intent,
            "blog_content": blog_content
        })
        
        log_step(logger, "SEO Agent", "completed")
        logger.info(f"Meta title: {seo_report.meta_title}")
        logger.info(f"Keywords tracked in SEO report")
        
        return {
            **state,
            "seo_optimized_blog": seo_report,
            "status": "seo_completed"
        }
        
    except Exception as e:
        log_step(logger, "SEO Agent", f"error: {str(e)}")
        
        retry_count = state.get('retry_count', 0)
        if retry_count < 1:
            logger.info("Retrying SEO agent...")
            return {
                **state,
                "retry_count": retry_count + 1,
                "status": "seo_retry"
            }
        
        return {
            **state,
            "status": "failed",
            "errors": state.get("errors", []) + [f"SEO error: {str(e)}"]
        }
