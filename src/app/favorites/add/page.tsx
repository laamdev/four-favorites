'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import { posterURL } from '@/lib/movies/utils'
import { addMovieAction } from '@/lib/movies/index'

export default function AddFavoritesPage() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<
    { id: number; poster_path: string; title: string }[]
  >([])

  useEffect(() => {
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(setMovies)
  }, [query])

  const router = useRouter()

  async function addMovie(id: number) {
    await addMovieAction(id)
    router.push(`/`)
  }

  return (
    <main className='mt-5'>
      <div className='mb-8'>
        <Input value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      {movies.length > 0 ? (
        <Carousel>
          <CarouselContent>
            {movies.map(({ id, poster_path, title }) => (
              <CarouselItem key={id} className='flex basis-1/6 flex-col'>
                <Image
                  src={posterURL(poster_path)}
                  alt={title ?? ''}
                  width={600}
                  height={900}
                  className='tw-gradient aspect-[6/9] w-full object-cover'
                />
                <h1 className='my-5 truncate text-center text-xl font-bold'>
                  {title}
                </h1>
                <Button onClick={() => addMovie(id)}>Add</Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p className='text-2xl'>Type in a query to find movies</p>
      )}
    </main>
  )
}
