export function extractJSON(text: string) {
  if (!text) return null;

  // If model returned a fenced code block like ```json { ... } ``` capture inner content
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenceMatch ? fenceMatch[1] : text;

  // Try to find first { and last } to extract a JSON object
  const firstBrace = candidate.indexOf('{');
  const lastBrace = candidate.lastIndexOf('}');
  const jsonText = (firstBrace !== -1 && lastBrace !== -1) ? candidate.slice(firstBrace, lastBrace + 1) : candidate;

  try {
    return JSON.parse(jsonText);
  } catch (e:any) {
    // Rethrow a helpful error that includes a snippet of the original text
    const snippet = (candidate || '').slice(0, 1000);
    throw new SyntaxError(`Failed to parse JSON from model output: ${e.message}. Snippet: ${snippet}`);
  }
}
