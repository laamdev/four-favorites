import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { LinkSimple } from '@phosphor-icons/react/dist/ssr'

import { PageTitle } from '@/components/globals/page-title'
import { StatCard } from '@/components/movies/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/globals/empty-state'
import { SectionHeading } from '@/components/globals/section-heading'
import { ItemCard } from '@/components/globals/item-card'
import { Badge } from '@/components/ui/badge'

import { getMovie, getMoviesSlugs } from '@/db/queries'
import { movieGenres } from '@/lib/data/movie-genres'

interface MoviePageProps {
  params: Promise<{ movieSlug: string }>
}

export async function generateStaticParams() {
  const slugs = await getMoviesSlugs()

  return slugs.map(slug => ({
    slug: slug
  }))
}

export const generateMetadata = async ({ params }: MoviePageProps) => {
  const { movieSlug } = await params
  const movie = await getMovie(movieSlug)

  if (!movie) {
    return {
      title: 'Movie Not Found'
    }
  }

  return {
    title: movie?.name
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { movieSlug } = await params

  try {
    const movie = await getMovie(movieSlug)

    if (!movie) {
      return notFound()
    }

    const movieCountInFavorites = movie.moviesToFavorites.length
    const directors = movie.director.split(',').map(d => ({
      name: d.trim(),
      slug: d.trim().toLowerCase().replace(/\s+/g, '-')
    }))

    return (
      <div className='mb-12 mt-24 sm:mt-28'>
        <div>
          <div className='flex flex-col gap-y-2 sm:gap-y-4'>
            <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between'>
              <PageTitle size='lg'>{movie.name}</PageTitle>
              <div className='mt-4 flex flex-col gap-y-1 sm:mt-0 sm:items-end'>
                <span className='text-xs uppercase text-zinc-400'>
                  Directed by
                </span>
                <div className='flex flex-wrap gap-2 sm:justify-end'>
                  {directors.map((director, index) => (
                    <Link
                      key={director.slug}
                      href={`/directors/${director.slug}`}
                      className='tw-animation group inline-flex items-center gap-x-1 text-base font-medium hover:text-primary sm:text-lg'
                    >
                      {director.name}
                      {index < directors.length - 1 && (
                        <span className='text-muted-foreground'>,</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              {(movie.genres ?? []).map(genreId => {
                const genre = movieGenres.find(
                  genre => genre.id === Number(genreId)
                )
                return (
                  <Link key={genreId} href={`/movies?genre=${genreId}`}>
                    <Badge variant='secondary'>
                      {genre?.name || 'Unknown Genre'}
                    </Badge>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
        <div className='mt-4 grid gap-4 sm:mt-8 sm:grid-cols-3'>
          <div className='col-span-1'>
            <div className='relative aspect-[2/3] w-auto rounded-lg bg-white'>
              <Image
                src={`https://image.tmdb.org/t/p/w780${movie.posterUrl}`}
                alt={movie.name}
                fill
                className='tw-gradient rounded-lg object-cover object-center'
              />
            </div>
            <a
              href={movie.letterboxdUrl!}
              target='_blank'
              rel='noopener noreferrer'
              className={buttonVariants({ className: 'mt-4 w-full' })}
            >
              <LinkSimple weight='bold' className='size-4' />
              View on Letterboxd
            </a>
          </div>
          <div className='grid h-fit grid-cols-2 flex-col gap-4 sm:col-span-2'>
            <StatCard
              label={`Number of Lists`}
              value={movieCountInFavorites!}
            />
            <StatCard label={`Rank`} value={movie.rank!} />
            <StatCard
              label={`Release Year`}
              value={format(parseISO(movie.releaseDate), 'yyyy')}
            />
          </div>
        </div>

        <div className='mt-24 sm:mt-28'>
          <SectionHeading text='Picked by' />
          {movie.favorites.length > 0 ? (
            <div className='mt-4 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-5'>
              {movie.favorites.map(favorite => (
                <ItemCard
                  key={favorite.id}
                  slug={`/lists/${favorite.slug}`}
                  heading={favorite.name}
                  image={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${favorite.artists[0]?.headshotUrl}`}
                />
              ))}
            </div>
          ) : (
            <div className='mt-4 sm:mt-8'>
              <EmptyState>
                This movie is not included in any lists yet.
              </EmptyState>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching movie:', error)
    throw new Error('Failed to load movie data. Please try again later.')
  }
}
