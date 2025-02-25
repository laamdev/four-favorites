import { Metadata } from 'next'

import { SimpleCard } from '@/components/globals/simple-card'
import { Hero } from '@/components/globals/hero'
import { SectionContainer } from '@/components/globals/section-wrapper'

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

      <SectionContainer>
        <div className='container grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {genres.map(genre => (
            <SimpleCard
              key={genre.slug}
              title={genre.name}
              count={genre.movieCount}
              href={`/movies?genre=${genre.id}`}
            />
          ))}
        </div>
      </SectionContainer>
    </div>
  )
}
