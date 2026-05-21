import fs from 'fs/promises';
import path from 'path';
import { openaiChat } from '../llm';
import { ResearchReportSchema } from '../schemas';
import { log, saveArtifact } from '../logging';

function loadPrompt(name: string) {
  const p = path.join(process.cwd(), 'prompts', name);
  return fs.readFile(p, 'utf-8');
}

export async function runResearch(runId: string, brief: any) {
  const system = await loadPrompt('research.txt');
  const user = `Conduct comprehensive research for this marketing brief:\nTopic: ${brief.topic}\nCampaign Goal: ${brief.campaign_goal}\nTarget Audience: ${brief.target_audience}\nBrand Voice: ${brief.brand_voice || ''}\nKeywords: ${brief.keywords?.join(', ') || ''}\nAdditional Context: ${brief.additional_context || ''}\nReturn JSON matching the ResearchReport schema.`;
  await log(runId, 'info', 'Starting research agent');
  const content = await openaiChat([{ role: 'system', content: system }, { role: 'user', content: user }]);
  try {
    const parsed = (await import('../json')).extractJSON(content || '');

    // Normalize model output to match expected schema types
    function normalizeResearch(obj:any) {
      if (!obj || typeof obj !== 'object') return obj;
      const out = JSON.parse(JSON.stringify(obj));

      // keyword_analysis normalization
      if (out.keyword_analysis && typeof out.keyword_analysis === 'object') {
        const ka = out.keyword_analysis;
        if (ka.search_intent && typeof ka.search_intent !== 'string') {
          if (typeof ka.search_intent === 'object') {
            ka.search_intent = ka.search_intent.text || ka.search_intent.intent || JSON.stringify(ka.search_intent);
          } else {
            ka.search_intent = String(ka.search_intent || '');
          }
        }
        if (Array.isArray(ka.primary_keywords)) {
          ka.primary_keywords = ka.primary_keywords.map((k:any)=> typeof k === 'string' ? k : (k && (k.text || k.keyword) ? (k.text || k.keyword) : JSON.stringify(k)));
        }
        if (Array.isArray(ka.secondary_keywords)) {
          ka.secondary_keywords = ka.secondary_keywords.map((k:any)=> typeof k === 'string' ? k : (k && (k.text || k.keyword) ? (k.text || k.keyword) : JSON.stringify(k)));
        }
      }

      // recommended_angles normalization: ensure array of strings
      if (Array.isArray(out.recommended_angles)) {
        out.recommended_angles = out.recommended_angles.map((a:any)=> {
          if (typeof a === 'string') return a;
          if (a && typeof a === 'object') return a.text || a.angle || JSON.stringify(a);
          return String(a);
        });
      }

      return out;
    }

    const normalized = normalizeResearch(parsed);
    const validated = ResearchReportSchema.parse(normalized);
    await saveArtifact(runId, 'research.json', JSON.stringify(validated, null, 2));
    await log(runId, 'info', 'Research completed');
    return validated;
  } catch (e) {
    await log(runId, 'error', `Research parsing/validation error: ${String(e)}`);
    throw e;
  }
}
