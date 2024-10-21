import Image from 'next/image'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'

import { PageTitle } from '@/components/globals/page-title'
import { StatCard } from '@/components/movies/stat-card'

import { getMovie } from '@/db/queries'

export const generateMetadata = async ({
  params
}: {
  params: { slug: string }
}) => {
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
    <div>
      <div className='max-w-5xl'>
        <PageTitle className='text-5xl'>{movie.name}</PageTitle>
        <p className='mt-5 text-lg'>{movie.overview}</p>
      </div>
      <div className='mt-20 flex gap-x-10'>
        <div className='relative aspect-[2/3] h-[520px] w-auto rounded'>
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${movie.posterUrl}`}
            alt={movie.name}
            fill
            className='tw-gradient rounded object-cover object-center'
          />
        </div>
        <div className='grid w-full grid-cols-2 gap-10'>
          <StatCard label={`Number of Lists`} value={movieCountInFavorites!} />
          <StatCard
            label={`Release Year`}
            value={format(parseISO(movie.releaseDate), 'yyyy')}
          />
        </div>
      </div>
    </div>
  )
}
