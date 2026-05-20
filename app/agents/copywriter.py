"""Copywriter agent for content creation."""

from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.models.schemas import BlogDraft
from app.config import DEFAULT_MODEL, TEMPERATURE, OPENAI_API_KEY, PROMPTS_DIR
from app.utils.logging import log_step
import logging


def load_prompt(filename: str) -> str:
    """Load prompt template from file."""
    prompt_path = PROMPTS_DIR / filename
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()


def copywriter_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Write blog content based on research.
    """
    logger = logging.getLogger(f"marketing_system.{state['run_id']}")
    log_step(logger, "Copywriter Agent", "started")
    
    try:
        brief = state['brief']
        research = state['research_report']
        
        # Load system prompt
        system_prompt = load_prompt('copywriter.txt')
        
        # Create the LLM with structured output
        llm = ChatOpenAI(
            model=DEFAULT_MODEL,
            temperature=TEMPERATURE,
            api_key=OPENAI_API_KEY,
            max_tokens=4000
        )
        
        structured_llm = llm.with_structured_output(BlogDraft)
        
        # Create prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", """Write a compelling blog post based on this information:

MARKETING BRIEF:
Topic: {topic}
Campaign Goal: {campaign_goal}
Target Audience: {target_audience}
Brand Voice: {brand_voice}

RESEARCH INSIGHTS:
Summary: {research_summary}
Primary Keywords: {primary_keywords}
Recommended Angles: {recommended_angles}
Content Opportunities: {content_opportunities}

Create a well-structured, engaging blog post that incorporates these insights and achieves the campaign goal.""")
        ])
        
        # Create chain
        chain = prompt | structured_llm
        
        # Invoke
        logger.info("Calling OpenAI for blog content creation...")
        blog_draft = chain.invoke({
            "topic": brief.topic,
            "campaign_goal": brief.campaign_goal,
            "target_audience": brief.target_audience,
            "brand_voice": brief.brand_voice,
            "research_summary": research.summary,
            "primary_keywords": ", ".join(research.keyword_analysis.primary_keywords),
            "recommended_angles": "\n".join([f"- {angle}" for angle in research.recommended_angles]),
            "content_opportunities": "\n".join([f"- {opp}" for opp in research.content_opportunities])
        })
        
        log_step(logger, "Copywriter Agent", "completed")
        logger.info(f"Blog title: {blog_draft.title}")
        logger.info(f"Word count: {blog_draft.word_count}")
        logger.info(f"Sections: {len(blog_draft.body_sections)}")
        
        return {
            **state,
            "blog_draft": blog_draft,
            "status": "blog_drafted"
        }
        
    except Exception as e:
        log_step(logger, "Copywriter Agent", f"error: {str(e)}")
        
        retry_count = state.get('retry_count', 0)
        if retry_count < 1:
            logger.info("Retrying copywriter agent...")
            return {
                **state,
                "retry_count": retry_count + 1,
                "status": "copywriter_retry"
            }
        
        return {
            **state,
            "status": "failed",
            "errors": state.get("errors", []) + [f"Copywriter error: {str(e)}"]
        }
