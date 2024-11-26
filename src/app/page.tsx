import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageTitle } from '@/components/globals/page-title'
import { ItemList } from '@/components/favorites/favorite-list'
import { ViewToggleGroup } from '@/components/favorites/view-toggle-group'
import { Pagination } from '@/components/favorites/pagination'
import { EmptyState } from '@/components/globals/empty-state'
import { FiltersSlider } from '@/components/favorites/filters-slider'
import { ItemCard } from '@/components/globals/item-card'

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

      <div className='mt-4 flex items-center justify-between sm:mt-8'>
        <FiltersSlider sort={sort as string} filter={filter as string} />
        <ViewToggleGroup />
      </div>

      <div className='col-span-4 mt-4 sm:mt-8'>
        {favorites.length === 0 ? (
          <EmptyState>{`No favorites found.`}</EmptyState>
        ) : (
          <div>
            {view === 'grid' || !view ? (
              <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
                {favorites.map((item: any) => (
                  <ItemCard
                    key={item.id}
                    slug={item.slug}
                    heading={item.name}
                    image={`https://media.themoviedb.org/t/p/w600_and_h900_bestv2/${item.artist.headshotUrl}`}
                  />
                ))}
              </div>
            ) : (
              <ItemList items={favorites} />
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className='mt-8'>
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
