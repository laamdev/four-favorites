import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { MovieCarousel } from '@/components/favorites/movie-carousel'
import { PageTitle } from '@/components/globals/page-title'
import { EmptyState } from '@/components/globals/empty-state'
import { SectionHeading } from '@/components/globals/section-heading'
import { LikeButton } from '@/components/favorites/like-button'
import { badgeVariants } from '@/components/ui/badge'
import { VideoPlayer } from '@/components/globals/video-player'

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

  return { title: favorite.name }
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { listSlug } = await params
  const { userId } = await auth()
  const favorite = await getFavorite(listSlug, userId!)

  if (!favorite) return notFound()

  // Get first artist's role if exists
  const primaryArtist = favorite.artistsToFavorites?.[0]?.artist

  return (
    <div className='mt-24'>
      <h2 className='text-xs font-medium uppercase tracking-widest text-primary sm:text-sm'>
        {favorite.category
          ? `${favorite.category} Favorites`
          : 'All Time Favorites'}
      </h2>

      <div className='mt-2'>
        <PageTitle>{favorite.name}</PageTitle>
        <Link
          href={`/lists?role=${primaryArtist?.role}`}
          className={badgeVariants({
            className: 'mt-2 capitalize'
          })}
        >
          {primaryArtist?.role}
        </Link>
      </div>

      <div className='mt-8 sm:mt-16'>
        <div className='mb-2 flex justify-end'>
          <LikeButton
            favoriteId={favorite.id}
            userId={userId!}
            likedByUser={favorite.likedByUser}
            likes={Number(favorite.likes)}
          />
        </div>

        {favorite.moviesToFavorites && favorite.moviesToFavorites.length > 0 ? (
          <MovieCarousel movies={favorite.moviesToFavorites} />
        ) : (
          <EmptyState>No movies found.</EmptyState>
        )}
      </div>

      <div className='relative mx-auto mt-16 sm:mt-32'>
        <div className='flex flex-col items-center justify-center'>
          <SectionHeading
            text={`Published on ${getFormattedDate(favorite.publishingDate)}`}
          />
        </div>
        <div className='mt-4 sm:mt-8'>
          <VideoPlayer videoUrl={favorite.videoUrl} title={favorite.name} />
        </div>
      </div>
    </div>
  )
}
