"""Research agent for market and keyword research."""

from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.models.schemas import ResearchReport, KeywordAnalysis, CompetitorInsight
from app.config import DEFAULT_MODEL, TEMPERATURE, OPENAI_API_KEY, PROMPTS_DIR
from app.utils.logging import log_step
import logging
import json


def load_prompt(filename: str) -> str:
    """Load prompt template from file."""
    prompt_path = PROMPTS_DIR / filename
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()


def research_agent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Conduct research for the marketing campaign.
    """
    logger = logging.getLogger(f"marketing_system.{state['run_id']}")
    log_step(logger, "Research Agent", "started")
    
    try:
        brief = state['brief']
        
        # Load system prompt
        system_prompt = load_prompt('research.txt')
        
        # Create the LLM with structured output
        llm = ChatOpenAI(
            model=DEFAULT_MODEL,
            temperature=TEMPERATURE,
            api_key=OPENAI_API_KEY
        )
        
        # Create structured output LLM
        structured_llm = llm.with_structured_output(ResearchReport)
        
        # Create prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", """Conduct comprehensive research for this marketing brief:

Topic: {topic}
Campaign Goal: {campaign_goal}
Target Audience: {target_audience}
Brand Voice: {brand_voice}
{keywords_section}
{context_section}

Provide a detailed research report with keyword analysis, competitor insights, content opportunities, and recommended angles.""")
        ])
        
        # Prepare input
        keywords_section = ""
        if brief.keywords:
            keywords_section = f"Target Keywords: {', '.join(brief.keywords)}"
        
        context_section = ""
        if brief.additional_context:
            context_section = f"Additional Context: {brief.additional_context}"
        
        # Create chain
        chain = prompt | structured_llm
        
        # Invoke
        logger.info("Calling OpenAI for research analysis...")
        research_report = chain.invoke({
            "topic": brief.topic,
            "campaign_goal": brief.campaign_goal,
            "target_audience": brief.target_audience,
            "brand_voice": brief.brand_voice,
            "keywords_section": keywords_section,
            "context_section": context_section
        })
        
        log_step(logger, "Research Agent", "completed")
        logger.info(f"Found {len(research_report.keyword_analysis.primary_keywords)} primary keywords")
        logger.info(f"Analyzed {len(research_report.competitor_insights)} competitors")
        
        return {
            **state,
            "research_report": research_report,
            "status": "research_completed"
        }
        
    except Exception as e:
        log_step(logger, "Research Agent", f"error: {str(e)}")
        
        # Check retry count
        retry_count = state.get('retry_count', 0)
        if retry_count < 1:
            logger.info("Retrying research agent...")
            return {
                **state,
                "retry_count": retry_count + 1,
                "status": "research_retry"
            }
        
        return {
            **state,
            "status": "failed",
            "errors": state.get("errors", []) + [f"Research error: {str(e)}"]
        }
