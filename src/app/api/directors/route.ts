import { NextResponse } from 'next/server'
import { getAllDirectors } from '@/db/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const offset = (page - 1) * limit

  try {
    const directors = await getAllDirectors({ offset, limit })
    return NextResponse.json({ directors })
  } catch (error) {
    console.error('Error fetching directors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch directors' },
      { status: 500 }
    )
  }
}
