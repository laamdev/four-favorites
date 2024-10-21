import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'

import { MovieCarousel } from '@/components/favorites/movie-carousel'
import { PageTitle } from '@/components/globals/page-title'
import { EmptyState } from '@/components/globals/empty-state'
import { Badge } from '@/components/ui/badge'

import { getFavorite } from '@/db/queries'

interface FavoritesPageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: FavoritesPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params

  const favorite = await getFavorite(slug)

  if (!favorite) {
    return notFound()
  }

  return {
    title: favorite.name
  }
}

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { slug } = params

  const favorite = await getFavorite(slug)

  if (!favorite) {
    return notFound()
  }

  return (
    <div>
      <Badge variant='outline' className='capitalize'>
        {favorite.category
          ? `${favorite.category} Favorites`
          : 'All Time Favorites'}
      </Badge>
      <PageTitle className='mt-2.5'>{favorite.name}</PageTitle>

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
