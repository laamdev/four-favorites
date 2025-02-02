import Link from 'next/link'
import Image from 'next/image'

import { badgeVariants } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { MovieStats } from '@/components/movies/movie-stats'
import { HeroTitle } from '@/components/globals/hero-title'
import { HeroTagline } from '@/components/globals/hero-tagline'
import { HeroSummary } from '@/components/globals/hero-summary'
import { SocialShare } from '@/components/globals/social-share'

import { getCountryNameFromCode } from '@/lib/utils'
import { getYear } from '@/lib/utils'
import { movieGenres } from '@/data/movie-genres'

interface MovieHeroProps {
  movie: {
    name: string
    director: string
    overview: string
    genres: string[] | null
    slug: string
    posterUrl: string | null
    releaseDate: string
    country: string
    rank: number
    listCount: number
    letterboxdUrl: string | null
  }
}

export const MovieHero = ({ movie }: MovieHeroProps) => {
  console.log(movie)
  return (
    <div className='container grid flex-col py-24 sm:grid-cols-3 sm:py-36'>
      <div className='mt-8 sm:col-span-2 sm:mt-0'>
        <HeroTagline tagline={movie.director} />

        <div className='mt-4'>
          <HeroTitle title={movie.name} />

          <HeroSummary className='mt-4 max-w-xl text-base text-zinc-500 sm:mt-8 sm:text-lg'>
            {movie.overview}
          </HeroSummary>

          <div className='mt-4 flex flex-wrap gap-2 sm:mt-8 sm:gap-4'>
            {(movie.genres ?? []).map(genreId => {
              const genre = movieGenres.find(
                genre => genre.id === Number(genreId)
              )
              return (
                <Link
                  key={genreId}
                  href={`/movies?genre=${genreId}`}
                  className={badgeVariants({
                    className: 'capitalize'
                  })}
                >
                  {genre?.name}
                </Link>
              )
            })}
          </div>

          <MovieStats
            releaseYear={getYear(movie.releaseDate)}
            director={movie.director}
            country={getCountryNameFromCode(movie.country) || 'Unknown'}
            favoritesCount={movie.listCount}
            rank={movie.rank}
          />

          <div className='mt-16 sm:mt-8 sm:hidden'>
            <div className='flex flex-col gap-4'>
              <Link
                href={
                  movie.letterboxdUrl ||
                  `https://letterboxd.com/film/${movie.slug}`
                }
                className={buttonVariants({ className: 'w-full' })}
              >
                See on Letterboxd
              </Link>
              <Link
                href={`https://letterboxd.com/film/${movie.slug}`}
                className={buttonVariants({
                  variant: 'secondary',
                  className: 'w-full'
                })}
              >
                See on Letterboxd
              </Link>
            </div>
            <div className='mt-8'>
              <SocialShare />
            </div>
          </div>
        </div>
      </div>

      <div className='col-span-1 row-start-1 sm:row-start-auto'>
        <div className='relative aspect-2/3 w-auto'>
          <Image
            src={`https://image.tmdb.org/t/p/w780${movie.posterUrl}`}
            alt={movie.name}
            fill
            className='tw-gradient object-cover object-center'
          />
        </div>
        <div className='bg-card hidden flex-col gap-8 p-8 sm:flex'>
          <div className='flex flex-col gap-4'>
            <Link
              href={
                movie.letterboxdUrl ||
                `https://letterboxd.com/film/${movie.slug}`
              }
              target='_blank'
              rel='noopener noreferrer'
              className={buttonVariants({ className: 'w-full' })}
            >
              See on Letterboxd
            </Link>
            <Link
              href={`https://letterboxd.com/film/${movie.slug}`}
              target='_blank'
              rel='noopener noreferrer'
              className={buttonVariants({
                variant: 'secondary',
                className: 'w-full'
              })}
            >
              See on Letterboxd
            </Link>
          </div>

          <SocialShare />
        </div>
      </div>
    </div>
  )
}
