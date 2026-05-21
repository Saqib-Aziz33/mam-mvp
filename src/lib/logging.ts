import { db } from './db';
import { logs, artifacts, runs } from './db/schema';
import { eq } from 'drizzle-orm';

export async function ensureRunRecord(runId: string, brief: any = {}) {
  const existing = await db.query.runs.findFirst({
    where: eq(runs.runId, runId),
  });

  if (!existing) {
    await db.insert(runs).values({
      runId,
      brief,
      status: 'pending',
    });
  }
}

export async function log(runId: string, level: string, message: string) {
  await ensureRunRecord(runId);
  await db.insert(logs).values({
    runId,
    level,
    message,
  });
  console.log(`[${runId}] ${level.toUpperCase()}: ${message}`);
}

export async function saveArtifact(runId: string, filename: string, content: string) {
  await ensureRunRecord(runId);
  const type = filename.endsWith('.json') ? 'json' : 'markdown';
  
  await db.insert(artifacts).values({
    runId,
    filename,
    content,
    type,
  });
  
  return `db://${runId}/${filename}`;
}

export async function updateRunStatus(runId: string, status: string) {
  await db.update(runs)
    .set({ status, updatedAt: new Date() })
    .where(eq(runs.runId, runId));
}

export async function updateRunData(runId: string, data: Partial<typeof runs.$inferInsert>) {
  await db.update(runs)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(runs.runId, runId));
}
