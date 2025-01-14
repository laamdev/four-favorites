import { Suspense } from 'react'

import { PageTitle } from '@/components/globals/page-title'
import { FiltersSlider } from '@/components/favorites/filters-slider'
import { PageSummary } from '@/components/globals/page-summary'
import { FavoritesGrid } from '@/components/favorites/favorites-grid'
import { GridSkeleton } from '@/components/globals/grid-skeleton'

import { getMostRecentFavorite } from '@/db/queries'

interface FourFavoritesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ListsPage({
  searchParams
}: FourFavoritesPageProps) {
  const { role, sort, query, page } = await searchParams

  const currentPage = page ? parseInt(page as string) : 1

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div>
        <PageTitle size='lg' className='flex flex-col text-5xl md:text-7xl'>
          {`${role ? `${role}'s Lists` : 'Lists'}`}
        </PageTitle>
        <PageSummary size='lg'>
          <div className='flex flex-wrap items-baseline gap-x-1 text-base sm:text-lg'>
            <p>{`Discover curated movie lists from the entertainment industry's finest. From actors and directors to composers and writers, explore their Letterboxd's Four Favorites picks.`}</p>
          </div>
        </PageSummary>
      </div>

      <div className='mt-4 flex justify-end sm:mt-8'>
        <FiltersSlider sort={sort as string} role={role as string} />
      </div>

      <div className='col-span-4 mt-4 sm:mt-8'>
        <div>
          <Suspense fallback={<GridSkeleton />}>
            <FavoritesGrid
              filter={role}
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
