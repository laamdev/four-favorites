import Image from 'next/image'
import Link from 'next/link'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { ItemCard } from '@/components/globals/item-card'

import { MoviesToFavorites } from '@/types'
import { getFormattedYear } from '@/lib/utils'

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
      <CarouselContent className='-ml-4'>
        {movies.map(item => (
          <CarouselItem
            key={item.movie.id}
            className='pl-4 md:basis-1/2 lg:basis-1/4'
          >
            <ItemCard
              slug={`/movies/${item.movie.slug}`}
              heading={item.movie.name}
              subheading={getFormattedYear(item.movie.releaseDate)}
              image={`https://media.themoviedb.org/t/p/w600_and_h900_bestv2/${item.movie.posterUrl}`}
            />
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
