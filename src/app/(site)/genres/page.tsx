import Link from 'next/link'
import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'
import { getAllGenres } from '@/db/queries'

export default async function GenresPage() {
  const genres = await getAllGenres()

  return (
    <div className='mb-12 mt-16 sm:mt-24'>
      <div className='flex flex-col justify-between gap-y-8 sm:flex-row sm:items-end sm:gap-y-0'>
        <div>
          <PageTitle size='lg'>Genres</PageTitle>
          <PageSummary size='lg'>
            All movie genres featured in the Four Favorites lists.
          </PageSummary>
        </div>
      </div>

      <div className='mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {genres.map(genre => (
          <Link
            key={genre.id}
            href={`/movies?genre=${genre.id}`}
            className='group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent'
          >
            <h3 className='font-medium text-card-foreground'>{genre.name}</h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              {genre.movieCount} {genre.movieCount === 1 ? 'movie' : 'movies'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
