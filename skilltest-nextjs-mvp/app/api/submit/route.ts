import { NextRequest, NextResponse } from 'next/server';
import { productionGrade } from '@/lib/productionGrader';
import connectDB from '@/lib/db';
import { Submission, User } from '@/lib/models';

export async function POST(req: NextRequest) {
  try {
    // SSE for real-time progress
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Send initial headers
        controller.enqueue(encoder.encode('data: {"progress": 0, "status": "Starting production grading..."}\n\n'));
        
        const body = await req.json();
        const { testId, code, language = 'js', userId } = body;
        
        await connectDB();
        
        // Run production grading
        const gradeResult = await productionGrade(testId as any, code, language);
        
        // Save submission with extended results
        const submission = new Submission({
          userId,
          testId,
          code,
          score: gradeResult.score,
          results: gradeResult,
          timeTaken: body.timeLeft ? 900 - body.timeLeft : 900,
        });
        await submission.save();
        
        // Update user
        const currentScore = (await User.findById(userId))?.score || 0;
        const newBadge = gradeResult.score >= 70 ? 'Production Ready Dev 🚀' : 'Keep Grinding 💪';
        await User.findByIdAndUpdate(userId, {
          score: Math.max(gradeResult.score, currentScore),
          badge: newBadge,
        });
        
        // Final result
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          ...gradeResult,
          id: submission._id,
          badge: newBadge,
          final: true
        })}\n\n`));
        
        controller.close();
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Submit failed', details: error }, { status: 500 });
  }
}

