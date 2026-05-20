# Installation & Verification Checklist

Use this checklist to verify your Multi-Agent Marketing System is properly set up.

---

## ✅ Pre-Installation

- [ ] Python 3.10 or higher installed
- [ ] OpenAI API key available
- [ ] Terminal/Command Prompt access

---

## ✅ Environment Setup

### 1. Virtual Environment

- [ ] Virtual environment created (`.venv` directory exists)
- [ ] Virtual environment activated
  - Windows: `.venv\Scripts\activate`
  - macOS/Linux: `source .venv/bin/activate`

**Verify:**
```bash
python --version  # Should show Python 3.10+
which python      # Should point to .venv (macOS/Linux)
where python      # Should point to .venv (Windows)
```

### 2. Dependencies

- [ ] `requirements.txt` exists
- [ ] All packages installed: `pip install -r requirements.txt`

**Verify:**
```bash
pip list | grep langchain
pip list | grep langgraph
pip list | grep openai
pip list | grep pydantic
```

Should show:
- langchain==1.3.1
- langchain-core==1.4.0
- langchain-openai==1.2.1
- langgraph==1.2.0
- openai==2.37.0
- pydantic==2.13.4

### 3. Environment Variables

- [ ] `.env` file exists
- [ ] `OPENAI_API_KEY` is set in `.env`
- [ ] API key is valid (starts with `sk-`)

**Verify:**
```bash
# Windows
type .env

# macOS/Linux
cat .env
```

Should show:
```
OPENAI_API_KEY=sk-...
```

---

## ✅ Project Structure

### Core Directories

- [ ] `app/` directory exists
- [ ] `app/agents/` directory exists
- [ ] `app/graph/` directory exists
- [ ] `app/models/` directory exists
- [ ] `app/prompts/` directory exists
- [ ] `app/utils/` directory exists
- [ ] `tests/` directory exists

### Agent Files

- [ ] `app/agents/orchestrator.py`
- [ ] `app/agents/research.py`
- [ ] `app/agents/copywriter.py`
- [ ] `app/agents/seo.py`
- [ ] `app/agents/social.py`
- [ ] `app/agents/__init__.py`

### Prompt Files

- [ ] `app/prompts/orchestrator.txt`
- [ ] `app/prompts/research.txt`
- [ ] `app/prompts/copywriter.txt`
- [ ] `app/prompts/seo.txt`
- [ ] `app/prompts/social.txt`

### Workflow Files

- [ ] `app/graph/state.py`
- [ ] `app/graph/workflow.py`
- [ ] `app/graph/__init__.py`

### Model Files

- [ ] `app/models/schemas.py`
- [ ] `app/models/__init__.py`

### Utility Files

- [ ] `app/utils/io.py`
- [ ] `app/utils/logging.py`
- [ ] `app/utils/validation.py`
- [ ] `app/utils/output_formatters.py`
- [ ] `app/utils/__init__.py`

### Core Files

- [ ] `app/config.py`
- [ ] `app/cli.py`
- [ ] `app/main.py`
- [ ] `app/__main__.py`
- [ ] `app/__init__.py`

### Test Files

- [ ] `tests/test_validation.py`
- [ ] `tests/test_schemas.py`
- [ ] `tests/test_workflow.py`
- [ ] `tests/__init__.py`

### Documentation Files

- [ ] `README.md`
- [ ] `DOCUMENTATION.md`
- [ ] `QUICKSTART.md`
- [ ] `EXAMPLES.md`
- [ ] `PROJECT_SUMMARY.md`
- [ ] `INSTALLATION_CHECKLIST.md` (this file)

### Sample Files

- [ ] `sample_brief.json`
- [ ] `sample_brief.md`

### Configuration Files

- [ ] `.env`
- [ ] `.env.example`
- [ ] `.gitignore`
- [ ] `requirements.txt`
- [ ] `plan.md`

---

## ✅ Functionality Tests

### 1. Import Test

```bash
python -c "from app.models.schemas import MarketingBrief; print('✓ Imports work')"
```

Expected: `✓ Imports work`

### 2. Config Test

```bash
python -c "from app.config import OPENAI_API_KEY; print('✓ Config loaded')"
```

Expected: `✓ Config loaded`

### 3. CLI Test

```bash
python -m app --help
```

Expected: Help message showing commands

### 4. Validation Test

```bash
python -c "from app.utils.validation import validate_brief; brief = {'topic': 'Test', 'campaign_goal': 'Test goal'}; valid, errors = validate_brief(brief); print('✓ Validation works' if valid else f'✗ {errors}')"
```

Expected: `✓ Validation works`

### 5. Unit Tests

```bash
pytest tests/ -v
```

Expected: All tests pass

---

## ✅ First Run Test

### Run Sample Brief

```bash
python -m app run --brief-file sample_brief.json
```

**Expected Behavior:**

1. ✓ Workflow starts
2. ✓ Brief validation completes
3. ✓ Research agent runs
4. ✓ Copywriter agent runs
5. ✓ SEO agent runs
6. ✓ Social repurposing agent runs
7. ✓ Approval prompt appears
8. ✓ (Type 'yes') Artifacts are saved
9. ✓ Run completes successfully

### Verify Output

- [ ] `runs/` directory created
- [ ] Run directory created (e.g., `runs/run_20260519_143022_a1b2c3d4/`)
- [ ] `brief.json` exists in run directory
- [ ] `research.json` exists in run directory
- [ ] `blog.md` exists in run directory
- [ ] `seo_blog.md` exists in run directory
- [ ] `social.md` exists in run directory
- [ ] `email.md` exists in run directory
- [ ] `final_package.json` exists in run directory
- [ ] `run.log` exists in run directory

### Verify Content Quality

- [ ] Blog post has title, introduction, sections, conclusion
- [ ] Blog post is 1200-1800 words
- [ ] SEO blog has meta title and description
- [ ] Social posts include LinkedIn, Twitter, Facebook, Instagram
- [ ] Email has subject line, preview text, body, CTA
- [ ] All content is relevant to the brief topic

---

## ✅ Common Issues & Solutions

### Issue: "OPENAI_API_KEY not found"

**Solution:**
1. Check `.env` file exists
2. Verify it contains `OPENAI_API_KEY=sk-...`
3. Restart terminal after creating `.env`

### Issue: "ModuleNotFoundError: No module named 'app'"

**Solution:**
1. Ensure you're in the project root directory
2. Virtual environment is activated
3. Run from correct location: `python -m app run ...`

### Issue: "No module named 'langchain'"

**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: "OpenAI API error"

**Solution:**
1. Verify API key is valid
2. Check OpenAI account has credits
3. Check internet connection
4. Verify no rate limits hit

### Issue: "Validation failed"

**Solution:**
1. Ensure brief has `topic` field
2. Ensure brief has `campaign_goal` field
3. Check field lengths meet requirements
4. Review sample briefs for format

### Issue: "Permission denied" when saving artifacts

**Solution:**
1. Check write permissions on project directory
2. Ensure `runs/` directory can be created
3. Run with appropriate permissions

---

## ✅ Performance Verification

### Expected Execution Times

- Brief validation: < 1 second
- Research agent: 15-30 seconds
- Copywriter agent: 20-40 seconds
- SEO agent: 15-25 seconds
- Social repurposing agent: 20-35 seconds
- Total workflow: 2-3 minutes

### Expected Token Usage

- Research: ~1500-2500 tokens
- Copywriter: ~2500-4000 tokens
- SEO: ~2000-3500 tokens
- Social: ~1500-2500 tokens
- Total per run: ~8000-12000 tokens

### Expected Costs (GPT-4o-mini)

- Per run: ~$0.01-0.02
- Per 100 runs: ~$1-2

---

## ✅ Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] API key is not committed to git
- [ ] `.env.example` has placeholder, not real key
- [ ] Virtual environment (`.venv/`) is in `.gitignore`
- [ ] No sensitive data in sample briefs

---

## ✅ Documentation Checklist

- [ ] README.md reviewed
- [ ] QUICKSTART.md reviewed
- [ ] DOCUMENTATION.md reviewed
- [ ] EXAMPLES.md reviewed
- [ ] PROJECT_SUMMARY.md reviewed
- [ ] All documentation is clear and accurate

---

## ✅ Ready for Production

Once all items above are checked:

- [ ] All tests pass
- [ ] Sample brief runs successfully
- [ ] Output quality is acceptable
- [ ] Documentation is complete
- [ ] Team is trained on usage

---

## 🎉 Verification Complete!

If all items are checked, your Multi-Agent Marketing System is ready to use!

### Next Steps:

1. **Create your first brief** based on examples
2. **Run the workflow** and review output
3. **Customize prompts** for your brand voice
4. **Integrate into your workflow** (CI/CD, CMS, etc.)

### Need Help?

- Review `QUICKSTART.md` for usage guide
- Check `EXAMPLES.md` for more examples
- Read `DOCUMENTATION.md` for technical details
- Examine `runs/<run_id>/run.log` for debugging

---

**Installation Date:** _____________

**Verified By:** _____________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
