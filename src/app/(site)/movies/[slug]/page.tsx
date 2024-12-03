import Image from 'next/image'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { LinkSimple } from '@phosphor-icons/react/dist/ssr'

import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'
import { StatCard } from '@/components/movies/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/globals/empty-state'
import { SectionHeading } from '@/components/globals/section-heading'
import { ItemCard } from '@/components/globals/item-card'

import { getMovie, getMoviesSlugs } from '@/db/queries'

interface MoviePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getMoviesSlugs()

  return slugs.map(slug => ({
    slug: slug
  }))
}

export const generateMetadata = async ({ params }: MoviePageProps) => {
  const { slug } = await params
  const movie = await getMovie(slug)

  if (!movie) {
    return {
      title: 'Movie Not Found'
    }
  }

  return {
    title: movie?.name
  }
}

export default async function MoviePage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const { slug } = params

  const movie = await getMovie(slug)

  if (!movie) {
    return notFound()
  }

  const movieCountInFavorites = movie.moviesToFavorites.length

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div>
        <div className='flex flex-col gap-y-8 sm:gap-y-0'>
          <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between'>
            <PageTitle>{movie.name}</PageTitle>
            <h2 className='mt-2 flex items-baseline gap-x-2'>
              <span className='text-xs uppercase text-zinc-400'>{`Directed by`}</span>
              <span className='text-lg font-medium'>{movie.director}</span>
            </h2>
          </div>

          <PageSummary>{movie.overview}</PageSummary>
        </div>
      </div>
      <div className='mt-8 grid gap-4 sm:mt-12 sm:grid-cols-3'>
        <div className='col-span-1'>
          <div className='relative aspect-[2/3] w-auto rounded-lg bg-white'>
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${movie.posterUrl}`}
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
          <StatCard label={`Number of Lists`} value={movieCountInFavorites!} />
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
                slug={`/${favorite.slug}`}
                heading={favorite.name}
                image={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${favorite.artist?.headshotUrl}`}
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
}
