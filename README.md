# Multi-Agent Marketing System for Fastbase

A CLI-based multi-agent marketing automation system built with LangGraph, LangChain, and OpenAI. This system transforms a marketing brief into a complete content package including research, blog posts, SEO optimization, social media content, and email campaigns.

## 🎯 Features

- **Automated Content Pipeline**: From brief to final deliverables in one workflow
- **Multi-Agent Architecture**: Specialized agents for research, copywriting, SEO, and social media
- **Structured Outputs**: Type-safe Pydantic models for all content
- **Human-in-the-Loop**: Approval checkpoints before finalization
- **Comprehensive Artifacts**: JSON and Markdown outputs for all content
- **Extensible Design**: Built for future web UI integration

## 📋 What It Produces

For each marketing brief, the system generates:

1. **Research Report** - Keyword analysis, competitor insights, content opportunities
2. **Blog Draft** - Full-length blog post with structured sections
3. **SEO-Optimized Blog** - Meta tags, keyword placement, internal linking
4. **Social Media Posts** - Platform-specific content for LinkedIn, Twitter, Facebook, Instagram
5. **Email Campaign** - Subject line, preview text, body, and CTA
6. **Final Package** - Consolidated JSON and Markdown files

## 🏗️ Architecture

### Agent System

- **Orchestrator Agent**: Validates briefs and manages workflow
- **Research Agent**: Conducts keyword and competitor analysis
- **Copywriter Agent**: Creates engaging blog content
- **SEO Agent**: Optimizes content for search engines
- **Social Repurposing Agent**: Adapts content for social media and email

### Workflow

```
Brief → Validation → Research → Copywriting → SEO → Social/Email → Approval → Finalize
```

### Technology Stack

- **LangGraph**: Workflow orchestration
- **LangChain**: Agent framework and prompt management
- **OpenAI GPT-4**: Content generation
- **Pydantic**: Data validation and structured outputs
- **Python 3.10+**: Core runtime

## 🚀 Installation

### Prerequisites

- Python 3.10 or higher
- OpenAI API key

### Setup

1. **Clone or navigate to the project directory**

```bash
cd g:\saqib\rag-ecosystem\mama
```

2. **Create and activate virtual environment** (if not already done)

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

Copy `.env.example` to `.env` and add your OpenAI API key:

```bash
OPENAI_API_KEY=your_api_key_here
```

## 📖 Usage

### Basic Usage

Run with a simple brief:

```bash
python -m app run --brief "Launch campaign for Fastbase's AI-powered SQL assistant"
```

The system will prompt you for additional required information (campaign goal, target audience, etc.).

### Using a Brief File

Create a JSON brief file:

```json
{
  "topic": "Fastbase's AI-powered database query assistant",
  "brand_voice": "technical yet approachable, innovative",
  "target_audience": "Software developers and database administrators",
  "campaign_goal": "Generate awareness and drive beta sign-ups",
  "keywords": ["AI SQL assistant", "database query tool"],
  "additional_context": "First AI feature launch"
}
```

Run with the brief file:

```bash
python -m app run --brief-file sample_brief.json
```

### Using a Markdown Brief

Create a markdown brief (`brief.md`):

```markdown
topic: Fastbase's AI-powered database query assistant
brand_voice: technical yet approachable, innovative
target_audience: Software developers and database administrators
campaign_goal: Generate awareness and drive beta sign-ups
keywords: AI SQL assistant, database query tool
additional_context: First AI feature launch
```

Run with the markdown file:

```bash
python -m app run --brief-file brief.md
```

## 📁 Project Structure

```
mama/
├── app/
│   ├── __init__.py
│   ├── __main__.py          # Entry point for python -m app
│   ├── main.py              # Alternative entry point
│   ├── cli.py               # CLI interface
│   ├── config.py            # Configuration management
│   │
│   ├── agents/              # Agent implementations
│   │   ├── __init__.py
│   │   ├── orchestrator.py  # Brief validation
│   │   ├── research.py      # Research agent
│   │   ├── copywriter.py    # Content creation
│   │   ├── seo.py           # SEO optimization
│   │   └── social.py        # Social/email repurposing
│   │
│   ├── graph/               # LangGraph workflow
│   │   ├── __init__.py
│   │   ├── state.py         # State definition
│   │   └── workflow.py      # Workflow graph
│   │
│   ├── models/              # Data models
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic schemas
│   │
│   ├── prompts/             # Agent prompts
│   │   ├── orchestrator.txt
│   │   ├── research.txt
│   │   ├── copywriter.txt
│   │   ├── seo.txt
│   │   └── social.txt
│   │
│   └── utils/               # Utilities
│       ├── __init__.py
│       ├── io.py            # File I/O
│       ├── logging.py       # Logging setup
│       ├── validation.py    # Input validation
│       └── output_formatters.py  # CLI formatting
│
├── runs/                    # Output directory (created automatically)
│   └── run_YYYYMMDD_HHMMSS_<id>/
│       ├── brief.json
│       ├── research.json
│       ├── blog.md
│       ├── seo_blog.md
│       ├── social.md
│       ├── email.md
│       ├── final_package.json
│       └── run.log
│
├── tests/                   # Test suite
│   ├── __init__.py
│   ├── test_validation.py
│   ├── test_schemas.py
│   └── test_workflow.py
│
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── requirements.txt         # Python dependencies
├── sample_brief.json        # Example JSON brief
├── sample_brief.md          # Example Markdown brief
├── plan.md                  # Implementation plan
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

### Model Configuration

Edit `app/config.py` to customize:

- `DEFAULT_MODEL`: OpenAI model (default: "gpt-4o-mini")
- `TEMPERATURE`: Generation temperature (default: 0.7)
- `MAX_TOKENS`: Maximum tokens per request (default: 4000)
- `MAX_RETRIES`: Retry attempts for failed agents (default: 1)

### Brand Defaults

Default brand voice and audience can be set in `app/config.py`:

- `DEFAULT_BRAND_VOICE`
- `DEFAULT_TARGET_AUDIENCE`

## 📊 Output Artifacts

Each run creates a timestamped directory in `runs/` with:

### JSON Files

- `brief.json` - Original marketing brief
- `research.json` - Research report with keywords and insights
- `final_package.json` - Complete package with all outputs

### Markdown Files

- `blog.md` - Blog draft with sections
- `seo_blog.md` - SEO-optimized blog content
- `social.md` - Social media posts for all platforms
- `email.md` - Email campaign content

### Log Files

- `run.log` - Detailed execution log

## 🧪 Testing

Run the test suite:

```bash
pytest tests/
```

Run specific test files:

```bash
pytest tests/test_validation.py
pytest tests/test_schemas.py
pytest tests/test_workflow.py
```

Run with coverage:

```bash
pytest --cov=app tests/
```

## 🎨 Customization

### Adding New Agents

1. Create agent file in `app/agents/`
2. Define agent node function
3. Add to workflow in `app/graph/workflow.py`
4. Create prompt template in `app/prompts/`

### Modifying Prompts

Edit prompt files in `app/prompts/` to customize agent behavior:

- `research.txt` - Research methodology
- `copywriter.txt` - Writing style and structure
- `seo.txt` - SEO optimization rules
- `social.txt` - Social media guidelines

### Extending Schemas

Add new fields to Pydantic models in `app/models/schemas.py`.

## 🔍 Workflow Details

### 1. Brief Validation

- Validates required fields
- Checks field lengths
- Creates MarketingBrief model

### 2. Research Agent

- Keyword analysis (primary/secondary)
- Competitor insights
- Content opportunities
- Recommended angles

### 3. Copywriter Agent

- Structured blog post
- 1200-1800 words
- 4-6 body sections
- Clear CTA

### 4. SEO Agent

- Meta title and description
- Keyword placement tracking
- Heading structure optimization
- Internal link suggestions

### 5. Social Repurposing Agent

- Platform-specific posts (LinkedIn, Twitter, Facebook, Instagram)
- Hashtag strategy
- Email subject and body
- CTA optimization

### 6. Human Approval

- CLI preview of all content
- Accept/reject decision
- Saves artifacts only on approval

### 7. Finalization

- Creates final package
- Saves all artifacts
- Generates summary report

## 🚧 Error Handling

The system includes:

- **Validation errors**: Clear feedback on invalid briefs
- **API errors**: Automatic retry for transient failures
- **Graceful degradation**: Partial outputs on agent failures
- **Detailed logging**: Full execution trace in run logs

## 🔮 Future Enhancements

- [ ] Web UI for brief submission and content review
- [ ] Multi-brief batch processing
- [ ] Content revision loops
- [ ] A/B testing for headlines and CTAs
- [ ] Integration with CMS platforms
- [ ] Analytics and performance tracking
- [ ] Custom agent plugins
- [ ] Template library for different industries

## 📝 License

This project is proprietary to Fastbase.

## 🤝 Contributing

This is an internal tool. For questions or suggestions, contact the development team.

## 📞 Support

For issues or questions:
1. Check the logs in `runs/<run_id>/run.log`
2. Review error messages in CLI output
3. Contact the development team

## 🙏 Acknowledgments

Built with:
- [LangGraph](https://github.com/langchain-ai/langgraph)
- [LangChain](https://github.com/langchain-ai/langchain)
- [OpenAI](https://openai.com/)
- [Pydantic](https://pydantic.dev/)
