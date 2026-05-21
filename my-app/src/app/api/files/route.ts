import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Handle GET request at /api/files?run=...&file=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get('run');
    const filename = searchParams.get('file');

    if (!runId || !filename) {
      return NextResponse.json({ error: 'run and file parameters required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'runs', runId, filename);

    // Security: ensure the resolved path is within the runs/<runId> directory
    const runPath = path.join(process.cwd(), 'runs', runId);
    const resolved = path.resolve(filePath);
    const resolvedRunPath = path.resolve(runPath);
    
    if (!resolved.startsWith(resolvedRunPath)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const ext = path.extname(filename);
      
      let contentType = 'text/plain';
      if (ext === '.json') contentType = 'application/json';
      else if (ext === '.md') contentType = 'text/markdown';
      else if (ext === '.log') contentType = 'text/plain';
      else if (ext === '.txt') contentType = 'text/plain';

      return new NextResponse(content, { 
        headers: { 'Content-Type': `${contentType}; charset=utf-8` } 
      });
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        return NextResponse.json({ error: `File not found: ${filename}` }, { status: 404 });
      }
      throw e;
    }
  } catch (e: any) {
    console.error('Artifact fetch error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
