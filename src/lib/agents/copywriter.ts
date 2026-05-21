import fs from 'fs/promises';
import path from 'path';
import { openaiChat } from '../llm';
import { BlogDraftSchema } from '../schemas';
import { log, saveArtifact } from '../logging';

function loadPrompt(name: string) {
  const p = path.join(process.cwd(), 'prompts', name);
  return fs.readFile(p, 'utf-8');
}

export async function runCopywriter(runId: string, brief: any, research: any) {
  const system = await loadPrompt('copywriter.txt');
  const user = `Write a blog post based on brief and research.\nBrief Topic: ${brief.topic}\nCampaign Goal: ${brief.campaign_goal}\nBrand Voice: ${brief.brand_voice}\nResearch Summary: ${research.summary}\nPrimary Keywords: ${(research.keyword_analysis?.primary_keywords || []).join(', ')}\nReturn JSON matching BlogDraft schema.`;
  await log(runId, 'info', 'Starting copywriter agent');
  const content = await openaiChat([{ role: 'system', content: system }, { role: 'user', content: user }]);
  try {
    const parsed = (await import('../json')).extractJSON(content || '');
    const validated = BlogDraftSchema.parse(parsed);
    await saveArtifact(runId, 'blog_draft.json', JSON.stringify(validated, null, 2));
    await log(runId, 'info', 'Copywriter completed');
    return validated;
  } catch (e) {
    await log(runId, 'error', `Copywriter parsing/validation error: ${String(e)}`);
    throw e;
  }
}
