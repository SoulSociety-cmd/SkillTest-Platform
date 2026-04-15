import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { Test } from '@/lib/models'

// Sample Calculator Test
const CALCULATOR_TEST = {
  id: 'calculator-basic',
  title: 'Build a Calculator Function',
  description: `Write a \`calculate(a, op, b)\` function that:
• Supports +, -, *
• Returns number result
• 15min timer`,
  testCases: [
    { input: [2, '+', 2], expected: 4 },
    { input: [5, '-', 3], expected: 2 },
    { input: [4, '*', 3], expected: 12 },
  ],
}

export async function GET() {
  await connectDB()
  
  // Create sample test if not exists
  let test = await Test.findOne({ id: CALCULATOR_TEST.id })
  if (!test) {
    test = new Test(CALCULATOR_TEST)
    await test.save()
  }
  
  return NextResponse.json(test)
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  
  // Create user test submission
  const test = new Test({ ...CALCULATOR_TEST, ...body })
  await test.save()
  
  return NextResponse.json(test)
}
