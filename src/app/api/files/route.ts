import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { artifacts } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

// Handle GET request at /api/files?run=...&file=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get('run');
    const filename = searchParams.get('file');

    if (!runId || !filename) {
      return NextResponse.json({ error: 'run and file parameters required' }, { status: 400 });
    }

    const artifact = await db.query.artifacts.findFirst({
      where: and(
        eq(artifacts.runId, runId),
        eq(artifacts.filename, filename)
      )
    });

    if (!artifact) {
      return NextResponse.json({ error: `Artifact not found: ${filename}` }, { status: 404 });
    }

    let contentType = 'text/plain';
    if (filename.endsWith('.json')) contentType = 'application/json';
    else if (filename.endsWith('.md')) contentType = 'text/markdown';
    else if (filename.endsWith('.log')) contentType = 'text/plain';

    return new NextResponse(artifact.content, { 
      headers: { 'Content-Type': `${contentType}; charset=utf-8` } 
    });

  } catch (e: any) {
    console.error('Artifact fetch error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
