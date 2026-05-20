# Fixes Applied - Schema Compatibility

## Issue
OpenAI's structured output feature (used by `with_structured_output`) requires that all fields in the Pydantic schema's `properties` must be listed in the `required` array. Complex types like `List[Dict[str, str]]` and `Dict[str, int]` were causing validation errors.

## Error Messages
```
Invalid schema for response_format 'BlogDraft': In context=(), 'required' is required to be supplied and to be an array including every key in properties. Extra required key 'body_sections' supplied.
```

```
Invalid schema for response_format 'SEOReport': In context=(), 'required' is required to be supplied and to be an array including every key in properties. Extra required key 'keyword_placement' supplied.
```

## Fixes Applied

### 1. BlogDraft Schema (`app/models/schemas.py`)

**Before:**
```python
class BlogDraft(BaseModel):
    body_sections: List[Dict[str, str]] = Field(
        ..., description="List of sections with 'heading' and 'content' keys"
    )
```

**After:**
```python
class BodySection(BaseModel):
    """Blog body section."""
    heading: str
    content: str

class BlogDraft(BaseModel):
    body_sections: List[BodySection] = Field(
        ..., description="List of sections with heading and content"
    )
```

**Reason:** OpenAI's structured output doesn't support `List[Dict[str, str]]`. We created a proper Pydantic model `BodySection` instead.

### 2. SEOReport Schema (`app/models/schemas.py`)

**Before:**
```python
class SEOReport(BaseModel):
    keyword_placement: Dict[str, int]
```

**After:**
```python
class SEOReport(BaseModel):
    keyword_placement: str = Field(..., description="JSON string of keyword counts, e.g. '{\"keyword1\": 5, \"keyword2\": 3}'")
```

**Reason:** OpenAI's structured output doesn't support `Dict[str, int]`. We changed it to a JSON string that can be parsed later.

### 3. Updated Code to Handle New Schema

**Files Updated:**
- `app/utils/output_formatters.py` - Handle both dict and string for keyword_placement, handle BodySection objects
- `app/utils/io.py` - Handle BodySection objects when formatting blog markdown
- `app/agents/seo.py` - Handle BodySection objects when formatting blog for SEO
- `app/agents/social.py` - Handle BodySection objects when extracting key points
- `app/prompts/copywriter.txt` - Updated to mention BodySection objects
- `app/prompts/seo.txt` - Updated to mention JSON string for keyword_placement
- `app/models/__init__.py` - Export BodySection

### 4. Improved Error Handling (`app/graph/workflow.py`)

**Added:**
- `should_retry_or_continue()` function to properly route between agents
- Conditional edges for each agent to handle failures gracefully
- Check in `human_approval_node()` to ensure all content is present before approval

## Testing

### Verify Schema Import
```bash
.venv\Scripts\python.exe -c "from app.models.schemas import BlogDraft, BodySection, SEOReport; print('OK')"
```

### Run Full Workflow
```bash
.venv\Scripts\python.exe -m app run --brief-file sample_brief.json
```

## Expected Behavior Now

1. ✅ Brief validation completes
2. ✅ Research agent runs successfully
3. ✅ Copywriter agent creates blog with BodySection objects
4. ✅ SEO agent optimizes content with keyword_placement as JSON string
5. ✅ Social repurposing agent creates social and email content
6. ✅ Human approval shows all content previews
7. ✅ Artifacts are saved successfully

## Compatibility

These changes maintain backward compatibility:
- Code that accesses `section['heading']` still works (we handle both dict and object access)
- `keyword_placement` can be parsed as JSON when needed
- All existing functionality is preserved

## Alternative Solution (Not Used)

We could have used `method="function_calling"` instead of structured output:

```python
structured_llm = llm.with_structured_output(BlogDraft, method="function_calling")
```

However, this would be less reliable and slower. The schema fix is the better approach.

## References

- [OpenAI Structured Outputs Documentation](https://platform.openai.com/docs/guides/structured-outputs#supported-schemas)
- [LangChain with_structured_output](https://python.langchain.com/docs/how_to/structured_output/)
- [Pydantic Models](https://docs.pydantic.dev/latest/concepts/models/)

## Status

✅ **All fixes applied and tested**

The system now works correctly with OpenAI's structured output feature.
