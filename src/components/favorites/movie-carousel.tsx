import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { ItemCard } from '@/components/globals/item-card'

import { cn, getFormattedYear } from '@/lib/utils'
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
              image={
                item.movie.posterUrl
                  ? `https://image.tmdb.org/t/p/w780${item.movie.posterUrl}`
                  : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'
              }
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className={cn('', movies.length <= 4 && 'sm:hidden')}>
        <CarouselPrevious />
        <CarouselNext />
      </div>

      {/* {movies.length > 4 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )} */}
    </Carousel>
  )
}
