import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'

import { PageTitle } from '@/components/globals/page-title'
import { MovieSearch } from '@/components/user/movie-search'
import { AddMovieButton } from '@/components/user/add-movie-button'

import { getFormattedDate } from '@/lib/utils'
import { searchMovies } from '@/utils/tmdb'
import { checkMoviePosition } from '@/db/queries'

interface AddMoviePageProps {
  searchParams: Promise<{ position: string; query: string }>
}

export default async function AddMoviePage({
  searchParams
}: AddMoviePageProps) {
  const { position, query } = await searchParams

  const { userId } = await auth()

  const existingMovie = userId
    ? await checkMoviePosition(userId, Number(position))
    : null
  const movies = query ? await searchMovies(query) : []

  if (existingMovie) {
    // Optionally redirect to edit page or show message
    return (
      <div className='mb-12 mt-24 sm:mt-28'>
        <PageTitle>Position #{position} Already Taken</PageTitle>
        <p>You already have {existingMovie.movie.name} in this position.</p>
      </div>
    )
  }

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <PageTitle>favorite #{Number(position)}</PageTitle>

      <div className='mt-8'>
        <MovieSearch />
      </div>

      <ul className='mt-8 grid grid-cols-5 gap-6'>
        {query &&
          movies.length > 0 &&
          movies.map(movie => (
            <li key={movie.id} className='group relative'>
              <div className='relative aspect-[2/3] overflow-hidden rounded'>
                <Image
                  src={`https://image.tmdb.org/t/p/w1280/${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className='tw-gradient tw-animation relative rounded object-cover object-center'
                />
                <div className='tw-animation absolute inset-0 z-10 bg-black opacity-0 group-hover:opacity-50' />
              </div>
              <div className='mt-2 flex flex-col gap-y-1'>
                <h2 className='text-base font-bold text-white'>
                  {`${movie.title} `}
                </h2>
                <h3 className='text-sm text-zinc-300'>
                  {movie.release_date && getFormattedDate(movie.release_date)}
                </h3>
              </div>

              <AddMovieButton movie={movie} position={Number(position)} />
            </li>
          ))}
      </ul>
    </div>
  )
}