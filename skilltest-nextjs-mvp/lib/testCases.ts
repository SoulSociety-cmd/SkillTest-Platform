// 10+ Sample Test Cases

export const TEST_CASES = {
  'calculator-js': {
    id: 'calculator-js',
    title: 'JS Calculator',
    language: 'js',
    testCases: [
      { input: [2, '+', 2], expected: 4 },
      { input: [5, '-', 3], expected: 2 },
      { input: [4, '*', 3], expected: 12 },
      { input: [10, '/', 2], expected: 5 },
      { input: [0, '+', 0], expected: 0 },
    ]
  },
  'calculator-py': {
    id: 'calculator-py',
    title: 'Python Calculator',
    language: 'python',
    testCases: [
      { input: [2, '+', 2], expected: 4 },
      { input: [5, '-', 3], expected: 2 },
      { input: [4, '*', 3], expected: 12 },
    ]
  },
  'todo-frontend': {
    id: 'todo-frontend',
    title: 'Todo App DOM Tests',
    type: 'frontend',
    language: 'html',
    testCases: [
      { selector: 'button#add', assertSelector: 'li', expected: 'Task 1' },
      { selector: 'input', assertSelector: 'li', expected: 'Task 2' },
      { selector: 'button[delete]', assertSelector: 'li:nth(1)', expected: '' }, // should disappear
    ]
  },
  'api-fetch': {
    id: 'api-fetch',
    title: 'API Fetch',
    language: 'js',
    testCases: [
      { input: ['https://jsonplaceholder.typicode.com/todos/1'], expected: 1 },
      { input: [], expected: [] },
    ]
  },
  'fizzbuzz-py': {
    id: 'fizzbuzz-py',
    title: 'FizzBuzz Python',
    language: 'python',
    testCases: [
      { input: [3], expected: 'Fizz' },
      { input: [5], expected: 'Buzz' },
      { input: [15], expected: 'FizzBuzz' },
      { input: [1], expected: 1 },
    ]
  },
  'palindrome': {
    id: 'palindrome',
    title: 'Palindrome Checker',
    language: 'js',
    testCases: [
      { input: ['racecar'], expected: true },
      { input: ['hello'], expected: false },
      { input: ['A man a plan a canal Panama'], expected: true },
    ]
  }
} as const;

export type TestId = keyof typeof TEST_CASES;

