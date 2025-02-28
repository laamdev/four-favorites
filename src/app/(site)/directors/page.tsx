'use client'

import { useEffect, useRef } from 'react'
import useSWRInfinite from 'swr/infinite'

import { SimpleCard } from '@/components/globals/simple-card'
import { Hero } from '@/components/globals/hero'
import { SectionContainer } from '@/components/globals/section-wrapper'

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
    <div>
      <Hero
        title='Directors'
        summary={`Discover all the directors featured in the Four Favorites celebrity picks.`}
        isCentered
      />

      <SectionContainer>
        <div className='container grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {directors.map((director, index) => (
            <SimpleCard
              key={`${director.slug}-${index}`}
              title={director.name}
              count={director.movieCount}
              href={`/directors/${director.slug}`}
            />
          ))}
        </div>

        <div ref={loadMoreRef} className='mt-8 flex justify-center sm:mt-12'>
          {isLoadingMore && (
            <div className='text-muted-foreground text-sm'>
              Loading more directors...
            </div>
          )}
          {isReachingEnd && directors.length > 0 && (
            <div className='text-muted-foreground text-sm'>
              No more directors to load.
            </div>
          )}
        </div>
      </SectionContainer>
    </div>
  )
}
