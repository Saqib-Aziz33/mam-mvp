import { z } from 'zod';

export const ResearchReportSchema = z.object({
  summary: z.string(),
  keyword_analysis: z.object({
    primary_keywords: z.array(z.string()).optional().default([]),
    secondary_keywords: z.array(z.string()).optional().default([]),
    search_intent: z.string().optional().default('')
  }).optional(),
  competitor_insights: z.array(z.any()).optional().default([]),
  content_opportunities: z.array(z.string()).optional().default([]),
  recommended_angles: z.array(z.string()).optional().default([]),
  sources: z.array(z.string()).optional().default([])
});

export const BodySection = z.object({ heading: z.string(), content: z.string() });
export const BlogDraftSchema = z.object({
  title: z.string(),
  introduction: z.string(),
  body_sections: z.array(BodySection).optional().default([]),
  conclusion: z.string().optional().default(''),
  call_to_action: z.string().optional().default(''),
  word_count: z.number().optional().default(0)
});

export const SEOReportSchema = z.object({
  meta_title: z.string().optional().default(''),
  meta_description: z.string().optional().default(''),
  optimized_title: z.string().optional().default(''),
  optimized_content: z.string().optional().default(''),
  heading_structure: z.array(z.string()).optional().default([]),
  keyword_placement: z.record(z.string(), z.number()).optional().default({}),
  internal_link_suggestions: z.array(z.string()).optional().default([]),
  seo_score: z.string().optional().default('')
});

export const SocialAssetsSchema = z.object({
  posts: z.array(z.object({ platform: z.string(), content: z.string(), hashtags: z.array(z.string()).optional(), character_count: z.number().optional() })).optional().default([]),
  content_calendar_notes: z.string().optional().default('')
});

export const EmailAssetsSchema = z.object({
  subject_line: z.string().optional().default(''),
  preview_text: z.string().optional().default(''),
  email_body: z.string().optional().default(''),
  cta_text: z.string().optional().default('')
});
