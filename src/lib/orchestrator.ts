import { runResearch } from './agents/research';
import { runCopywriter } from './agents/copywriter';
import { runSEO } from './agents/seo';
import { runSocial } from './agents/social';
import { log, saveArtifact } from './logging';

export async function runWorkflow(runId: string, brief: any) {
  await log(runId, 'info', 'Workflow starting');
  await saveArtifact(runId, 'brief.json', JSON.stringify(brief, null, 2));
  try {
    const research = await runResearch(runId, brief);
    const blog = await runCopywriter(runId, brief, research);
    const seo = await runSEO(runId, research, blog);
    const { social, email } = await runSocial(runId, brief, blog, seo);

    // Assemble final package
    const packageObj = {
      run_id: runId,
      brief,
      research,
      blog,
      seo,
      social,
      email,
      created_at: new Date().toISOString()
    };

    // Save final artifacts (markdown and JSON)
    try {
      const { saveFinalPackage } = await import('./io');
      const saved = await saveFinalPackage(runId, packageObj);
      await log(runId, 'info', `Saved final artifacts: ${Object.keys(saved).join(', ')}`);
    } catch (ioErr:any) {
      await log(runId, 'error', `Failed saving final artifacts: ${String(ioErr)}`);
    }

    await log(runId, 'info', 'Workflow completed');
    return { research, blog, seo, social, email };
  } catch (e) {
    await log(runId, 'error', `Workflow failed: ${String(e)}`);
    throw e;
  }
}
