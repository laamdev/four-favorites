import { notFound } from 'next/navigation'
import { SlidersHorizontal } from '@phosphor-icons/react/dist/ssr'

import { PageTitle } from '@/components/globals/page-title'
import { ItemList } from '@/components/favorites/favorite-list'
import { FiltersSlider } from '@/components/favorites/filters-slider'
import { ViewToggleGroup } from '@/components/favorites/view-toggle-group'
import { EmptyState } from '@/components/globals/empty-state'
import { Pagination } from '@/components/favorites/pagination'
import { ItemGrid } from '@/components/favorites/favorite-grid'

import { getRankedMovies } from '@/db/queries'

interface MoviesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { sort, filter, view, page } = await searchParams
  const currentPage = page ? parseInt(page as string) : 1

  const { movies, totalCount } = await getRankedMovies()

  if (!movies) {
    return notFound()
  }

  const itemsPerPage = 10

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div>
        <PageTitle className='flex flex-col'>
          <span>{`Movies`}</span>
        </PageTitle>
        <p className='mt-2.5 max-w-lg text-xl'>
          <span>{`A list of all the movies present in a`}</span>
          <a
            href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
            target='_blank'
            rel='noopener noreferrer'
            className='tw-animation font-bold hover:bg-primary hover:bg-clip-text hover:text-transparent'
          >{` Four Favorites `}</a>
          <span>{`celebrity pick.`}</span>
        </p>
      </div>
      {/* <div className='mt-10 flex items-center justify-between'>
        <div className='flex items-center gap-x-2.5'>
          <SlidersHorizontal weight='fill' className='size-4' />
          <FiltersSlider
            label={`Show Filters`}
            sort={sort as string}
            filter={filter as string}
          />
        </div>
        <ViewToggleGroup />
      </div> */}

      {/* <div className='col-span-4 mt-10'>
        {movies.length === 0 ? (
          <EmptyState>{`No favorites found.`}</EmptyState>
        ) : (
          <div>
            {view === 'grid' || !view ? (
              <ItemGrid items={movies} baseUrl={'/movies'} />
            ) : (
              <ItemList items={movies} baseUrl={'/movies'} />
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className='mt-10'>
            <Pagination
              totalPages={totalPages}
              totalDocs={totalCount}
              page={currentPage}
            />
          </div>
        )}
      </div> */}
    </div>
  )
}
