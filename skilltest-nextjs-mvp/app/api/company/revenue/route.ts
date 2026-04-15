import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { Submission, Test } from '@/lib/models'

export async function GET(req: Request) {
  await connectDB()
  
  const { searchParams } = new URL(req.url)
  const companyId = searchParams.get('companyId')
  
  if (!companyId) {
    return NextResponse.json({ error: 'companyId required' }, { status: 400 })
  }

  // Revenue = sum(submissions * test.price)
  const revenueData = await Submission.aggregate([
    { $match: { companyId } },
    {
    $lookup: {
        from: 'tests',
        localField: 'testId',
        foreignField: '_id',
        as: 'test'
      }
    },
    { $unwind: '$test' },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $multiply: ['$test.price', 1] } },
        completions: { $sum: 1 },
        avgScore: { $avg: '$score' }
      }
    }
  ])

  const stats = revenueData[0] || { totalRevenue: 0, completions: 0, avgScore: 0 }

  return NextResponse.json({
    totalRevenue: stats.totalRevenue,
    monthlyRevenue: 240, // stub
    completions: stats.completions,
    avgScore: stats.avgScore.toFixed(1)
  })
}
