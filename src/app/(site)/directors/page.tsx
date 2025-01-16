'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import useSWRInfinite from 'swr/infinite'

import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'

interface DirectorsResponse {
  directors: {
    name: string
    slug: string
    movieCount: number
  }[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

type GetKey = (
  pageIndex: number,
  previousPageData: DirectorsResponse | null
) => string | null

const getKey: GetKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.directors.length) return null
  return `/api/directors?page=${pageIndex + 1}`
}

export default function DirectorsPage() {
  // @ts-expect-error
  const observerRef = useRef<IntersectionObserver>()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const { data, size, setSize, isLoading } = useSWRInfinite<DirectorsResponse>(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false
    }
  )

  const directors = data ? data.flatMap(page => page.directors) : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.directors?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.directors?.length < 20)

  useEffect(() => {
    if (isLoading) return

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isReachingEnd && !isLoadingMore) {
        setSize(size + 1)
      }
    })

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => observerRef.current?.disconnect()
  }, [isLoading, isReachingEnd, isLoadingMore, setSize, size])

  return (
    <div className='mt-24'>
      <div>
        <PageTitle>Directors</PageTitle>
        <PageSummary>
          All directors featured in the Four Favorites lists.
        </PageSummary>
      </div>

      <div className='mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {directors.map((director, index) => (
          <Link
            key={`${director.slug}-${index}`}
            href={`/directors/${director.slug}`}
            className='group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent'
          >
            <h3 className='font-medium text-card-foreground'>
              {director.name}
            </h3>
            <p className='mt-1 text-sm text-muted-foreground'>
              {director.movieCount}{' '}
              {director.movieCount === 1 ? 'movie' : 'movies'}
            </p>
          </Link>
        ))}
      </div>

      <div ref={loadMoreRef} className='mt-8 flex justify-center sm:mt-12'>
        {isLoadingMore && (
          <div className='text-sm text-muted-foreground'>
            Loading more directors...
          </div>
        )}
        {isReachingEnd && directors.length > 0 && (
          <div className='text-sm text-muted-foreground'>
            No more directors to load.
          </div>
        )}
      </div>
    </div>
  )
}
