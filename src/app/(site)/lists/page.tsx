import { Suspense } from 'react'

import { PageTitle } from '@/components/globals/page-title'
import { FiltersSlider } from '@/components/favorites/filters-slider'
import { PageSummary } from '@/components/globals/page-summary'
import { FavoritesGrid } from '@/components/favorites/favorites-grid'
import { GridSkeleton } from '@/components/globals/grid-skeleton'

interface FourFavoritesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ListsPage({
  searchParams
}: FourFavoritesPageProps) {
  const { role, sort, query, page } = await searchParams

  const currentPage = page ? parseInt(page as string) : 1

  return (
    <div className='mb-12 mt-16 sm:mt-24'>
      <div className='flex flex-col justify-between gap-y-8 sm:flex-row sm:items-end sm:gap-y-0'>
        <div>
          <PageTitle size='lg'>
            {`${role ? `${role} Lists` : 'All Lists'}`}
          </PageTitle>

          <PageSummary size='lg'>
            <span>{`Discover curated movie lists from the entertainment industry's finest. From actors and directors to composers and writers, explore their `}</span>
            <a
              href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
              target='_blank'
              rel='noopener noreferrer'
              className='tw-animation font-medium text-white underline hover:text-primary'
            >
              {`Four Favorites`}
            </a>
            <span>{` picks.`}</span>
          </PageSummary>
        </div>

        <div className='flex justify-end'>
          <FiltersSlider sort={sort as string} role={role as string} />
        </div>
      </div>

      <div className='col-span-4 mt-8 sm:mt-12'>
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
