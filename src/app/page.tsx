import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageTitle } from '@/components/globals/page-title'
import { SortSelect } from '@/components/favorites/sort-select'
import { FavoriteGrid } from '@/components/favorites/favorite-grid'
import { FavoriteList } from '@/components/favorites/favorite-list'
import { ViewToggleGroup } from '@/components/favorites/view-toggle-group'
import { Pagination } from '@/components/favorites/pagination'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Search } from '@/components/favorites/search'
import { FiltersRadio } from '@/components/favorites/filters-radio'
import { EmptyState } from '@/components/globals/empty-state'

import { getFavorites } from '@/db/queries'
import { SlidersHorizontal } from '@phosphor-icons/react/dist/ssr'
import { FiltersSlider } from '@/components/favorites/filters-slider'

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
  title: 'Four Favorites',
  description:
    "An every growing collection of Letterboxd's Four Favorites picks by celebrities."
}

export default async function HomePage({ searchParams }: HomePageProps) {
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

  const itemsPerPage = 10
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div>
      <div>
        <PageTitle className='flex flex-col'>
          <span>{`Four`}</span>
          <span>{`Favorites`}</span>
        </PageTitle>
        <p className='mt-2.5 max-w-lg text-xl'>
          <span>{`An every growing collection of Letterboxd's `}</span>
          <a
            href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
            target='_blank'
            rel='noopener noreferrer'
            className='tw-link-hover font-bold hover:bg-primary hover:bg-clip-text hover:text-transparent'
          >{`Four Favorites `}</a>
          <span>{`picks by celebrities.`}</span>
        </p>
      </div>

      <div className='mt-10 flex items-center justify-between'>
        <div className='flex items-center gap-x-2.5'>
          <SlidersHorizontal weight='fill' className='size-4' />
          <FiltersSlider
            label={`Show Filters`}
            sort={sort as string}
            filter={filter as string}
          />
        </div>
        <ViewToggleGroup />
      </div>

      {/* <div className='mt-5 grid grid-cols-1 gap-5 md:grid-cols-5 md:gap-10'> */}
      {/* <div className='col-span-1 flex h-fit flex-col gap-y-2.5 rounded-lg bg-gradient-to-br from-[#262626] to-card px-4 py-5 sm:p-6'>
          <div className='flex flex-col gap-y-3'>
            <Label className='text-xs uppercase tracking-wider text-zinc-300'>{`Search`}</Label>
            <Search placeholder='Find a list...' />
          </div>

          <div className='py-5'>
            <Separator />
          </div>

          <div className='flex flex-col gap-y-3'>
            <Label className='text-xs uppercase tracking-wider text-zinc-300'>{`Sort`}</Label>
            <SortSelect sort={sort as string} />
          </div>

          <div className='py-5'>
            <Separator />
          </div>

          <div className='flex flex-col gap-y-3'>
            <Label className='text-xs uppercase tracking-wider text-zinc-300'>{`Artist Role`}</Label>
            <FiltersRadio filter={filter as string} />
          </div>
        </div> */}

      <div className='col-span-4 mt-10'>
        {favorites.length === 0 ? (
          <EmptyState>{`No favorites found.`}</EmptyState>
        ) : (
          <div>
            {view === 'grid' || !view ? (
              <FavoriteGrid favorites={favorites} />
            ) : (
              <FavoriteList favorites={favorites} />
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
      {/* </div> */}
    </div>
  )
}
