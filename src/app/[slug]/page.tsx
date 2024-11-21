import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { MovieCarousel } from '@/components/favorites/movie-carousel'
import { PageTitle } from '@/components/globals/page-title'
import { EmptyState } from '@/components/globals/empty-state'
import { Badge } from '@/components/ui/badge'

import { getFavorite } from '@/db/queries'
import { LikeButton } from '@/components/favorites/like-button'
import { auth } from '@clerk/nextjs/server'

interface FavoritesPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: FavoritesPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const searchParams = await props.searchParams
  const params = await props.params
  const { slug } = params

  const { userId, redirectToSignIn } = await auth()

  const favorite = await getFavorite(slug, userId!)

  if (!favorite) {
    return notFound()
  }

  return {
    title: favorite.name
  }
}

export default async function FavoritesPage(props: FavoritesPageProps) {
  const params = await props.params
  const { slug } = params

  const { userId, redirectToSignIn } = await auth()

  const favorite = await getFavorite(slug, userId!)

  if (!favorite) {
    return notFound()
  }

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <Badge className='capitalize'>
        {favorite.category
          ? `${favorite.category} Favorites`
          : 'All Time Favorites'}
      </Badge>

      <div className='flex items-end justify-between'>
        <PageTitle className='mt-5'>{favorite.name}</PageTitle>
        <LikeButton
          favoriteId={favorite.id}
          userId={userId!}
          likedByUser={favorite.likedByUser}
          likes={Number(favorite.likes)}
        />
      </div>

      <div className='mt-10'>
        {favorite.moviesToFavorites && favorite.moviesToFavorites.length > 0 ? (
          <MovieCarousel movies={favorite.moviesToFavorites} />
        ) : (
          <EmptyState>No movies found.</EmptyState>
        )}
      </div>
    </div>
  )
}
