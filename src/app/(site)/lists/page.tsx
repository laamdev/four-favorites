import { Suspense } from 'react'

import { PageTitle } from '@/components/globals/page-title'
import { FiltersSlider } from '@/components/favorites/filters-slider'
import { PageSummary } from '@/components/globals/page-summary'
import { FavoritesGrid } from '@/components/favorites/favorites-grid'
import { GridSkeleton } from '@/components/globals/grid-skeleton'

import { getMostRecentFavorite } from '@/db/queries'
import { getFormattedDate } from '@/lib/utils'

interface FourFavoritesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ListsPage({
  searchParams
}: FourFavoritesPageProps) {
  const { filter, sort, query, page } = await searchParams

  const currentPage = page ? parseInt(page as string) : 1

  const lastUpdated = await getMostRecentFavorite()

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div>
        <PageTitle size='lg' className='flex flex-col text-5xl md:text-7xl'>
          Lists
        </PageTitle>
        <PageSummary size='lg'>
          <div className='flex flex-wrap items-baseline gap-x-1 text-base sm:text-lg'>
            <p>{`An ever-growing collection of Letterboxd's`}</p>
            <a
              href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
              target='_blank'
              rel='noopener noreferrer'
              className='tw-animation font-medium text-white underline hover:text-primary'
            >{`Four Favorites`}</a>
            <p>{` picks by celebrities.`}</p>
          </div>
          <div className='mt-1 sm:mt-2'>
            <p>{`Last updated on ${getFormattedDate(lastUpdated?.publishingDate!)}`}</p>
          </div>
        </PageSummary>
      </div>

      <div className='mt-4 flex justify-end sm:mt-8'>
        <FiltersSlider sort={sort as string} filter={filter as string} />
      </div>

      <div className='col-span-4 mt-4 sm:mt-8'>
        <div>
          <Suspense fallback={<GridSkeleton />}>
            <FavoritesGrid
              filter={filter}
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
