import Link from 'next/link'
import Image from 'next/image'
import { currentUser } from '@clerk/nextjs/server'
import { Plus } from '@phosphor-icons/react/dist/ssr'

import { UserMovieActionButtons } from '@/components/user/user-movie-action-buttons'
import { SectionHeading } from '@/components/globals/section-heading'
import { EmptyState } from '@/components/globals/empty-state'
import { ItemCard } from '@/components/globals/item-card'
import { Hero } from '@/components/globals/hero'
import { SectionContainer } from '@/components/globals/section-wrapper'

import { getUserLikedFavorites, getUserMovies } from '@/db/queries'
import { getYear } from '@/lib/utils'

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
    <div>
      <Hero
        title='My Four Favorites'
        summary='Select your favorite movies to create your own Four Favorites lists.'
      />

      <SectionContainer>
        <div className='container grid grid-cols-2 gap-4 sm:grid-cols-4'>
          {[0, 1, 2, 3].map(position => {
            const movie = userMovies.find(m => m.position === position + 1)

            return movie ? (
              <div
                key={position}
                className='group block transform transition-transform duration-300 ease-out hover:-translate-y-2'
              >
                <div className='tw-animation aspect-2/3 relative overflow-hidden'>
                  <Image
                    src={`https://image.tmdb.org/t/p/w780${movie.movie.posterUrl}`}
                    alt={movie.movie.name}
                    fill
                    className='bg-card tw-animation relative object-cover object-center'
                  />

                  <div className='tw-animation absolute inset-0 z-50 group-hover:bg-black/50' />
                  <UserMovieActionButtons
                    movieId={movie.movieId}
                    position={position + 1}
                    movieSlug={movie.movie.slug}
                  />
                </div>
                <div className='mt-2'>
                  <h2 className='group-hover:text-primary tw-animation font-serif text-base font-bold tracking-wider sm:text-lg'>
                    {movie.movie.name}
                  </h2>
                  <p className='text-xs capitalize italic tracking-wide text-neutral-500 sm:text-sm'>
                    {getYear(movie.movie.releaseDate)}
                  </p>
                </div>
              </div>
            ) : (
              <Link
                key={position}
                href={`/profile/add?position=${position + 1}`}
                className='aspect-2/3 group relative overflow-hidden bg-gradient-to-br from-neutral-300 to-neutral-100'
              >
                <div className='bg-primary tw-animation absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full group-hover:bg-black'>
                  <Plus
                    weight='bold'
                    className='tw-animation size-6 text-white'
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </SectionContainer>

      <SectionContainer className='bg-card'>
        <div className='container'>
          <SectionHeading text='My liked lists' />

          {userLikedFavoriteLists.length === 0 ? (
            <div className='mt-4 sm:mt-8'>
              <EmptyState title='You haven’t liked any lists yet.' />
            </div>
          ) : (
            <div className='mt-4 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-5'>
              {userLikedFavoriteLists.map(({ favorite }) => (
                <ItemCard
                  key={favorite.id}
                  slug={`/lists/${favorite.slug}`}
                  heading={favorite.name}
                  subheading={favorite.artistsToFavorites[0]?.artist?.role}
                  image={
                    favorite.artistsToFavorites[0]?.artist?.headshotUrl
                      ? `https://image.tmdb.org/t/p/h632${favorite.artistsToFavorites[0].artist.headshotUrl}`
                      : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
                  }
                />
              ))}
            </div>
          )}
        </div>
      </SectionContainer>
    </div>
  )
}
