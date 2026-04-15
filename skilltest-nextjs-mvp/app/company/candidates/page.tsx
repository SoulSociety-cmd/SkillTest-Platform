'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

type Candidate = {
  id: string
  name: string
  email: string
}

export default function Page() {
  const { data: session } = useSession()

  const [candidates, setCandidates] = useState<Candidate[]>([])

  useEffect(() => {
    if (!session) return

    // fetch candidates here
  }, [session])

  return (
    <div>
      {candidates.map((candidate, index) => (
        <div key={candidate.id}>
          {candidate.name}
        </div>
      ))}
    </div>
  )
}