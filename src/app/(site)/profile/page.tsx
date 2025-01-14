import Link from 'next/link'
import Image from 'next/image'
import { currentUser } from '@clerk/nextjs/server'
import { PlusCircle } from '@phosphor-icons/react/dist/ssr'

import { PageTitle } from '@/components/globals/page-title'
import { UserMovieActionButtons } from '@/components/user/user-movie-action-buttons'
import { SectionHeading } from '@/components/globals/section-heading'
import { EmptyState } from '@/components/globals/empty-state'
import { ShareButton } from '@/components/user/share-button'

import { getUserLikedFavorites, getUserMovies } from '@/db/queries'
import { getFormattedYear } from '@/lib/utils'
import { ItemCard } from '@/components/globals/item-card'

export async function generateMetadata() {
  const user = await currentUser()

  return {
    title: user?.fullName || 'User'
  }
}

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user?.id) return null

  const userMovies = await getUserMovies(user.id)

  const userLikedFavoriteLists = await getUserLikedFavorites(user.id)
  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div className='flex items-end justify-between gap-x-2'>
        <PageTitle>My Four Favorites</PageTitle>
        <ShareButton userId={user.id} />
      </div>
      <div className='mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-4'>
        {[0, 1, 2, 3].map(position => {
          const movie = userMovies.find(m => m.position === position + 1)

          return movie ? (
            <div key={position}>
              <div className='group relative aspect-[2/3] overflow-hidden rounded'>
                <Image
                  src={`https://image.tmdb.org/t/p/w780${movie.movie.posterUrl}`}
                  alt={movie.movie.name}
                  fill
                  className='tw-animation rounded bg-zinc-800 object-cover transition-transform'
                />
                <div className='tw-animation absolute inset-0 z-10 bg-black opacity-0 group-hover:opacity-50' />

                <UserMovieActionButtons
                  movieId={movie.movieId}
                  position={position + 1}
                  movieSlug={movie.movie.slug}
                />
              </div>
              <div className='mt-2 flex flex-col gap-y-1'>
                <h2 className='text-sm font-bold text-white sm:text-base'>
                  {`${movie.movie.name} `}
                </h2>
                <h3 className='text-sm text-zinc-300'>
                  {movie.movie && getFormattedYear(movie.movie.releaseDate)}
                </h3>
              </div>
            </div>
          ) : (
            <Link
              key={position}
              href={`/profile/add?position=${position + 1}`}
              className='group relative aspect-[2/3] overflow-hidden rounded bg-zinc-800'
            >
              <PlusCircle className='tw-animation absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white group-hover:text-primary' />
            </Link>
          )
        })}
      </div>

      <section className='mt-24 sm:mt-28'>
        <SectionHeading text='My liked lists' />

        {userLikedFavoriteLists.length === 0 ? (
          <div className='mt-4 sm:mt-8'>
            <EmptyState>
              <p>
                <span>{`You haven't liked any lists yet. `}</span>
                <Link
                  href='/'
                  className='tw-animation font-medium underline hover:text-primary'
                >{`Explore some lists`}</Link>
                <span>{` and hit the like button!`}</span>
              </p>
            </EmptyState>
          </div>
        ) : (
          <div className='mt-4 grid grid-cols-5 gap-4 sm:mt-8'>
            {userLikedFavoriteLists.map(({ favorite }) => (
              <ItemCard
                key={favorite.id}
                slug={favorite.slug}
                heading={favorite.name}
                image={
                  favorite.artistsToFavorites[0]?.artist?.headshotUrl
                    ? `https://image.tmdb.org/t/p/h632${favorite.artistsToFavorites[0].artist.headshotUrl}`
                    : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
