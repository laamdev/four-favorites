import { Suspense } from 'react'
import { Metadata } from 'next'

import { PageTitle } from '@/components/globals/page-title'
import { FiltersSlider } from '@/components/movies/filters-slider'
import { PageSummary } from '@/components/globals/page-summary'
import { GridSkeleton } from '@/components/globals/grid-skeleton'
import { MoviesGrid } from '@/components/movies/movies-grid'

import { movieGenres } from '@/lib/data/movie-genres'

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
    <div className='mt-24'>
      <div className='flex flex-col justify-between gap-y-8 sm:flex-row sm:items-end sm:gap-y-0'>
        <div>
          <PageTitle className='flex flex-col'>
            {genreName ? (
              <>
                <span>{genreName}</span>
                <span>Movies</span>
              </>
            ) : (
              <>
                <span>All</span>
                <span>Movies</span>
              </>
            )}
          </PageTitle>

          <PageSummary>
            {genreName
              ? `A list of the unique ${genreName.toLowerCase()} movies present in the Four Favorites celebrity lists.`
              : `A list of all the unique movies present in the Four Favorites celebrity lists.`}
          </PageSummary>
        </div>

        <div className='flex justify-end'>
          <FiltersSlider sort={sort as string} genre={genre as string} />
        </div>
      </div>

      <div className='col-span-4 mt-8 sm:mt-12'>
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
