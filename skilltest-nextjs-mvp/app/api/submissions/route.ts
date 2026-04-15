import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { Submission, User } from '@/lib/models'
import { gradeCalculator } from '@/lib/grader'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    
    const { testId, code, userId } = body
    
    // Grade code
    const gradeResult = await gradeCalculator(code)
    
    // Save submission
    const submission = new Submission({
      userId,
      testId,
      code,
      score: gradeResult.score,
      results: gradeResult.results,
      timeTaken: 900 - body.timeLeft || 900, // 15min max
    })
    await submission.save()
    
    // Update user score/badge
    await User.findByIdAndUpdate(userId, {
      score: Math.max(gradeResult.score, (await User.findById(userId))?.score || 0),
      badge: gradeResult.score >= 70 ? 'Junior JS Ready ✅' : 'Keep Practicing 💪',
    })
    
    return NextResponse.json({ 
      id: submission._id,
      ...gradeResult,
      badge: gradeResult.score >= 70 ? 'Junior JS Ready ✅' : 'Keep Practicing 💪',
    })
  } catch (error) {
    return NextResponse.json({ error: 'Grading failed' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  await connectDB()
  const submission = await Submission.findById(id).populate('userId')
  
  return NextResponse.json(submission)
}
