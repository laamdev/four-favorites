import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'

import { MovieCarousel } from '@/components/favorites/movie-carousel'
import { EmptyState } from '@/components/globals/empty-state'
import { LikeButton } from '@/components/favorites/like-button'
import { VideoPlayer } from '@/components/globals/video-player'
import { SectionContainer } from '@/components/globals/section-wrapper'

import { getFavorite, getFavoritesSlugs } from '@/db/queries'
import { getFormattedDate } from '@/lib/utils'
interface FavoritesPageProps {
  params: Promise<{ listSlug: string }>
}

export async function generateStaticParams() {
  const slugs = await getFavoritesSlugs()
  return slugs.map(slug => ({ listSlug: slug }))
}

export async function generateMetadata({
  params
}: FavoritesPageProps): Promise<Metadata> {
  const { listSlug } = await params
  const { userId } = await auth()

  const favorite = await getFavorite(listSlug, userId!)

  if (!favorite) return notFound()

  return {
    title: favorite.name,
    description: `Discover ${favorite.name}'s Four Favorites picks.`
  }
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { listSlug } = await params
  const { userId } = await auth()
  const favorite = await getFavorite(listSlug, userId!)

  if (!favorite) return notFound()
  console.log(favorite)
  return (
    <div>
      <div className='bg-card'>
        <div className='container flex flex-col py-36'>
          <div className='mt-4 flex flex-col gap-y-8 sm:flex-row sm:gap-x-8'>
            <div className='aspect-2/3 relative w-48 overflow-hidden'>
              <Image
                src={
                  favorite.artistsToFavorites?.[0]?.artist?.headshotUrl?.includes(
                    'cloudinary'
                  )
                    ? favorite.artistsToFavorites[0]?.artist?.headshotUrl
                    : favorite.artistsToFavorites?.[0]?.artist?.headshotUrl
                      ? `https://image.tmdb.org/t/p/h632${favorite.artistsToFavorites[0]?.artist?.headshotUrl}`
                      : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
                }
                alt='Lists Hero'
                fill
                className='border object-cover object-center'
              />
            </div>

            <div>
              <Link
                href={`/lists?role=${favorite.artistsToFavorites?.[0]?.artist.role}`}
                className='text-primary text-xs font-black uppercase tracking-wider sm:text-sm'
              >
                {favorite.artistsToFavorites?.[0]?.artist.role}
              </Link>
              <h1 className='mt-4 flex flex-col font-serif text-6xl font-medium capitalize sm:text-7xl'>
                <span>{`${favorite.name}'s`}</span>
                <span className='text-neutral-500'>{`Four ${favorite.category === 'overall' ? 'Favorites' : `${favorite.category} Favorites`}`}</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <SectionContainer className='relative'>
        <div className='container'>
          <div className='absolute right-4 top-4 sm:right-8 sm:top-8'>
            <LikeButton
              favoriteId={favorite.id}
              userId={userId!}
              likedByUser={favorite.likedByUser}
              likes={Number(favorite.likes)}
            />
          </div>
          <div className='container'>
            {favorite.moviesToFavorites &&
            favorite.moviesToFavorites.length > 0 ? (
              <MovieCarousel movies={favorite.moviesToFavorites} />
            ) : (
              <EmptyState title='No movies found.' />
            )}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className='bg-neutral-800'>
        <div className='container flex flex-col items-center justify-center'>
          <VideoPlayer videoUrl={favorite.videoUrl} title={favorite.name} />
          <p className='mt-4 text-sm text-neutral-300'>
            {`Published on ${getFormattedDate(favorite.publishingDate)}`}
          </p>
        </div>
      </SectionContainer>
    </div>
  )
}
