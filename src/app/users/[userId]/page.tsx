import Image from 'next/image'
import { auth, currentUser } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'

import { getUserFavorites } from '@/db/queries'
import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'
import { EmptyState } from '@/components/globals/empty-state'
import { ItemCard } from '@/components/globals/item-card'
import { getFormattedYear } from '@/lib/utils'

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function UserPage({ params }: PageProps) {
  const { userId } = await params
  const user = await currentUser()
  const favorites = await getUserFavorites(userId)

  if (!user) {
    notFound()
  }

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div>
        <PageTitle>{user.fullName}</PageTitle>
        <PageSummary>The user's Four Favorites list.</PageSummary>
      </div>

      {favorites.length === 0 ? (
        <EmptyState>This user hasn't picked any favorites yet.</EmptyState>
      ) : (
        <div className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-4'>
          {favorites.map(favorite => (
            <ItemCard
              key={favorite.movieId}
              slug={favorite.movie.slug}
              heading={favorite.movie.name}
              subheading={getFormattedYear(favorite.movie.releaseDate)}
              image={`https://image.tmdb.org/t/p/w1280/${favorite.movie.posterUrl}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}