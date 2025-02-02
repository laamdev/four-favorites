import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { MovieCarousel } from '@/components/favorites/movie-carousel'
import { EmptyState } from '@/components/globals/empty-state'
import { LikeButton } from '@/components/favorites/like-button'
import { VideoPlayer } from '@/components/globals/video-player'

import { getFavorite, getFavoritesSlugs } from '@/db/queries'
import { getFormattedDate } from '@/lib/utils'
import { SectionWrapper } from '@/components/globals/section-wrapper'
import Link from 'next/link'

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

  return { title: favorite.name }
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { listSlug } = await params
  const { userId } = await auth()
  const favorite = await getFavorite(listSlug, userId!)

  if (!favorite) return notFound()

  return (
    <div>
      <div className='bg-card'>
        <div className='container flex flex-col py-36'>
          <Link
            href={`/lists?role=${favorite.artistsToFavorites?.[0]?.artist.role}`}
            className='text-primary font-black tracking-widest uppercase sm:text-sm'
          >
            {favorite.artistsToFavorites?.[0]?.artist.role}
          </Link>

          <div className='mt-4'>
            <h1 className='flex flex-col font-serif text-7xl font-medium capitalize'>
              <span>{`${favorite.name}'s`}</span>
              <span className='text-zinc-500'>{`Four ${favorite.category === 'overall' ? 'Favorites' : `${favorite.category} Favorites`}`}</span>
            </h1>
          </div>
        </div>
      </div>

      <SectionWrapper>
        <div className='absolute top-4 right-4'>
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
            <EmptyState>No movies found.</EmptyState>
          )}
        </div>
      </SectionWrapper>

      <div className='relative mx-auto bg-zinc-700 py-16'>
        <div className='container flex flex-col items-center justify-center gap-y-2 sm:mt-8'>
          <VideoPlayer videoUrl={favorite.videoUrl} title={favorite.name} />
          <p className='text-sm text-neutral-300'>
            {`Published on ${getFormattedDate(favorite.publishingDate)}`}
          </p>
        </div>
      </div>
    </div>
  )
}
