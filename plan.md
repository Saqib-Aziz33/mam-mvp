Build a CLI-based multi-agent marketing system for Fastbase using LangGraph, LangChain, and OpenAI ChatOpenAI.

GOAL
Create an extensible marketing workflow that accepts a marketing brief and produces:
1) research report
2) blog draft
3) SEO-optimized blog
4) social repurposed posts
5) email teaser/body
6) final consolidated content package

ARCHITECTURE
Use LangGraph as the workflow engine with a shared state object.
The system must have:
- Orchestrator agent: validates brief, routes work, manages approvals, merges outputs
- Research Agent: topic research, keyword/SERP analysis, competitor scan
- Copywriter Agent: drafts blog posts, social copy, and email body in brand voice
- SEO Agent: optimizes blog drafts with meta title, meta description, headings, internal links, and keyword placement
- Social Repurposing Agent: turns one blog into social posts and email teasers

MVP CONSTRAINTS
- CLI only
- single brief per run
- sequential workflow
- human approval prompts in CLI
- save artifacts to local filesystem
- future web GUI should be possible without redesigning the core graph

PROJECT STRUCTURE
app/
  main.py
  cli.py
  config.py
  agents/
    orchestrator.py
    research.py
    copywriter.py
    seo.py
    social.py
  graph/
    state.py
    workflow.py
  prompts/
    orchestrator.txt
    research.txt
    copywriter.txt
    seo.txt
    social.txt
  models/
    schemas.py
  utils/
    io.py
    logging.py
    validation.py
    output_formatters.py

runs/
tests/

STATE SCHEMA
Create a shared LangGraph state with fields:
- run_id
- brief
- brand_voice
- target_audience
- campaign_goal
- research_report
- blog_draft
- seo_optimized_blog
- social_assets
- email_assets
- approvals
- errors
- status
- artifacts

DATA CONTRACTS
Use structured outputs for each agent. Prefer Pydantic models or typed dicts for:
- ResearchReport
- BlogDraft
- SEOReport
- SocialAssets
- EmailAssets
- FinalPackage

WORKFLOW
Implement graph nodes:
1) validate_brief
2) research_agent
3) copywriter_agent
4) seo_agent
5) social_repurposing_agent
6) human_approval
7) finalize

FLOW
brief -> validate_brief -> research_agent -> copywriter_agent -> seo_agent -> social_repurposing_agent -> human_approval -> finalize

Add conditional edges for:
- invalid brief
- agent error
- approval rejected
- retry or revise loops

CLI
Implement commands:
- python -m app run --brief "..."
- python -m app run --brief-file brief.md

CLI behavior:
- create a unique run_id
- create runs/<run_id>/ directory
- print each step as it runs
- show a concise summary of each agent output
- prompt for approval at checkpoints
- save markdown and JSON artifacts to disk

ARTIFACTS
Save:
- runs/<run_id>/brief.json
- runs/<run_id>/research.json
- runs/<run_id>/blog.md
- runs/<run_id>/seo_blog.md
- runs/<run_id>/social.md
- runs/<run_id>/email.md
- runs/<run_id>/final_package.md
- runs/<run_id>/final_package.json

PROMPTS
Create separate prompt templates for each agent.
Each prompt should instruct the model to return structured output only.
Include brand voice handling and marketing best practices.
Keep prompts easy to edit later.

ERROR HANDLING
Implement:
- brief validation errors
- OpenAI API errors
- malformed structured output handling
- retry once for transient failures
- graceful fallback to partial outputs
- error logging in graph state

TESTING
Add tests for:
- brief validation
- state transitions
- each agent output schema
- graph execution happy path
- approval rejection path
- artifact creation

IMPLEMENTATION ORDER
1) create config, project skeleton, and schemas
2) implement CLI entrypoint
3) build LangGraph state and workflow
4) implement Orchestrator and validation
5) implement Research Agent
6) implement Copywriter Agent
7) implement SEO Agent
8) implement Social Repurposing Agent
9) implement human approval step
10) implement final artifact export
11) add tests and sample brief

DESIGN RULES
- Keep the core workflow reusable for future web UI
- Do not mix orchestration logic with prompt logic
- Keep each agent isolated in its own module
- Prefer structured outputs over raw text
- Preserve intermediate artifacts for debugging
- Make everything deterministic enough to inspect and extend

DELIVERABLE
Produce a working CLI MVP that can take a brief and generate a full marketing content package using LangGraph and OpenAI ChatOpenAI.