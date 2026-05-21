import fs from 'fs/promises';
import path from 'path';
import { openaiChat } from '../llm';
import { SEOReportSchema } from '../schemas';
import { log, saveArtifact } from '../logging';

function loadPrompt(name: string) {
  const p = path.join(process.cwd(), 'prompts', name);
  return fs.readFile(p, 'utf-8');
}

export async function runSEO(runId: string, research: any, blog: any) {
  const system = await loadPrompt('seo.txt');
  const blogContent = [`# ${blog.title}`, blog.introduction, ...(blog.body_sections||[]).map((s:any)=>`## ${s.heading}\n${s.content}`), blog.conclusion||'', blog.call_to_action||''].join('\n\n');
  const user = `Optimize this blog for SEO. Primary: ${(research.keyword_analysis?.primary_keywords||[]).join(', ')}; Secondary: ${(research.keyword_analysis?.secondary_keywords||[]).join(', ')}; Blog: ${blogContent}\nReturn JSON matching SEOReport schema.`;
  await log(runId, 'info', 'Starting SEO agent');
  const content = await openaiChat([{ role: 'system', content: system }, { role: 'user', content: user }]);
  try {
    const parsed = (await import('../json')).extractJSON(content || '');

    // Save raw model output for debugging
    await saveArtifact(runId, 'seo_raw_output.txt', content || '');

    // Normalize parsed output to expected types
    async function normalizeSEO(obj:any) {
      if (!obj || typeof obj !== 'object') return obj;
      const out_raw = JSON.parse(JSON.stringify(obj));

      // Handle potential wrapper keys like 'seo', 'seo_report', etc.
      const keys = Object.keys(out_raw);
      const seoKey = keys.find(k => ['seo', 'seo_report', 'seoreport', 'optimization'].includes(k.toLowerCase()));
      const out = seoKey ? out_raw[seoKey] : out_raw;

      // keyword_placement: accept object or string; convert to record<string, number>
      if (typeof out.keyword_placement === 'string') {
        const s = out.keyword_placement;
        // Try to extract JSON from string
        try {
          const maybe = (await import('../json')).extractJSON(s);
          if (maybe && typeof maybe === 'object') {
            out.keyword_placement = Object.fromEntries(Object.entries(maybe).map(([k,v])=>[k, Number(v)||0]));
          } else {
            throw new Error('Not JSON');
          }
        } catch (e) {
          // fallback: parse lines like "keyword: 5" or "keyword1: 5, keyword2: 3"
          const m = {} as Record<string, number>;
          // Replace commas with newlines to handle "k1: v1, k2: v2" format
          const lines = s.replace(/,/g, '\n').split('\n');
          for (const line of lines) {
            const parts = line.split(':');
            if (parts.length >=2) {
              const key = parts[0].trim();
              const val = parseInt(parts[1].trim().split(/\s+/)[0], 10) || 0;
              if (key) m[key] = val;
            }
          }
          out.keyword_placement = m;
        }
      } else if (typeof out.keyword_placement === 'object' && out.keyword_placement !== null) {
        // coerce values to numbers
        out.keyword_placement = Object.fromEntries(Object.entries(out.keyword_placement).map(([k,v])=>[k, Number(v)||0]));
      } else {
        out.keyword_placement = {};
      }

      // internal_link_suggestions: ensure array of strings
      if (Array.isArray(out.internal_link_suggestions)) {
        out.internal_link_suggestions = out.internal_link_suggestions.map((x:any)=>{
          if (typeof x === 'string') {
            // Check if it's stringified JSON
            if (x.trim().startsWith('{')) {
              try {
                const j = JSON.parse(x);
                return j.anchor_text || j.text || j.link || j.url || x;
              } catch(e) { return x; }
            }
            return x;
          }
          if (x && typeof x === 'object') return x.anchor_text || x.text || x.anchor || x.url || x.link || JSON.stringify(x);
          return String(x);
        });
      } else if (typeof out.internal_link_suggestions === 'string') {
        // try to parse as JSON array
        try {
          const arr = JSON.parse(out.internal_link_suggestions);
          if (Array.isArray(arr)) {
            out.internal_link_suggestions = arr.map((x:any)=> {
              if (typeof x === 'string') return x;
              if (x && typeof x === 'object') return x.anchor_text || x.text || x.anchor || x.url || x.link || JSON.stringify(x);
              return String(x);
            });
          }
          else out.internal_link_suggestions = [out.internal_link_suggestions];
        } catch (e) {
          // split lines
          out.internal_link_suggestions = out.internal_link_suggestions.split('\n').map((s:string)=>s.trim()).filter(Boolean);
        }
      } else {
        out.internal_link_suggestions = [];
      }

      // Ensure other fields exist
      out.meta_title = out.meta_title || out.title || '';
      out.meta_description = out.meta_description || out.description || '';
      out.optimized_title = out.optimized_title || out.meta_title || '';
      out.optimized_content = out.optimized_content || out.content || out.blog || out.optimized_blog || '';

      return out;
    }

    try {
      const normalized = await normalizeSEO(parsed);
      const validated = SEOReportSchema.parse(normalized);
      await saveArtifact(runId, 'seo.json', JSON.stringify(validated, null, 2));
      await log(runId, 'info', 'SEO completed');
      return validated;
    } catch (e) {
      await log(runId, 'error', `SEO parsing/validation error: ${String(e)}`);
      throw e;
    }
  } catch (e) {
    await log(runId, 'error', `SEO parsing/validation error: ${String(e)}`);
    throw e;
  }
}
