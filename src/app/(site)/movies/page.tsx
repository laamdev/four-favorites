import { Suspense } from 'react'
import { Metadata } from 'next'

import { PageTitle } from '@/components/globals/page-title'
import { FiltersSlider } from '@/components/movies/filters-slider'
import { PageSummary } from '@/components/globals/page-summary'
import { GridSkeleton } from '@/components/globals/grid-skeleton'
import { movieGenres } from '@/lib/data/movie-genres'

import { MoviesGrid } from '@/components/movies/movies-grid'

interface MoviesPageProps {
  searchParams: Promise<{
    genre: string
    sort: string
    query: string
    page: string
    view: string
  }>
}

export const generateMetadata = async ({
  searchParams
}: MoviesPageProps): Promise<Metadata> => {
  const { genre } = await searchParams
  const genreName = genre
    ? movieGenres.find(g => g.id === Number(genre))?.name
    : null

  return {
    title: genreName ? `${genreName} Movies` : 'Movies',
    description: genreName
      ? `A list of ${genreName.toLowerCase()} movies from Four Favorites celebrity picks.`
      : 'A list of all the movies present in a Four Favorites celebrity pick.'
  }
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { sort, genre, page, query } = await searchParams
  const currentPage = page ? parseInt(page as string) : 1

  const genreName = genre
    ? movieGenres.find(g => g.id === Number(genre))?.name
    : null

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div className='flex flex-col justify-between gap-y-8 sm:flex-row sm:items-end sm:gap-y-0'>
        <div>
          <PageTitle size='lg'>
            {genreName ? `${genreName} Movies` : 'Movies'}
          </PageTitle>

          <PageSummary size='lg'>
            <span>{`A list of all the movies present in a `}</span>
            <a
              href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
              target='_blank'
              rel='noopener noreferrer'
              className='tw-animation font-medium text-white underline hover:text-primary'
            >
              {`Four Favorites`}
            </a>
            <span>{` celebrity pick.`}</span>
          </PageSummary>
        </div>

        <div className='flex justify-end'>
          <FiltersSlider sort={sort as string} genre={genre as string} />
        </div>
      </div>

      <div className='col-span-4 mt-4 sm:mt-8'>
        <div>
          <Suspense fallback={<GridSkeleton />}>
            <MoviesGrid
              filter={genre}
              sort={sort}
              query={query}
              page={currentPage}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
