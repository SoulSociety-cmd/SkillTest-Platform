import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { Test } from '@/lib/models'

import { TEST_CASES } from '@/lib/testCases';

const SAMPLE_TESTS = Object.values(TEST_CASES).map(test => ({
  id: test.id,
  title: test.title,
  description: `Production test for ${test.language.toUpperCase()}. ${test.testCases.length} test cases.`,
  language: test.language,
  testCases: test.testCases,
} as any));

export async function GET() {
  await connectDB();
  
  // Return all available tests
  const tests = Object.values(SAMPLE_TESTS);
  
  return NextResponse.json(tests);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  
  // Create custom test
  const test = new Test(body);
  await test.save();
  
  return NextResponse.json(test);
}
