# Multi-Agent Marketing System - Technical Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Agent Specifications](#agent-specifications)
4. [Data Models](#data-models)
5. [Workflow Engine](#workflow-engine)
6. [API Reference](#api-reference)
7. [Configuration](#configuration)
8. [Error Handling](#error-handling)
9. [Testing Strategy](#testing-strategy)
10. [Deployment](#deployment)

---

## System Overview

The Multi-Agent Marketing System is a LangGraph-based workflow automation tool that transforms marketing briefs into comprehensive content packages. It uses specialized AI agents orchestrated through a state machine to produce research reports, blog posts, SEO optimizations, social media content, and email campaigns.

### Key Characteristics

- **Modular Architecture**: Each agent is isolated and independently testable
- **Type Safety**: Pydantic models ensure data integrity throughout the pipeline
- **Human-in-the-Loop**: Approval checkpoints prevent unwanted content publication
- **Extensible Design**: Easy to add new agents or modify existing ones
- **Artifact Preservation**: All intermediate and final outputs are saved

---

## Architecture

### High-Level Design

```
┌─────────────┐
│   CLI       │
│  Interface  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         LangGraph Workflow              │
│  ┌───────────────────────────────────┐  │
│  │  Orchestrator (Validation)        │  │
│  └────────────┬──────────────────────┘  │
│               ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Research Agent                   │  │
│  └────────────┬──────────────────────┘  │
│               ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Copywriter Agent                 │  │
│  └────────────┬──────────────────────┘  │
│               ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  SEO Agent                        │  │
│  └────────────┬──────────────────────┘  │
│               ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Social Repurposing Agent         │  │
│  └────────────┬──────────────────────┘  │
│               ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Human Approval                   │  │
│  └────────────┬──────────────────────┘  │
│               ▼                          │
│  ┌───────────────────────────────────┐  │
│  │  Finalize & Save                  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│  Artifacts  │
│  (runs/)    │
└─────────────┘
```

### Component Breakdown

#### 1. CLI Layer (`app/cli.py`)
- Argument parsing
- Brief loading (JSON/Markdown/String)
- Workflow invocation
- Output display

#### 2. Workflow Engine (`app/graph/`)
- State management
- Node execution
- Conditional routing
- Error handling

#### 3. Agent Layer (`app/agents/`)
- Specialized AI agents
- Prompt management
- Structured output generation
- Retry logic

#### 4. Data Layer (`app/models/`)
- Pydantic schemas
- Type validation
- Serialization

#### 5. Utility Layer (`app/utils/`)
- File I/O
- Logging
- Validation
- Formatting

---

## Agent Specifications

### 1. Orchestrator Agent

**Purpose**: Validate marketing briefs and manage workflow state

**Input**: Raw brief data (dict)

**Output**: Validated `MarketingBrief` model

**Responsibilities**:
- Check required fields
- Validate field lengths
- Create Pydantic model
- Set workflow status

**Error Handling**:
- Returns validation errors in state
- Sets status to 'failed' on invalid brief

### 2. Research Agent

**Purpose**: Conduct market and keyword research

**Input**: `MarketingBrief`

**Output**: `ResearchReport`

**Responsibilities**:
- Keyword analysis (primary/secondary)
- Competitor research
- Content opportunity identification
- Angle recommendations

**Prompt Template**: `app/prompts/research.txt`

**Model**: GPT-4o-mini (temperature: 0.7)

**Structured Output**: `ResearchReport` schema

### 3. Copywriter Agent

**Purpose**: Create engaging blog content

**Input**: `MarketingBrief`, `ResearchReport`

**Output**: `BlogDraft`

**Responsibilities**:
- Title creation
- Introduction writing
- Body section development (4-6 sections)
- Conclusion and CTA

**Target Length**: 1200-1800 words

**Prompt Template**: `app/prompts/copywriter.txt`

**Model**: GPT-4o-mini (temperature: 0.7, max_tokens: 4000)

### 4. SEO Agent

**Purpose**: Optimize content for search engines

**Input**: `BlogDraft`, `ResearchReport`

**Output**: `SEOReport`

**Responsibilities**:
- Meta tag creation (title, description)
- Keyword placement optimization
- Heading structure
- Internal link suggestions

**Prompt Template**: `app/prompts/seo.txt`

**Model**: GPT-4o-mini (temperature: 0.3)

### 5. Social Repurposing Agent

**Purpose**: Adapt content for social media and email

**Input**: `BlogDraft`, `SEOReport`, `MarketingBrief`

**Output**: `SocialAssets`, `EmailAssets`

**Responsibilities**:
- Platform-specific posts (LinkedIn, Twitter, Facebook, Instagram)
- Hashtag strategy
- Email subject and body
- CTA optimization

**Prompt Template**: `app/prompts/social.txt`

**Model**: GPT-4o-mini (temperature: 0.7)

---

## Data Models

### Core Schemas

#### MarketingBrief
```python
{
    "topic": str,                    # Required
    "campaign_goal": str,            # Required
    "brand_voice": str,              # Default provided
    "target_audience": str,          # Default provided
    "keywords": List[str],           # Optional
    "additional_context": str        # Optional
}
```

#### ResearchReport
```python
{
    "summary": str,
    "keyword_analysis": {
        "primary_keywords": List[str],
        "secondary_keywords": List[str],
        "search_intent": str,
        "difficulty_score": str       # Optional
    },
    "competitor_insights": List[{
        "competitor_name": str,
        "key_points": List[str],
        "content_gaps": List[str]
    }],
    "content_opportunities": List[str],
    "recommended_angles": List[str],
    "sources": List[str]              # Optional
}
```

#### BlogDraft
```python
{
    "title": str,
    "introduction": str,
    "body_sections": List[{
        "heading": str,
        "content": str
    }],
    "conclusion": str,
    "call_to_action": str,
    "word_count": int
}
```

#### SEOReport
```python
{
    "meta_title": str,                # Max 60 chars
    "meta_description": str,          # Max 160 chars
    "optimized_title": str,
    "optimized_content": str,
    "heading_structure": List[str],
    "keyword_placement": Dict[str, int],
    "internal_link_suggestions": List[str],
    "seo_score": str                  # Optional
}
```

#### SocialAssets
```python
{
    "posts": List[{
        "platform": str,
        "content": str,
        "hashtags": List[str],
        "character_count": int
    }],
    "content_calendar_notes": str     # Optional
}
```

#### EmailAssets
```python
{
    "subject_line": str,
    "preview_text": str,
    "email_body": str,
    "cta_text": str
}
```

---

## Workflow Engine

### State Machine

The workflow uses LangGraph's `StateGraph` with the following state schema:

```python
class GraphState(TypedDict):
    run_id: str
    brief: Optional[MarketingBrief]
    research_report: Optional[ResearchReport]
    blog_draft: Optional[BlogDraft]
    seo_optimized_blog: Optional[SEOReport]
    social_assets: Optional[SocialAssets]
    email_assets: Optional[EmailAssets]
    approvals: Dict[str, bool]
    errors: List[str]
    status: str
    artifacts_path: Optional[str]
    retry_count: int
```

### Node Execution Flow

1. **validate_brief**: Entry point, validates input
2. **research**: Conducts research
3. **copywriter**: Creates blog content
4. **seo**: Optimizes for search
5. **social**: Repurposes for social/email
6. **approval**: Human checkpoint
7. **finalize**: Saves artifacts

### Conditional Edges

- After validation: Continue to research or end (if failed)
- After approval: Continue to finalize or end (if rejected)

### Retry Logic

Each agent node includes retry logic:
- Max retries: 1 (configurable in `config.py`)
- Retry on transient errors only
- Permanent failures end workflow

---

## API Reference

### CLI Commands

#### Run Workflow
```bash
python -m app run --brief "Brief text"
python -m app run --brief-file path/to/brief.json
python -m app run --brief-file path/to/brief.md
```

### Python API

#### Create and Run Workflow
```python
from app.graph.workflow import create_workflow
from app.models.schemas import MarketingBrief

# Create brief
brief = MarketingBrief(
    topic="AI assistant",
    campaign_goal="Drive sign-ups"
)

# Initialize state
state = {
    "run_id": "custom_run_id",
    "brief": brief,
    # ... other fields
}

# Create and run workflow
workflow = create_workflow()
result = workflow.invoke(state)
```

#### Save Artifacts
```python
from app.utils.io import save_artifact

save_artifact(
    run_id="run_123",
    filename="output.json",
    content=data,
    as_json=True
)
```

---

## Configuration

### Environment Variables

```bash
OPENAI_API_KEY=your_key_here
```

### Config File (`app/config.py`)

```python
# Model settings
DEFAULT_MODEL = "gpt-4o-mini"
TEMPERATURE = 0.7
MAX_TOKENS = 4000

# Workflow settings
MAX_RETRIES = 1
ENABLE_HUMAN_APPROVAL = True

# Brand defaults
DEFAULT_BRAND_VOICE = "professional, engaging, and informative"
DEFAULT_TARGET_AUDIENCE = "B2B decision makers and technical professionals"
```

---

## Error Handling

### Error Types

1. **Validation Errors**: Invalid brief data
2. **API Errors**: OpenAI API failures
3. **Schema Errors**: Malformed structured outputs
4. **File I/O Errors**: Artifact save failures

### Error Flow

```
Error Occurs
    ↓
Logged to run.log
    ↓
Added to state.errors
    ↓
Retry if transient (max 1 retry)
    ↓
If still failing: Set status='failed'
    ↓
Workflow ends gracefully
```

### Error Messages

All errors are:
- Logged to `runs/<run_id>/run.log`
- Added to state `errors` list
- Displayed in CLI output

---

## Testing Strategy

### Test Coverage

1. **Unit Tests**
   - Schema validation (`test_schemas.py`)
   - Brief validation (`test_validation.py`)
   - Individual agent nodes

2. **Integration Tests**
   - Workflow execution (`test_workflow.py`)
   - End-to-end brief processing

3. **Manual Testing**
   - Sample briefs
   - Edge cases
   - Error scenarios

### Running Tests

```bash
# All tests
pytest tests/

# Specific test file
pytest tests/test_validation.py

# With coverage
pytest --cov=app tests/

# Verbose output
pytest -v tests/
```

---

## Deployment

### Local Development

1. Clone repository
2. Create virtual environment
3. Install dependencies
4. Configure `.env`
5. Run workflow

### Production Considerations

- **API Key Management**: Use secrets manager
- **Rate Limiting**: Implement OpenAI rate limit handling
- **Monitoring**: Add application monitoring
- **Logging**: Centralized log aggregation
- **Scaling**: Queue-based processing for multiple briefs

### Future Web UI Integration

The current architecture supports web UI integration:

1. Replace CLI with web endpoints
2. Use same workflow engine
3. Store state in database
4. Add async processing
5. Implement user authentication

---

## Maintenance

### Adding New Agents

1. Create agent file in `app/agents/`
2. Define node function with signature: `(state: Dict) -> Dict`
3. Add prompt template in `app/prompts/`
4. Update workflow in `app/graph/workflow.py`
5. Add tests

### Modifying Prompts

Edit files in `app/prompts/` - changes take effect immediately.

### Updating Schemas

1. Modify Pydantic models in `app/models/schemas.py`
2. Update agent structured outputs
3. Update tests
4. Regenerate documentation

---

## Troubleshooting

### Common Issues

**Issue**: OpenAI API key not found
**Solution**: Check `.env` file exists and contains valid key

**Issue**: Workflow fails at research step
**Solution**: Check OpenAI API quota and rate limits

**Issue**: Validation errors on brief
**Solution**: Ensure topic and campaign_goal are provided and meet length requirements

**Issue**: Artifacts not saved
**Solution**: Check `runs/` directory permissions

---

## Appendix

### Dependencies

- langchain==1.3.1
- langchain-core==1.4.0
- langchain-openai==1.2.1
- langgraph==1.2.0
- openai==2.37.0
- pydantic==2.13.4
- python-dotenv==1.2.2

### File Structure Reference

See README.md for complete project structure.

### Version History

- v0.1.0: Initial MVP release
