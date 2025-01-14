import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import { MovieCarousel } from '@/components/favorites/movie-carousel'
import { PageTitle } from '@/components/globals/page-title'
import { EmptyState } from '@/components/globals/empty-state'
import { SectionHeading } from '@/components/globals/section-heading'
import { LikeButton } from '@/components/favorites/like-button'

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

  const favorite = await getFavorite(listSlug)

  if (!favorite) return notFound()

  return { title: favorite.name }
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { listSlug } = await params
  const { userId } = await auth()
  const favorite = await getFavorite(listSlug)

  if (!favorite) return notFound()

  // Get first artist's role if exists
  const primaryArtist = favorite.artistsToFavorites?.[0]?.artist

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <h2 className='text-xs font-medium uppercase tracking-widest text-primary sm:text-sm'>
        {favorite.category
          ? `${favorite.category} Favorites`
          : 'All Time Favorites'}
      </h2>

      <div className='mt-2 flex items-end justify-between'>
        <div className='flex flex-col gap-y-2'>
          <PageTitle size='lg'>
            {favorite.name}
            <span className='ml-2 font-sans text-xs font-medium uppercase tracking-wider text-zinc-400 sm:text-sm'>
              {primaryArtist?.role}
            </span>
          </PageTitle>
        </div>

        <LikeButton
          favoriteId={favorite.id}
          userId={userId!}
          likedByUser={favorite.likedByUser}
          likes={Number(favorite.likes)}
        />
      </div>

      <div className='mt-4 sm:mt-8'>
        {favorite.moviesToFavorites && favorite.moviesToFavorites.length > 0 ? (
          <div className='px-8 sm:px-0'>
            <MovieCarousel movies={favorite.moviesToFavorites} />
          </div>
        ) : (
          <EmptyState>No movies found.</EmptyState>
        )}

        <div className='relative mx-auto mt-4 aspect-video h-full w-full max-w-5xl sm:mt-8'>
          <div className='mt-24 flex flex-col items-center justify-center sm:mt-28'>
            <SectionHeading
              text={`Published on ${getFormattedDate(favorite.publishingDate)}`}
            />
          </div>
          <iframe
            src={favorite.videoUrl}
            title='YouTube video player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
            className='mt-4 h-full w-full sm:mt-8'
          />
        </div>
      </div>
    </div>
  )
}
