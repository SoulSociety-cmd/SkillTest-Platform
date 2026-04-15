import Docker from 'dockerode';
import OpenAI from 'openai';
import { TEST_CASES, TestId } from './testCases';
import connectDB from './db';
import { Submission } from './models';

const docker = new Docker();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function productionGrade(testId: TestId, code: string, language: string = 'js'): Promise<{
  score: number;
  unitPassed: number;
  unitTotal: number;
  playwrightPassed: number;
  eslintScore: number;
  aiBonus: number;
  feedback: string;
  results: any;
  progress: string[];
}> {
  const progress = ['Starting Docker sandbox...'];
  
  // 1. Ensure sandbox container running (10%)
  let container = docker.getContainer('skilltest-sandbox');
  let containerInfo = await container.inspect();
  if (containerInfo.State.Status !== 'running') {
    container = await docker.createContainer({
      Image: 'skilltest-sandbox',
      name: 'skilltest-sandbox',
      Ports: [{ '3000/tcp': 3001 }],
      HostConfig: {
        NetworkMode: 'skilltest-nextjs-mvp_default', // from compose
      }
    });
    await container.start();
  }
  progress.push('Sandbox ready');

  const testCase = TEST_CASES[testId];
  progress.push('Running unit tests...');

  // 2. POST to sandbox (40%)
  const sandboxRes = await fetch('http://localhost:3001/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, testCases: testCase.testCases, language, type: testCase.type || 'unit' }),
  });
  const sandboxResults = await sandboxRes.json();
  progress.push('Unit tests complete');

  // 3. Playwright handled in sandbox

  // 4. OpenAI review (80%)
  progress.push('AI code review...');
  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `Review this ${language} code for ${testId}:
\`\`\`${language}
${code}
\`\`\`

Test results: ${JSON.stringify(sandboxResults, null, 2)}

Give score bonus 0-20 for: best practices, efficiency, readability. JSON: {"bonus": number, "feedback": string}`
    }],
  });
  const aiResult = JSON.parse(aiResponse.choices[0].message.content || '{}');
  
  // 5. Final score (100%)
  const unitScore = (sandboxResults.testsPassed / sandboxResults.totalTests) * 40;
  const pwScore = sandboxResults.playwrightPassed ? (sandboxResults.playwrightPassed / testCase.testCases.length) * 30 : 0;
  const qualityScore = sandboxResults.eslintScore * 0.2;
  const totalScore = Math.round(unitScore + pwScore + qualityScore + aiResult.bonus);

  const fullResults = {
    score: totalScore,
    unitPassed: sandboxResults.testsPassed,
    unitTotal: sandboxResults.totalTests,
    playwrightPassed: sandboxResults.playwrightPassed || 0,
    eslintScore: sandboxResults.eslintScore,
    aiBonus: aiResult.bonus || 0,
    feedback: aiResult.feedback || '',
    raw: sandboxResults,
  };

  progress.push('Grading complete');
  return { ...fullResults, progress, results: fullResults };
}

// Graceful Docker cleanup
process.on('SIGINT', async () => {
  try {
    const container = docker.getContainer('skilltest-sandbox');
    await container.stop();
  } catch {}
  process.exit();
});

export default productionGrade;

