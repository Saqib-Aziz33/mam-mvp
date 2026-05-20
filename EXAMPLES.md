# Usage Examples

Practical examples for using the Multi-Agent Marketing System.

---

## Example 1: Basic Campaign

### Brief (JSON)

```json
{
  "topic": "Fastbase's new real-time analytics dashboard",
  "campaign_goal": "Drive product awareness and demo requests",
  "target_audience": "Data analysts and business intelligence professionals",
  "brand_voice": "data-driven, insightful, professional"
}
```

### Command

```bash
python -m app run --brief-file campaign_analytics.json
```

### Expected Output

- Research report with BI tool competitors
- Blog post about real-time analytics benefits
- SEO optimization for "real-time analytics" keywords
- LinkedIn post for B2B audience
- Email campaign for demo requests

---

## Example 2: Product Launch

### Brief (Markdown)

```markdown
topic: Launching Fastbase's AI-powered query optimizer that reduces database costs by 40%

campaign_goal: Generate buzz and early adopter sign-ups for beta program

target_audience: CTOs, engineering managers, and DevOps teams at scale-ups

brand_voice: innovative, technical, ROI-focused

keywords: database optimization, query performance, cost reduction, AI database

additional_context: This is a major feature that differentiates us from competitors. Emphasize cost savings and performance improvements. Target companies with high database costs.
```

### Command

```bash
python -m app run --brief-file launch_optimizer.md
```

### Expected Output

- Research on database optimization market
- Technical blog post with performance metrics
- SEO targeting "database cost reduction"
- Twitter thread for developer audience
- Email emphasizing 40% cost savings

---

## Example 3: Thought Leadership

### Brief (Inline)

```bash
python -m app run --brief "The future of database management: How AI is transforming data infrastructure"
```

### Interactive Prompts

```
Please provide additional information:
Campaign Goal: Establish thought leadership and drive conference attendance
Target Audience (press Enter for default): Database architects and infrastructure engineers
Brand Voice (press Enter for default): visionary, technical, forward-thinking
```

### Expected Output

- Research on AI trends in databases
- Thought leadership blog post
- SEO for "AI database management"
- LinkedIn article format
- Email invitation to webinar

---

## Example 4: Feature Announcement

### Brief (JSON)

```json
{
  "topic": "Fastbase now supports multi-region replication with automatic failover",
  "campaign_goal": "Inform existing customers and attract enterprise prospects",
  "target_audience": "Enterprise architects and reliability engineers",
  "brand_voice": "reliable, enterprise-grade, technical",
  "keywords": [
    "multi-region database",
    "automatic failover",
    "database replication",
    "high availability"
  ],
  "additional_context": "This feature is critical for enterprise customers. Emphasize reliability, uptime, and disaster recovery capabilities."
}
```

### Command

```bash
python -m app run --brief-file feature_replication.json
```

### Expected Output

- Research on high-availability solutions
- Technical blog explaining the feature
- SEO for enterprise database keywords
- LinkedIn post for enterprise audience
- Email to existing customer base

---

## Example 5: Educational Content

### Brief (JSON)

```json
{
  "topic": "Database indexing strategies: A comprehensive guide for developers",
  "campaign_goal": "Drive organic traffic and establish expertise",
  "target_audience": "Backend developers and database administrators",
  "brand_voice": "educational, practical, developer-friendly",
  "keywords": [
    "database indexing",
    "index optimization",
    "query performance",
    "database best practices"
  ]
}
```

### Command

```bash
python -m app run --brief-file guide_indexing.json
```

### Expected Output

- Research on indexing techniques
- Comprehensive educational blog post
- SEO for "database indexing guide"
- Twitter tips thread
- Email newsletter content

---

## Example 6: Case Study

### Brief (Markdown)

```markdown
topic: How TechCorp reduced query times by 10x with Fastbase

campaign_goal: Generate social proof and enterprise leads

target_audience: Engineering leaders at mid-size to large companies

brand_voice: results-driven, credible, customer-focused

keywords: database performance, case study, query optimization, customer success

additional_context: TechCorp is a well-known e-commerce company. They migrated from PostgreSQL and saw immediate improvements. Include specific metrics and quotes.
```

### Command

```bash
python -m app run --brief-file case_techcorp.md
```

### Expected Output

- Research on database migration case studies
- Customer success story blog post
- SEO for "database performance case study"
- LinkedIn case study post
- Email to similar prospects

---

## Example 7: Comparison Content

### Brief (JSON)

```json
{
  "topic": "Fastbase vs Traditional Databases: A comprehensive comparison",
  "campaign_goal": "Help prospects make informed decisions and drive conversions",
  "target_audience": "Technical decision-makers evaluating database solutions",
  "brand_voice": "objective, informative, confident",
  "keywords": [
    "database comparison",
    "Fastbase vs PostgreSQL",
    "modern database",
    "database migration"
  ],
  "additional_context": "Be fair and objective. Acknowledge where traditional databases excel, but highlight our unique advantages in performance, scalability, and AI features."
}
```

### Expected Output

- Research on competitor features
- Balanced comparison blog post
- SEO for comparison keywords
- LinkedIn comparison post
- Email for evaluation stage prospects

---

## Example 8: Event Promotion

### Brief (JSON)

```json
{
  "topic": "Join us at DatabaseCon 2026: Fastbase's vision for the future",
  "campaign_goal": "Drive booth visits and meeting bookings at DatabaseCon",
  "target_audience": "Conference attendees, database professionals",
  "brand_voice": "exciting, inviting, innovative",
  "keywords": [
    "DatabaseCon 2026",
    "database conference",
    "Fastbase booth"
  ],
  "additional_context": "We're in booth #42. We'll be demoing our new AI features and giving away swag. Include a calendar link for booking meetings."
}
```

### Expected Output

- Research on conference marketing
- Event announcement blog post
- SEO for conference keywords
- Social media countdown posts
- Email invitation to book meetings

---

## Example 9: Integration Announcement

### Brief (Markdown)

```markdown
topic: Fastbase now integrates with Kubernetes for seamless deployment

campaign_goal: Attract DevOps and cloud-native teams

target_audience: DevOps engineers, platform engineers, SREs

brand_voice: technical, cloud-native, developer-friendly

keywords: Kubernetes database, K8s integration, cloud-native database, container orchestration

additional_context: This integration makes it easy to deploy Fastbase in Kubernetes clusters. Include Helm chart information and deployment examples.
```

### Expected Output

- Research on Kubernetes database solutions
- Technical integration blog post
- SEO for "Kubernetes database"
- Twitter announcement for DevOps community
- Email to cloud-native segment

---

## Example 10: Seasonal Campaign

### Brief (JSON)

```json
{
  "topic": "New Year, New Database: Start 2026 with Fastbase",
  "campaign_goal": "Drive Q1 sign-ups with seasonal promotion",
  "target_audience": "Companies planning infrastructure upgrades",
  "brand_voice": "motivating, fresh-start, opportunity-focused",
  "keywords": [
    "database upgrade",
    "infrastructure modernization",
    "2026 tech trends"
  ],
  "additional_context": "Tie into New Year's resolution theme. Emphasize fresh starts, modernization, and setting up for success in 2026. Mention any Q1 promotions."
}
```

### Expected Output

- Research on seasonal marketing
- Motivational blog post
- SEO for "database upgrade 2026"
- Social posts with New Year theme
- Email with promotional offer

---

## Workflow Output Structure

Every run creates a directory like:

```
runs/run_20260519_143022_a1b2c3d4/
├── brief.json              # Original brief
├── research.json           # Research findings
├── blog.md                 # Blog draft
├── seo_blog.md            # SEO-optimized blog
├── social.md              # Social media posts
├── email.md               # Email campaign
├── final_package.json     # Complete package
└── run.log                # Execution log
```

---

## Tips for Different Content Types

### Product Launches
- Emphasize innovation and benefits
- Include specific features and use cases
- Target early adopters
- Create urgency

### Thought Leadership
- Focus on trends and insights
- Position as industry expert
- Educational tone
- Long-form content

### Case Studies
- Include specific metrics
- Use customer quotes
- Show before/after
- Build credibility

### Technical Guides
- Step-by-step instructions
- Code examples
- Best practices
- Developer-friendly tone

### Comparisons
- Be objective and fair
- Use data and benchmarks
- Acknowledge trade-offs
- Help decision-making

---

## Customizing Output

### Adjust Brand Voice

```json
{
  "brand_voice": "casual and friendly"
  // vs
  "brand_voice": "formal and enterprise-focused"
  // vs
  "brand_voice": "technical and developer-centric"
}
```

### Target Different Audiences

```json
{
  "target_audience": "C-level executives"
  // vs
  "target_audience": "Individual developers"
  // vs
  "target_audience": "Technical decision-makers"
}
```

### Set Campaign Goals

```json
{
  "campaign_goal": "Drive demo requests"
  // vs
  "campaign_goal": "Generate organic traffic"
  // vs
  "campaign_goal": "Build brand awareness"
}
```

---

## Batch Processing

Process multiple briefs:

```bash
# Create multiple brief files
python -m app run --brief-file brief1.json
python -m app run --brief-file brief2.json
python -m app run --brief-file brief3.json
```

Or use a script:

```bash
for file in briefs/*.json; do
    python -m app run --brief-file "$file"
done
```

---

## Integration Examples

### Use in CI/CD

```yaml
# .github/workflows/content.yml
name: Generate Content
on:
  workflow_dispatch:
    inputs:
      brief_file:
        description: 'Brief file path'
        required: true

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Generate content
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: python -m app run --brief-file ${{ github.event.inputs.brief_file }}
      - name: Upload artifacts
        uses: actions/upload-artifact@v2
        with:
          name: content
          path: runs/
```

### Use Programmatically

```python
from app.graph.workflow import create_workflow
from app.models.schemas import MarketingBrief

# Create brief
brief = MarketingBrief(
    topic="Your topic",
    campaign_goal="Your goal"
)

# Initialize state
state = {
    "run_id": "custom_run",
    "brief": brief,
    "research_report": None,
    "blog_draft": None,
    "seo_optimized_blog": None,
    "social_assets": None,
    "email_assets": None,
    "approvals": {},
    "errors": [],
    "status": "initialized",
    "artifacts_path": None,
    "retry_count": 0
}

# Run workflow
workflow = create_workflow()
result = workflow.invoke(state)

# Access results
if result['status'] == 'completed':
    blog = result['blog_draft']
    print(f"Generated blog: {blog.title}")
```

---

## Common Patterns

### Pattern 1: Series Content

Create a series of related posts:

```bash
python -m app run --brief-file series_part1.json
python -m app run --brief-file series_part2.json
python -m app run --brief-file series_part3.json
```

### Pattern 2: Multi-Channel Campaign

One brief generates content for all channels:
- Blog post
- Social media (4 platforms)
- Email campaign

### Pattern 3: Repurposing

Use the same brief with different goals:

```json
// Original
{"campaign_goal": "Drive awareness"}

// Repurposed
{"campaign_goal": "Drive conversions"}
```

---

## Success Metrics

Track these metrics for each campaign:

- **Blog**: Views, time on page, conversions
- **Social**: Engagement, clicks, shares
- **Email**: Open rate, click rate, conversions
- **SEO**: Rankings, organic traffic

All content includes tracking-ready CTAs and links.

---

## Need Help?

- Check `README.md` for full documentation
- See `QUICKSTART.md` for getting started
- Review `DOCUMENTATION.md` for technical details
- Examine sample briefs for format examples
