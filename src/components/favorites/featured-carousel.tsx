'use client'

import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { ItemCard } from '@/components/globals/item-card'

import { cn } from '@/lib/utils'

type Artist = {
  id: number
  name: string
  headshotUrl: string | null
}

type FeaturedFavorite = {
  id: number
  name: string
  slug: string
  artistsToFavorites: Array<{
    artist: Artist
  }>
}

export function FeaturedCarousel({
  featuredFavorites
}: {
  featuredFavorites: FeaturedFavorite[]
}) {
  return (
    <div className='relative'>
      <Carousel
        opts={{
          align: 'start',
          loop: true
        }}
        plugins={[
          Autoplay({
            delay: 4000
          })
        ]}
      >
        <CarouselContent className='mt-4 sm:mt-8'>
          {featuredFavorites.map((featuredFavorite: FeaturedFavorite) => (
            <CarouselItem
              key={featuredFavorite.id}
              className='basis-1/2 pl-4 md:basis-1/2 lg:basis-1/4'
            >
              <ItemCard
                slug={`/lists/${featuredFavorite.slug}`}
                heading={featuredFavorite.name}
                subheading={featuredFavorite.artistsToFavorites[0]?.artist.role}
                image={
                  featuredFavorite.artistsToFavorites?.[0]?.artist?.headshotUrl?.includes(
                    'cloudinary'
                  )
                    ? featuredFavorite.artistsToFavorites[0]?.artist
                        ?.headshotUrl
                    : featuredFavorite.artistsToFavorites?.[0]?.artist
                          ?.headshotUrl
                      ? `https://image.tmdb.org/t/p/h632${featuredFavorite.artistsToFavorites[0]?.artist?.headshotUrl}`
                      : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
                }
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <div
          className={cn(
            'mt-4 flex justify-center gap-4 sm:mt-0 sm:block',
            featuredFavorites.length <= 4 && 'sm:hidden'
          )}
        >
          <CarouselPrevious className='static translate-y-0 sm:absolute' />
          <CarouselNext className='static translate-y-0 sm:absolute' />
        </div>
      </Carousel>
    </div>
  )
}
