import Link from 'next/link'
import Image from 'next/image'
import { currentUser } from '@clerk/nextjs/server'
import { PlusCircle } from '@phosphor-icons/react/dist/ssr'

import { PageTitle } from '@/components/globals/page-title'
import { UserMovieActionButtons } from '@/components/user/user-movie-action-buttons'
import { SectionHeading } from '@/components/globals/section-heading'
import { EmptyState } from '@/components/globals/empty-state'
import { ShareButton } from '@/components/user/share-button'
import { ItemCard } from '@/components/globals/item-card'
import { PageSummary } from '@/components/globals/page-summary'

import { getUserLikedFavorites, getUserMovies } from '@/db/queries'

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
    <div className='mt-24'>
      <div className='flex flex-col justify-between gap-y-4 sm:flex-row sm:items-end sm:gap-y-0'>
        <div>
          <PageTitle>My Four Favorites</PageTitle>
          <PageSummary>
            All directors featured in the Four Favorites lists.
          </PageSummary>
        </div>
        <ShareButton userId={user.id} />
      </div>

      <div className='mt-8 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-4'>
        {[0, 1, 2, 3].map(position => {
          const movie = userMovies.find(m => m.position === position + 1)

          return movie ? (
            <div key={position} className='group'>
              <div className='tw-animation relative aspect-2/3 overflow-hidden rounded-md border border-transparent group-hover:border-primary'>
                <Image
                  src={`https://image.tmdb.org/t/p/w780${movie.movie.posterUrl}`}
                  alt={movie.movie.name}
                  fill
                  className='tw-animation rounded-md bg-zinc-800 object-cover transition-transform'
                />
                <div className='tw-animation absolute inset-0 z-10 rounded-md bg-black opacity-0 group-hover:opacity-50' />

                <UserMovieActionButtons
                  movieId={movie.movieId}
                  position={position + 1}
                  movieSlug={movie.movie.slug}
                />
              </div>
              <h2 className='mt-2 text-lg font-bold'>
                {`${movie.movie.name} `}
              </h2>
            </div>
          ) : (
            <Link
              key={position}
              href={`/profile/add?position=${position + 1}`}
              className='group relative aspect-2/3 overflow-hidden rounded-md bg-zinc-800'
            >
              <PlusCircle className='tw-animation absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-white group-hover:text-primary' />
            </Link>
          )
        })}
      </div>

      <section className='mt-8 sm:mt-12'>
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
          <div className='mt-4 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-5'>
            {userLikedFavoriteLists.map(({ favorite }) => (
              <ItemCard
                key={favorite.id}
                slug={`/lists/${favorite.slug}`}
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
