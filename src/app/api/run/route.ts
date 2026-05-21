import { NextResponse } from 'next/server';
import { runWorkflow } from '@/lib/orchestrator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const brief = body.brief || body;
    const runId = `run_${Date.now()}`;
    const result = await runWorkflow(runId, brief);
    return NextResponse.json({ run_id: runId, result });
  } catch (e:any) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}


