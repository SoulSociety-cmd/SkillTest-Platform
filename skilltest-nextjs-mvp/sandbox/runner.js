const http = require('http');
const { spawn } = require('child_process');
const vm2 = require('vm2');
const { chromium } = require('playwright');
const { ESLint } = require('eslint');
const bigo = require('js-big-o');

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/run') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { code, testCases, type = 'js', language = 'js' } = JSON.parse(body);
        
        const results = {
          testsPassed: 0,
          totalTests: testCases.length,
          eslintScore: 0,
          bigOScore: '',
          playwrightPassed: 0,
          errors: [],
          output: ''
        };

        // 1. Unit tests in VM (JS) or Python spawn
        if (language === 'js') {
          const vm = new vm2.VM({
            timeout: 5000,
            sandbox: { console },
            require: { external: false }
          });

          for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            try {
              const userFn = vm.run(`(${code})`);
              const output = userFn(...tc.input);
              if (String(output).trim() === String(tc.expected).trim()) {
                results.testsPassed++;
              }
            } catch (e) {
              results.errors.push(`Test ${i+1}: ${e.message}`);
            }
          }
        } else if (language === 'python') {
          // Python exec via spawn
          for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const pyCode = `${code}\nprint(solution(${JSON.stringify(tc.input)}))`;
            const pyProcess = spawn('python3', ['-c', pyCode]);
            let output = '';
            pyProcess.stdout.on('data', (data) => output += data.toString());
            pyProcess.stderr.on('data', (data) => results.errors.push(data.toString()));
            await new Promise((resolve) => pyProcess.on('close', resolve));
            if (output.trim() === String(tc.expected).trim()) {
              results.testsPassed++;
            }
          }
        }

        // 2. ESLint
        const eslint = new ESLint({ useEslintRc: false });
        const eslintResults = await eslint.lintText(code);
        const errors = eslintResults[0]?.messages || [];
        results.eslintScore = Math.max(0, 100 - (errors.length * 5));

        // 3. Big-O
        try {
          results.bigOScore = bigo(code).timeComplexity;
        } catch (e) {}

        // 4. Playwright E2E (for frontend tests)
        if (type === 'frontend') {
          const browser = await chromium.launch({ headless: true });
          const page = await browser.newPage();
          await page.setContent(code);
          // Run testCases as DOM interactions
          for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            try {
              // Example: click button, assert text
              await page.click(tc.selector || 'button');
              await expect(page.locator(tc.assertSelector)).toHaveText(tc.expected);
              results.playwrightPassed++;
            } catch (e) {
              results.errors.push(`PW Test ${i+1}: ${e.message}`);
            }
          }
          await browser.close();
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Production Sandbox ready on port 3000');
});

