import Link from 'next/link'

import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'

import { getAllDirectors } from '@/db/queries'

export default async function DirectorsPage() {
  const directors = await getAllDirectors()

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div className='flex flex-col justify-between gap-y-8 sm:flex-row sm:items-end sm:gap-y-0'>
        <div>
          <PageTitle size='lg'>Directors</PageTitle>
          <PageSummary size='lg'>
            All directors featured in the Four Favorites lists.
          </PageSummary>
        </div>
      </div>

      <div className='mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {directors.map(director => (
          <Link
            key={director.slug}
            href={`/directors/${director.slug}`}
            className='group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent'
          >
            <h3 className='font-medium text-card-foreground'>
              {director.name}
            </h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              {director.movieCount}{' '}
              {director.movieCount === 1 ? 'movie' : 'movies'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
