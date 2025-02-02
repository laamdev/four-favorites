import { Metadata } from 'next'

import { SimpleCard } from '@/components/globals/simple-card'
import { Hero } from '@/components/globals/hero'

import { getAllGenres } from '@/db/queries'

export const metadata: Metadata = {
  title: 'Genres',
  description: 'Discover all the genres featured in the Four Favorites lists.'
}

export default async function GenresPage() {
  const genres = await getAllGenres()

  return (
    <div>
      <Hero
        title='Genres'
        summary={`Discover all the movie genres featured in the Four Favorites celebrity picks.`}
        isCentered
      />

      <div className='container mt-4 grid grid-cols-1 gap-4 py-8 sm:mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {genres.map(genre => (
          <SimpleCard
            key={genre.slug}
            title={genre.name}
            count={genre.movieCount}
            href={`/genres/${genre.id}`}
          />
        ))}
      </div>
    </div>
  )
}
