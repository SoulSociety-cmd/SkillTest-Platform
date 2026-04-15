import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { Submission, User } from '@/lib/models'
import { productionGrade } from '@/lib/productionGrader'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    
    const { testId, code, userId, language = 'js' } = body
    
    // Production grade
    const gradeResult = await productionGrade(testId as any, code, language)
    
    // Save submission
    const submission = new Submission({
      userId,
      testId,
      code,
      language,
      score: gradeResult.score,
      results: gradeResult,
      timeTaken: 900 - body.timeLeft || 900,
    })
    await submission.save()
    
    // Update user
    const currentScore = (await User.findById(userId))?.score || 0;
    const badge = gradeResult.score >= 70 ? 'Production Ready Dev 🚀' : 'Keep Grinding 💪';
    await User.findByIdAndUpdate(userId, {
      score: Math.max(gradeResult.score, currentScore),
      badge,
    })
    
    return NextResponse.json({ 
      id: submission._id,
      ...gradeResult,
      badge
    })
  } catch (error) {
    console.error('Production grading failed:', error);
    return NextResponse.json({ error: 'Production grading failed' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  await connectDB()
  const submission = await Submission.findById(id).populate('userId')
  
  return NextResponse.json(submission)
}
