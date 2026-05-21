import fs from 'fs';

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function openaiChat(messages: Array<{role: string; content: string}>) {
  if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY not set');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      temperature: Number(process.env.OPENAI_TEMPERATURE || 0.7),
      max_tokens: Number(process.env.OPENAI_MAX_TOKENS || 2000),
    }),
  });
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  return content;
}
