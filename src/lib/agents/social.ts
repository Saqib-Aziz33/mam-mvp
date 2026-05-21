import fs from 'fs/promises';
import path from 'path';
import { openaiChat } from '../llm';
import { SocialAssetsSchema, EmailAssetsSchema } from '../schemas';
import { log, saveArtifact } from '../logging';

function loadPrompt(name: string) {
  const p = path.join(process.cwd(), 'prompts', name);
  return fs.readFile(p, 'utf-8');
}

export async function runSocial(runId: string, brief: any, blog: any, seo: any) {
  const system = await loadPrompt('social.txt');
  const userSocial = `Create social posts and email for blog titled: ${blog.title}. Meta: ${seo.meta_description}. Key points: ${(blog.body_sections||[]).slice(0,3).map((s:any)=>s.heading+': '+s.content.slice(0,120)).join('; ')}. Return JSON for SocialAssets and EmailAssets.`;
  await log(runId, 'info', 'Starting social agent');
  const content = await openaiChat([{ role: 'system', content: system }, { role: 'user', content: userSocial }]);
  try {
    // Save raw output for debugging
    await saveArtifact(runId, 'social_raw_output.txt', content || '');

    // Extract JSON
    const parsed = (await import('../json')).extractJSON(content || '');

    // Normalize social assets
    function normalizeSocial(obj: any) {
      if (!obj || typeof obj !== 'object') return { posts: [], content_calendar_notes: '' };
      const out = JSON.parse(JSON.stringify(obj));

      // Handle different response structures (case-insensitive search for social keys)
      const keys = Object.keys(out);
      const socialKey = keys.find(k => ['social', 'social_assets', 'socialassets', 'social_posts', 'posts'].includes(k.toLowerCase()));
      
      let socialObj = socialKey ? out[socialKey] : out;

      // If it's just an array of posts, wrap it
      if (Array.isArray(socialObj)) {
        socialObj = { posts: socialObj };
      } else if (socialObj && !socialObj.posts && Array.isArray(out.posts)) {
        socialObj = { ...socialObj, posts: out.posts };
      }

      // Ensure posts is array of objects with required fields
      if (!socialObj || !Array.isArray(socialObj.posts)) {
        socialObj = { ...(socialObj || {}), posts: Array.isArray(socialObj) ? socialObj : [] };
      }

      socialObj.posts = (socialObj.posts || []).map((p: any) => ({
        platform: p.platform || p.social_platform || 'Unknown',
        content: p.content || p.post_content || p.text || '',
        hashtags: Array.isArray(p.hashtags) ? p.hashtags : (typeof p.hashtags === 'string' ? p.hashtags.split(/[\s,]+/).map((s:string)=>s.trim()).filter(Boolean) : []),
        character_count: Number(p.character_count || p.char_count || (p.content || '').length || 0)
      }));

      socialObj.content_calendar_notes = typeof socialObj.content_calendar_notes === 'string' 
        ? socialObj.content_calendar_notes 
        : JSON.stringify(socialObj.content_calendar_notes || '');

      return socialObj;
    }

    // Normalize email assets
    function normalizeEmail(obj: any) {
      if (!obj || typeof obj !== 'object') return { subject_line: '', preview_text: '', email_body: '', cta_text: '' };
      const out = JSON.parse(JSON.stringify(obj));

      // Handle different response structures (case-insensitive search for email keys)
      const keys = Object.keys(out);
      const emailKey = keys.find(k => ['email', 'email_assets', 'emailassets', 'email_campaign', 'newsletter'].includes(k.toLowerCase()));
      
      let emailObj = emailKey ? out[emailKey] : out;

      return {
        subject_line: emailObj.subject_line || emailObj.subject || emailObj.title || '',
        preview_text: emailObj.preview_text || emailObj.preheader || emailObj.preview || '',
        email_body: emailObj.email_body || emailObj.body || emailObj.content || emailObj.text || '',
        cta_text: emailObj.cta_text || emailObj.cta || emailObj.call_to_action || emailObj.button_text || ''
      };
    }

    const social = SocialAssetsSchema.parse(normalizeSocial(parsed));
    const email = EmailAssetsSchema.parse(normalizeEmail(parsed));
    
    await saveArtifact(runId, 'social.json', JSON.stringify(social, null, 2));
    await saveArtifact(runId, 'email.json', JSON.stringify(email, null, 2));
    await log(runId, 'info', `Social/email completed: ${social.posts.length} posts, email subject: "${email.subject_line}"`);
    return { social, email };
  } catch (e) {
    await log(runId, 'error', `Social parsing/validation error: ${String(e)}`);
    throw e;
  }
}
