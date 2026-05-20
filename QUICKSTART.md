# Quick Start Guide

Get up and running with the Multi-Agent Marketing System in 5 minutes.

## Prerequisites

- Python 3.10 or higher
- OpenAI API key
- Windows, macOS, or Linux

## Installation

### 1. Navigate to Project Directory

```bash
cd g:\saqib\rag-ecosystem\mama
```

### 2. Activate Virtual Environment

If you haven't created one yet:

```bash
python -m venv .venv
```

Activate it:

**Windows:**
```bash
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure API Key

Your `.env` file is already configured with an OpenAI API key. If you need to update it:

```bash
OPENAI_API_KEY=your_new_key_here
```

## First Run

### Option 1: Use Sample Brief (Recommended)

```bash
python -m app run --brief-file sample_brief.json
```

This will:
1. Validate the brief
2. Conduct research
3. Write a blog post
4. Optimize for SEO
5. Create social media posts
6. Generate email content
7. Ask for your approval
8. Save all artifacts

### Option 2: Quick Brief

```bash
python -m app run --brief "Launch campaign for Fastbase's new AI feature"
```

You'll be prompted to provide:
- Campaign goal
- Target audience (optional)
- Brand voice (optional)

### Option 3: Custom Brief File

Create `my_brief.json`:

```json
{
  "topic": "Your product or campaign topic",
  "campaign_goal": "What you want to achieve",
  "target_audience": "Who you're targeting",
  "brand_voice": "Your brand's tone"
}
```

Run it:

```bash
python -m app run --brief-file my_brief.json
```

## What Happens During Execution

You'll see output like this:

```
============================================================
MARKETING WORKFLOW STARTED
============================================================
Run ID: run_20260519_143022_a1b2c3d4
Topic: Fastbase's AI-powered database query assistant
============================================================

INFO: [14:30:22] Brief Validation - started
INFO: Topic: Fastbase's AI-powered database query assistant
INFO: Goal: Generate awareness and drive sign-ups
INFO: [14:30:22] Brief Validation - completed

INFO: [14:30:23] Research Agent - started
INFO: Calling OpenAI for research analysis...
INFO: Found 4 primary keywords
INFO: Analyzed 3 competitors
INFO: [14:30:45] Research Agent - completed

INFO: [14:30:46] Copywriter Agent - started
INFO: Calling OpenAI for blog content creation...
INFO: Blog title: Transform Your SQL Workflow with AI
INFO: Word count: 1456
INFO: Sections: 5
INFO: [14:31:15] Copywriter Agent - completed

INFO: [14:31:16] SEO Agent - started
INFO: Calling OpenAI for SEO optimization...
INFO: Meta title: AI SQL Assistant | Fastbase Database Tools
INFO: Keywords tracked: 6
INFO: [14:31:35] SEO Agent - completed

INFO: [14:31:36] Social Repurposing Agent - started
INFO: Calling OpenAI for social media content...
INFO: Calling OpenAI for email content...
INFO: Created 4 social media posts
INFO: Email subject: Introducing AI-Powered SQL Assistant
INFO: [14:32:05] Social Repurposing Agent - completed

============================================================
CONTENT REVIEW - APPROVAL REQUIRED
============================================================

[Content previews shown here...]

Review the content above.
Approve and finalize? (yes/no): yes

============================================================
CONTENT PACKAGE FINALIZED
============================================================

Artifacts saved to: runs/run_20260519_143022_a1b2c3d4/

Files created:
  - brief.json
  - research.json
  - blog.md
  - seo_blog.md
  - social.md
  - email.md
  - final_package.json
  - run.log

============================================================

✓ Workflow completed successfully!

Run ID: run_20260519_143022_a1b2c3d4
Artifacts: runs/run_20260519_143022_a1b2c3d4/
```

## Viewing Your Results

Navigate to the run directory:

```bash
cd runs/run_20260519_143022_a1b2c3d4/
```

Open the files:

- **blog.md** - Your blog post
- **seo_blog.md** - SEO-optimized version
- **social.md** - Social media posts
- **email.md** - Email campaign
- **final_package.json** - Complete data package
- **run.log** - Execution log

## Tips for Best Results

### 1. Be Specific in Your Brief

❌ Bad: "Marketing campaign"
✅ Good: "Launch campaign for Fastbase's AI-powered SQL assistant targeting developers"

### 2. Provide Context

Include:
- Product/feature details
- Target audience specifics
- Campaign objectives
- Brand voice guidelines

### 3. Use Keywords

If you have target keywords, include them:

```json
{
  "keywords": ["AI SQL assistant", "database query tool", "SQL automation"]
}
```

### 4. Review Before Approving

The approval step shows previews of all content. Take time to review:
- Research insights
- Blog structure and tone
- SEO optimization
- Social media posts
- Email content

## Common Commands

### Run with JSON brief
```bash
python -m app run --brief-file brief.json
```

### Run with Markdown brief
```bash
python -m app run --brief-file brief.md
```

### Run with inline brief
```bash
python -m app run --brief "Your campaign topic here"
```

## Troubleshooting

### "OPENAI_API_KEY not found"

Check your `.env` file exists and contains:
```
OPENAI_API_KEY=sk-...
```

### "Topic is required"

Ensure your brief includes a topic:
```json
{
  "topic": "Your topic here",
  "campaign_goal": "Your goal here"
}
```

### "Workflow failed"

Check the log file in `runs/<run_id>/run.log` for details.

### API Rate Limits

If you hit OpenAI rate limits, wait a few minutes and try again.

## Next Steps

1. **Customize Prompts**: Edit files in `app/prompts/` to change agent behavior
2. **Adjust Configuration**: Modify `app/config.py` for different models or settings
3. **Run Tests**: `pytest tests/` to verify everything works
4. **Read Documentation**: See `DOCUMENTATION.md` for technical details

## Getting Help

- Check `README.md` for full documentation
- Review `DOCUMENTATION.md` for technical details
- Examine `runs/<run_id>/run.log` for execution logs
- Look at `sample_brief.json` for example format

## Example Workflow

Here's a complete example from start to finish:

```bash
# 1. Activate environment
.venv\Scripts\activate

# 2. Run with sample brief
python -m app run --brief-file sample_brief.json

# 3. Review the previews shown in terminal

# 4. Type 'yes' when prompted to approve

# 5. Check your results
cd runs/run_20260519_143022_a1b2c3d4/
dir  # or 'ls' on macOS/Linux

# 6. Open the blog post
notepad blog.md  # or 'open blog.md' on macOS, 'xdg-open blog.md' on Linux
```

That's it! You've successfully generated a complete marketing content package.

## What's Generated

For each run, you get:

✅ **Research Report** with keyword analysis and competitor insights  
✅ **Blog Post** (1200-1800 words) with structured sections  
✅ **SEO Optimization** with meta tags and keyword placement  
✅ **4 Social Media Posts** (LinkedIn, Twitter, Facebook, Instagram)  
✅ **Email Campaign** with subject, body, and CTA  
✅ **Complete JSON Package** with all data  

All ready to use in your marketing campaigns!
