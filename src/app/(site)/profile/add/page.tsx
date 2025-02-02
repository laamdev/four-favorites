import { Metadata } from 'next'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'

import { PageTitle } from '@/components/globals/page-title'
import { MovieSearch } from '@/components/user/movie-search'
import { AddMovieButton } from '@/components/user/add-movie-button'

import { getFormattedYear } from '@/lib/utils'
import { checkMoviePosition } from '@/db/queries'
import { searchMovies } from '@/utils/tmdb'

interface AddMoviePageProps {
  searchParams: Promise<{ position: string; query: string }>
}

export const metadata: Metadata = {
  title: 'Add Favorite'
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
      <div className='mb-12 mt-16 sm:mt-24'>
        <PageTitle>Position #{position} Already Taken</PageTitle>
        <p>You already have {existingMovie.movie.name} in this position.</p>
      </div>
    )
  }

  return (
    <div className='mt-24'>
      <PageTitle>favorite #{Number(position)}</PageTitle>

      <div className='mt-4 sm:mt-8'>
        <MovieSearch />
      </div>

      <ul className='mt-4 grid grid-cols-5 gap-4 sm:mt-8'>
        {query &&
          movies.length > 0 &&
          movies.map(movie => (
            <li key={movie.id} className='group relative'>
              <div className='relative aspect-2/3 overflow-hidden rounded-md'>
                <Image
                  src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className='tw-gradient tw-animation relative rounded-md object-cover object-center'
                />
                <div className='tw-animation absolute inset-0 z-10 rounded-md bg-black opacity-0 group-hover:opacity-50' />
              </div>
              <div className='mt-2 flex flex-col gap-y-1'>
                <h2 className='text-base font-bold text-white'>
                  {`${movie.title} `}
                </h2>
                <h3 className='text-sm text-zinc-300'>
                  {movie.release_date && getFormattedYear(movie.release_date)}
                </h3>
              </div>

              <AddMovieButton movie={movie} position={Number(position)} />
            </li>
          ))}
      </ul>
    </div>
  )
}
