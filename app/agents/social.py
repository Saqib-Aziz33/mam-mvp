"""Social media repurposing agent."""

from typing import Dict, Any, Tuple
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.models.schemas import SocialAssets, EmailAssets
from app.config import DEFAULT_MODEL, TEMPERATURE, OPENAI_API_KEY, PROMPTS_DIR
from app.utils.logging import log_step
import logging


def load_prompt(filename: str) -> str:
    """Load prompt template from file."""
    prompt_path = PROMPTS_DIR / filename
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()


def social_repurposing_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Repurpose blog content for social media and email.
    """
    logger = logging.getLogger(f"marketing_system.{state['run_id']}")
    log_step(logger, "Social Repurposing Agent", "started")
    
    try:
        brief = state['brief']
        blog = state['blog_draft']
        seo_blog = state['seo_optimized_blog']
        
        # Load system prompt
        system_prompt = load_prompt('social.txt')
        
        # Create the LLM
        llm = ChatOpenAI(
            model=DEFAULT_MODEL,
            temperature=TEMPERATURE,
            api_key=OPENAI_API_KEY
        )
        
        # Create two separate structured outputs
        social_llm = llm.with_structured_output(SocialAssets)
        email_llm = llm.with_structured_output(EmailAssets)
        
        # Create prompts
        social_prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", """Create social media posts for these platforms: LinkedIn, Twitter, Facebook, Instagram.

BLOG INFORMATION:
Title: {title}
Meta Description: {meta_description}
Key Points: {key_points}
Call to Action: {cta}

Brand Voice: {brand_voice}
Target Audience: {target_audience}

Create engaging, platform-specific posts with appropriate hashtags.""")
        ])
        
        email_prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", """Create email marketing content to promote this blog post:

BLOG INFORMATION:
Title: {title}
Meta Description: {meta_description}
Introduction: {introduction}
Call to Action: {cta}

Brand Voice: {brand_voice}
Target Audience: {target_audience}

Create a compelling email with subject line, preview text, body, and CTA.""")
        ])
        
        # Extract key points from blog sections
        key_points = "\n".join([
            f"- {section.heading if hasattr(section, 'heading') else section['heading']}: {(section.content if hasattr(section, 'content') else section['content'])[:150]}..."
            for section in blog.body_sections[:3]
        ])
        
        # Create chains
        social_chain = social_prompt | social_llm
        email_chain = email_prompt | email_llm
        
        # Invoke social media generation
        logger.info("Calling OpenAI for social media content...")
        social_assets = social_chain.invoke({
            "title": blog.title,
            "meta_description": seo_blog.meta_description,
            "key_points": key_points,
            "cta": blog.call_to_action,
            "brand_voice": brief.brand_voice,
            "target_audience": brief.target_audience
        })
        
        # Invoke email generation
        logger.info("Calling OpenAI for email content...")
        email_assets = email_chain.invoke({
            "title": blog.title,
            "meta_description": seo_blog.meta_description,
            "introduction": blog.introduction[:300],
            "cta": blog.call_to_action,
            "brand_voice": brief.brand_voice,
            "target_audience": brief.target_audience
        })
        
        log_step(logger, "Social Repurposing Agent", "completed")
        logger.info(f"Created {len(social_assets.posts)} social media posts")
        logger.info(f"Email subject: {email_assets.subject_line}")
        
        return {
            **state,
            "social_assets": social_assets,
            "email_assets": email_assets,
            "status": "social_completed"
        }
        
    except Exception as e:
        log_step(logger, "Social Repurposing Agent", f"error: {str(e)}")
        
        retry_count = state.get('retry_count', 0)
        if retry_count < 1:
            logger.info("Retrying social repurposing agent...")
            return {
                **state,
                "retry_count": retry_count + 1,
                "status": "social_retry"
            }
        
        return {
            **state,
            "status": "failed",
            "errors": state.get("errors", []) + [f"Social repurposing error: {str(e)}"]
        }
