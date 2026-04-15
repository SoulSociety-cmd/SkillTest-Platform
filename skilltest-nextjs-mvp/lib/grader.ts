import { NodeVM } from 'vm2'

const testCases = [
  { input: [2, '+', 2], expected: 4 },
  { input: [5, '-', 3], expected: 2 },
  { input: [4, '*', 3], expected: 12 },
]

export async function gradeCalculator(code: string): Promise<{
  score: number
  passed: number
  total: number
  results: Array<{
    passed: boolean
    input: [number, string, number]
    expected: number
    output?: number
  }>
}> {
  const vm = new NodeVM({
    sandbox: { console: console },
    eval: true,
    wasm: false,
    require: {
      external: false,
    },
  })

  const results = []
  let passed = 0

  for (const tc of testCases) {
    try {
      const userCode = `
        function calculate(a, op, b) {
          ${code}
        }
        module.exports = calculate(${tc.input[0]}, '${tc.input[1]}', ${tc.input[2]})
      `
      
      const output = await vm.run(userCode)
      
      const pass = Math.abs(output - tc.expected) < 0.01
      if (pass) passed++
      
      results.push({
        passed: pass,
        input: tc.input,
        expected: tc.expected,
        output,
      })
    } catch (error) {
      results.push({
        passed: false,
        input: tc.input,
        expected: tc.expected,
      })
    }
  }

  const score = Math.round((passed / testCases.length) * 100)

  return { score, passed, total: testCases.length, results }
}
