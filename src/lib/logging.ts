import fs from 'fs/promises';
import path from 'path';

export async function ensureRunDir(runId: string) {
  const dir = path.join(process.cwd(), 'runs', runId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function log(runId: string, level: string, message: string) {
  const dir = await ensureRunDir(runId);
  const file = path.join(dir, 'run.log');
  const ts = new Date().toISOString();
  await fs.appendFile(file, `[${ts}] ${level.toUpperCase()} ${message}\n`);
}

export async function saveArtifact(runId: string, filename: string, content: string) {
  const dir = await ensureRunDir(runId);
  const file = path.join(dir, filename);
  await fs.writeFile(file, content, 'utf-8');
  return file;
}
