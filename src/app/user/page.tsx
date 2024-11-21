import Link from 'next/link'
import Image from 'next/image'
import { currentUser } from '@clerk/nextjs/server'
import { PlusCircle } from '@phosphor-icons/react/dist/ssr'

import { PageTitle } from '@/components/globals/page-title'
import { DeleteMovieButton } from '@/components/user/delete-movie-button'

import { getUserMovies } from '@/db/queries'

export default async function UserPage() {
  const user = await currentUser()

  if (!user?.id) return null

  const userMovies = await getUserMovies(user.id)

  console.log(JSON.stringify(userMovies, null, 2), 'XXX')
  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div className='flex items-end justify-between gap-x-2.5'>
        <PageTitle>My Four Favorites</PageTitle>
      </div>

      <div className='mt-10 grid grid-cols-4 gap-8'>
        {[0, 1, 2, 3].map(position => {
          const movie = userMovies.find(m => m.position === position + 1)

          return movie ? (
            <div key={position}>
              <div className='group relative aspect-[2/3] overflow-hidden rounded'>
                <Image
                  src={movie.movie.posterUrl}
                  alt={movie.movie.name}
                  fill
                  className='tw-animation rounded bg-zinc-800 object-cover transition-transform'
                />
                <div className='tw-animation absolute inset-0 z-10 bg-black opacity-0 group-hover:opacity-50' />

                <DeleteMovieButton
                  movieId={movie.movieId}
                  position={position + 1}
                />
              </div>
              <div className='mt-2 flex flex-col gap-y-1'>
                <h2 className='text-base font-bold text-white'>
                  {`${movie.movie.name} `}
                </h2>
                {/* <h3 className='text-sm text-zinc-300'>
                  {movie.movie. && getFormattedDate(movie.release_date)}
                </h3> */}
              </div>
            </div>
          ) : (
            <Link
              key={position}
              href={`/user/add?position=${position + 1}`}
              className='group relative aspect-[2/3] overflow-hidden rounded bg-zinc-800'
            >
              <PlusCircle className='tw-animation absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white group-hover:text-primary' />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
