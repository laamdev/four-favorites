import Image from 'next/image'
import Link from 'next/link'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import { MoviesToFavorites } from '@/types'

interface MovieCarouselProps {
  movies: MoviesToFavorites[]
}

export const MovieCarousel = ({ movies }: MovieCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: 'start'
      }}
    >
      <CarouselContent className='-ml-7'>
        {movies.map(movie => (
          <CarouselItem
            key={movie.movie.id}
            className='pl-7 md:basis-1/2 lg:basis-1/4'
          >
            <Link href={`/movies/${movie.movie.slug}`}>
              <div className='group relative aspect-[2/3] overflow-hidden rounded'>
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${movie.movie.posterUrl}`}
                  alt={movie.movie.name}
                  fill
                  className='tw-gradient tw-card-hover rounded bg-gradient-to-br object-cover object-center group-hover:scale-105'
                />
                <div className='tw-card-hover absolute inset-0 rounded bg-black opacity-20 group-hover:opacity-0' />
              </div>
              <h2 className='mt-2.5 text-xl font-semibold'>
                {movie.movie.name}
              </h2>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      {movies.length > 4 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  )
}
