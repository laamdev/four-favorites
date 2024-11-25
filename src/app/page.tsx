import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageTitle } from '@/components/globals/page-title'
import { ItemGrid } from '@/components/favorites/favorite-grid'
import { ItemList } from '@/components/favorites/favorite-list'
import { ViewToggleGroup } from '@/components/favorites/view-toggle-group'
import { Pagination } from '@/components/favorites/pagination'
import { EmptyState } from '@/components/globals/empty-state'
import { FiltersSlider } from '@/components/favorites/filters-slider'

import { getFavorites, getMostRecentFavorite } from '@/db/queries'
import { getFormattedDate } from '@/lib/utils'

interface FourFavoritesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
  title: 'Four Favorites',
  description:
    "An every growing collection of Letterboxd's Four Favorites picks by celebrities."
}

export default async function FourFavoritesPage({
  searchParams
}: FourFavoritesPageProps) {
  const { view, filter, sort, query, page } = await searchParams

  const currentPage = page ? parseInt(page as string) : 1

  const { favorites, totalCount } = await getFavorites({
    filter: filter as string,
    sort: sort as string,
    query: query as string,
    page: currentPage
  })

  if (!favorites) {
    return notFound()
  }

  const lastUpdated = await getMostRecentFavorite()

  const itemsPerPage = 10

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div>
        <PageTitle className='flex flex-col'>
          <span>{`Four`}</span>
          <span>{`Favorites`}</span>
        </PageTitle>
        <p className='mt-2.5 max-w-lg text-xl text-zinc-300'>
          <span>{`An every growing collection of Letterboxd's `}</span>
          <a
            href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
            target='_blank'
            rel='noopener noreferrer'
            className='tw-animation font-bold hover:bg-clip-text hover:text-primary'
          >{`Four Favorites `}</a>
          <span>{`picks by celebrities. Last updated on ${getFormattedDate(lastUpdated?.publishingDate!)}.`}</span>
        </p>
      </div>

      <div className='mt-10 flex items-center justify-between'>
        <FiltersSlider sort={sort as string} filter={filter as string} />
        <ViewToggleGroup />
      </div>

      <div className='col-span-4 mt-10'>
        {favorites.length === 0 ? (
          <EmptyState>{`No favorites found.`}</EmptyState>
        ) : (
          <div>
            {view === 'grid' || !view ? (
              <ItemGrid items={favorites} type='artist' />
            ) : (
              <ItemList items={favorites} />
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
      </div>
    </div>
  )
}
