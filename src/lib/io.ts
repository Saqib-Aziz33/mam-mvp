import { saveArtifact as saveFile, ensureRunDir } from './logging';
import fs from 'fs/promises';
import path from 'path';

export async function saveFinalPackage(runId: string, pkg: any) {
  const saved: Record<string,string> = {};

  // Save final package JSON
  saved['package'] = await saveFile(runId, 'final_package.json', JSON.stringify(pkg, null, 2));

  // Save brief
  saved['brief'] = await saveFile(runId, 'brief.json', JSON.stringify(pkg.brief || {}, null, 2));

  // Save research
  saved['research'] = await saveFile(runId, 'research.json', JSON.stringify(pkg.research || {}, null, 2));

  // Save blog markdown
  const blogMd = formatBlogMarkdown(pkg.blog || pkg.blog_draft);
  saved['blog'] = await saveFile(runId, 'blog.md', blogMd);

  // Save seo optimized content
  const seoContent = (pkg.seo && pkg.seo.optimized_content) || (pkg.seo_optimized_blog && pkg.seo_optimized_blog.optimized_content) || '';
  saved['seo_blog'] = await saveFile(runId, 'seo_blog.md', seoContent || '');

  // Save social markdown
  const socialMd = formatSocialMarkdown(pkg.social || pkg.social_assets);
  saved['social'] = await saveFile(runId, 'social.md', socialMd);

  // Save email markdown
  const emailMd = formatEmailMarkdown(pkg.email || pkg.email_assets);
  saved['email'] = await saveFile(runId, 'email.md', emailMd);

  return saved;
}

export function formatBlogMarkdown(blog: any) {
  if (!blog) return '';
  const lines: string[] = [];
  lines.push(`# ${blog.title || ''}\n`);
  lines.push(`## Introduction\n`);
  lines.push(`${blog.introduction || ''}\n`);
  (blog.body_sections || []).forEach((section: any) => {
    const heading = section.heading || section.title || '';
    const content = section.content || section.body || '';
    lines.push(`## ${heading}\n`);
    lines.push(`${content}\n`);
  });
  lines.push('## Conclusion\n');
  lines.push(`${blog.conclusion || ''}\n`);
  if (blog.call_to_action) lines.push(`**${blog.call_to_action}**\n`);
  if (blog.word_count) lines.push(`\n---\nWord count: ${blog.word_count}`);
  return lines.join('\n');
}

export function formatSocialMarkdown(social: any) {
  if (!social || typeof social !== 'object') return '';
  const lines: string[] = [];
  lines.push('# Social Media Posts\n');
  
  const posts = social.posts || [];
  if (Array.isArray(posts) && posts.length > 0) {
    posts.forEach((post: any) => {
      lines.push(`## ${post.platform || 'Unknown Platform'}\n`);
      lines.push(`${post.content || ''}\n`);
      if (post.hashtags) {
        const tags = Array.isArray(post.hashtags) ? post.hashtags.join(' ') : String(post.hashtags);
        if (tags) lines.push(`**Hashtags:** ${tags}\n`);
      }
      if (post.character_count) lines.push(`*Character count: ${post.character_count}*\n`);
      lines.push('');
    });
  }

  if (social.content_calendar_notes) lines.push(`## Content Calendar Notes\n${social.content_calendar_notes}\n`);
  
  return lines.join('\n').trim();
}

export function formatEmailMarkdown(email: any) {
  if (!email || typeof email !== 'object') return '';
  const lines: string[] = [];
  lines.push('# Email Campaign\n');
  
  if (email.subject_line) lines.push(`## Subject Line\n${email.subject_line}\n`);
  if (email.preview_text) lines.push(`## Preview Text\n${email.preview_text}\n`);
  if (email.email_body) lines.push(`## Email Body\n${email.email_body}\n`);
  if (email.cta_text) lines.push(`## Call to Action\n${email.cta_text}\n`);
  
  return lines.join('\n').trim();
}
