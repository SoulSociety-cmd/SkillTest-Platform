const OpenAI = require('openai');

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

/**
 * PERFECT AI GRADING SYSTEM FOR SKILLTEST
 * GPT-4o System Prompt for Professional Code Evaluation
 * Outputs STRICT JSON: technicalScore, codeQuality, problemSolving, overall, feedback (3-paragraphs), hireRecommendation
 */

const SYSTEM_PROMPT = `You are an expert software engineer and technical recruiter with 10+ years experience hiring at FAANG companies.

EVALUATE the following code submission EXACTLY according to these criteria:

INPUT CONTEXT:
- Language: {{language}}
- Test Results: {{testsPassed}}/{{testsTotal}} automated tests passed
- Time: {{timeSpent}}/{{timeMax}} minutes (efficiency factor)
- Code: {{code}}

SCORING RUBRIC (0.0-10.0 scale, 1 decimal):
1. technicalScore: Correctness + test coverage + edge cases (testsPassed/total * 10, adjusted for edge cases/time)
2. codeQuality: Clean code, DRY, naming, structure, comments, error handling, security
3. problemSolving: Algorithm efficiency, optimal solution, creativity, scalability considerations
4. overall: (technicalScore*0.5 + codeQuality*0.3 + problemSolving*0.2). Round to 1 decimal

FEEDBACK: EXACTLY 3 paragraphs:
- Paragraph 1: Key strengths and what was done exceptionally well
- Paragraph 2: Specific areas for improvement with actionable suggestions
- Paragraph 3: Overall assessment and growth recommendations

HIRE RECOMMENDATION: Based on overall score:
- 9.5+: "Strong Senior" 
- 9.0+: "Senior"
- 8.5+: "Strong Mid-level"
- 8.0+: "Mid-level" 
- 7.5+: "Strong Junior"
- 7.0+: "Junior"
- Below 7.0: "Junior with mentorship needed"

REQUIREMENTS:
- Respond with ONLY valid JSON. No other text.
- All scores 0.0-10.0 with 1 decimal place
- feedback exactly 3 paragraphs separated by double newlines
- Scores MUST reflect input data (high tests=time pressure=high technicalScore)
`;

const SAMPLE_PROMPTS = [
  {
    name: "JavaScript Array Algorithm",
    language: "JavaScript",
    code: `function findDuplicates(arr) {
      return arr.filter((item, index) => arr.indexOf(item) !== index);
    }`,
    testsPassed: 8,
    testsTotal: 10,
    timeSpent: 12,
    timeMax: 15
  },
  {
    name: "Python API Endpoint",
    language: "Python",
    code: `from flask import Flask, request
app = Flask(__name__)

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    return {'id': 1, 'name': data['name']}, 201`,
    testsPassed: 9,
    testsTotal: 10,
    timeSpent: 10,
    timeMax: 20
  },
  {
    name: "React Component",
    language: "JavaScript (React)",
    code: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}`,
    testsPassed: 7,
    testsTotal: 10,
    timeSpent: 18,
    timeMax: 25
  },
  {
    name: "SQL Query Optimization",
    language: "SQL",
    code: `SELECT u.name, COUNT(o.id) as orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY orders DESC;`,
    testsPassed: 10,
    testsTotal: 10,
    timeSpent: 8,
    timeMax: 15
  },
  {
    name: "CSS Flexbox Layout",
    language: "CSS",
    code: `.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.item { flex: 1; }`,
    testsPassed: 9,
    testsTotal: 10,
    timeSpent: 5,
    timeMax: 10
  }
];

class PerfectAIGrader {
  static async gradeSubmission({
    code,
    testResults = { passed: 0, total: 0 },
    timeSpent = 0,
    timeMax = 0,
    language = 'JavaScript'
  }) {
    const { passed, total } = testResults;
    
    // Template prompt
    const fullPrompt = SYSTEM_PROMPT
      .replace('{{language}}', language)
      .replace('{{testsPassed}}', passed.toString())
      .replace('{{testsTotal}}', total.toString())
      .replace('{{timeSpent}}', timeSpent.toString())
      .replace('{{timeMax}}', timeMax.toString())
      .replace('{{code}}', code);

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a precise JSON generator. Follow instructions exactly.' },
          { role: 'user', content: fullPrompt }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const jsonStr = completion.choices[0].message.content;
      const result = JSON.parse(jsonStr);

      // Validate structure
      const required = ['technicalScore', 'codeQuality', 'problemSolving', 'overall', 'feedback', 'hireRecommendation'];
      for (const key of required) {
        if (!result[key]) {
          throw new Error(`Missing ${key} in AI response`);
        }
      }

      return {
        success: true,
        ...result,
        rawPrompt: fullPrompt,
        aiModel: 'gpt-4o'
      };

    } catch (error) {
      console.error('AI Grading Error:', error.message);
      
      // Fallback deterministic scoring
      const testScore = (passed / total) * 10;
      const timeFactor = timeMax > 0 ? Math.max(0, 10 - (timeSpent / timeMax) * 5) : 5;
      
      return {
        success: false,
        technicalScore: Math.round(testScore * 10) / 10,
        codeQuality: 5.0,
        problemSolving: timeFactor,
        overall: Math.round((testScore * 0.5 + 5 * 0.3 + timeFactor * 0.2) * 10) / 10,
        feedback: `AI grading unavailable: ${error.message}\n\nBasic evaluation: ${passed}/${total} tests passed.\n\nManual review recommended.`,
        hireRecommendation: 'Review Required',
        error: error.message
      };
    }
  }

  // Test with samples
  static async testSamples() {
    console.log('🧪 Testing 5 Sample Prompts...');
    for (const sample of SAMPLE_PROMPTS) {
      console.log(`\n--- ${sample.name} ---`);
      const result = await this.gradeSubmission(sample);
      console.log(JSON.stringify(result, null, 2));
    }
  }
}

module.exports = { PerfectAIGrader, SAMPLE_PROMPTS };
