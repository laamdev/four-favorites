import Image from 'next/image'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'

import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'
import { StatCard } from '@/components/movies/stat-card'

import { getMovie } from '@/db/queries'

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>
}) => {
  const params = await props.params
  const movie = await getMovie(params.slug)

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
        <div className='flex items-end justify-between gap-x-2'>
          <PageTitle>{movie.name}</PageTitle>
          <h2 className='mt-2 flex items-baseline gap-x-2'>
            <span className='text-xs uppercase text-zinc-400'>{`Directed by`}</span>
            <span className='text-lg font-medium'>{movie.director}</span>
          </h2>
        </div>

        <PageSummary className='mt-2 sm:mt-4'>{movie.overview}</PageSummary>
      </div>
      <div className='mt-8 flex gap-x-4 sm:mt-12'>
        <div className='relative aspect-[2/3] h-[520px] w-auto rounded'>
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${movie.posterUrl}`}
            alt={movie.name}
            fill
            className='tw-gradient rounded object-cover object-center'
          />
        </div>
        <div className='grid h-fit w-full grid-cols-2 gap-4'>
          <StatCard label={`Number of Lists`} value={movieCountInFavorites!} />
          <StatCard label={`Rank`} value={movie.rank!} />
          <StatCard
            label={`Release Year`}
            value={format(parseISO(movie.releaseDate), 'yyyy')}
          />
        </div>
      </div>
    </div>
  )
}
