import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageTitle } from '@/components/globals/page-title'
import { ItemList } from '@/components/favorites/favorite-list'
import { FiltersSlider } from '@/components/movies/filters-slider'
import { ViewToggleGroup } from '@/components/favorites/view-toggle-group'
import { EmptyState } from '@/components/globals/empty-state'
import { Pagination } from '@/components/favorites/pagination'
import { ItemCard } from '@/components/globals/item-card'
import { PageSummary } from '@/components/globals/page-summary'

import { getRankedMovies } from '@/db/queries'
import { getFormattedYear } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Movies',
  description:
    'A list of all the movies present in a Four Favorites celebrity pick.'
}

interface MoviesPageProps {
  searchParams: Promise<{
    filter: string
    sort: string
    query: string
    page: string
    view: string
  }>
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { sort, filter, view, page, query } = await searchParams
  const currentPage = page ? parseInt(page as string) : 1

  const { movies, totalCount } = await getRankedMovies({
    filter: filter as string,
    sort: sort as string,
    query: query as string,
    page: currentPage
  })

  if (!movies) {
    return notFound()
  }

  const itemsPerPage = 10

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div>
        <PageTitle>{`Movies`}</PageTitle>

        <PageSummary>
          <span>{`A list of all the movies present in a `}</span>
          <a
            href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
            target='_blank'
            rel='noopener noreferrer'
            className='tw-animation font-medium text-white underline hover:text-primary'
          >{`Four Favorites`}</a>
          <span>{` celebrity pick.`}</span>
        </PageSummary>
      </div>

      <div className='mt-4 flex items-center justify-between sm:mt-8'>
        <FiltersSlider sort={sort as string} filter={filter as string} />
        <ViewToggleGroup />
      </div>

      <div className='col-span-4 mt-4 sm:mt-8'>
        {movies.length === 0 ? (
          <EmptyState>{`No favorites found.`}</EmptyState>
        ) : (
          <div>
            {view === 'grid' || !view ? (
              <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
                {movies.map((item: any) => (
                  <ItemCard
                    key={item.id}
                    slug={`/movies/${item.slug}`}
                    heading={item.name}
                    subheading={getFormattedYear(item.releaseDate)}
                    image={`https://media.themoviedb.org/t/p/w600_and_h900_bestv2${item.posterUrl}`}
                  />
                ))}
              </div>
            ) : (
              <ItemList items={movies} />
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className='mt-4 sm:mt-8'>
            <Pagination
              totalPages={totalPages}
              totalDocs={totalCount}
              page={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
