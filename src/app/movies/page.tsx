import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SlidersHorizontal } from '@phosphor-icons/react/dist/ssr'

import { PageTitle } from '@/components/globals/page-title'
import { ItemList } from '@/components/favorites/favorite-list'
import { FiltersSlider } from '@/components/favorites/filters-slider'
import { ViewToggleGroup } from '@/components/favorites/view-toggle-group'
import { EmptyState } from '@/components/globals/empty-state'
import { Pagination } from '@/components/favorites/pagination'
import { ItemCard } from '@/components/globals/item-card'

import { getRankedMovies } from '@/db/queries'
import { getFormattedYear } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Movies',
  description:
    'A list of all the movies present in a Four Favorites celebrity pick.'
}

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
        <p className='mt-2 max-w-lg text-xl'>
          <span>{`A list of all the movies present in a`}</span>
          <a
            href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
            target='_blank'
            rel='noopener noreferrer'
            className='tw-animation font-bold hover:text-primary'
          >{` Four Favorites `}</a>
          <span>{`celebrity pick.`}</span>
        </p>
      </div>
      <div className='mt-4 flex items-center justify-between sm:mt-8'>
        <div className='flex items-center gap-x-2'>
          <SlidersHorizontal weight='fill' className='size-4' />
          <FiltersSlider sort={sort as string} filter={filter as string} />
        </div>
        <ViewToggleGroup />
      </div>

      <div className='col-span-4 mt-4 sm:mt-8'>
        {movies.length === 0 ? (
          <EmptyState>{`No favorites found.`}</EmptyState>
        ) : (
          <div>
            {view === 'grid' || !view ? (
              <div className='grid grid-cols-5 gap-4'>
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
