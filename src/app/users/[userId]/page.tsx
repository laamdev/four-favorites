import { currentUser } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'

import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'
import { EmptyState } from '@/components/globals/empty-state'
import { ItemCard } from '@/components/globals/item-card'

import { getUserFavorites } from '@/db/queries'
import { getFormattedYear } from '@/lib/utils'

interface UserPageProps {
  params: Promise<{ userId: string }>
}

export async function generateMetadata() {
  const user = await currentUser()

  if (!user) {
    return notFound()
  }

  return {
    title: user.fullName
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { userId } = await params
  const user = await currentUser()
  const favorites = await getUserFavorites(userId)

  if (!user) {
    notFound()
  }

  return (
    <div className='mb-12 mt-16 sm:mt-24'>
      <div>
        <PageTitle className='flex flex-col'>
          <span>{`${user.fullName}'s`}</span>
          <span>Four Favorites</span>
        </PageTitle>
        <PageSummary>
          A curated collection of four all-time favorite films, personally
          selected by {user.fullName}.
        </PageSummary>
      </div>

      {favorites.length === 0 ? (
        <EmptyState>This user hasn't picked any favorites yet.</EmptyState>
      ) : (
        <div className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-4'>
          {favorites.map(favorite => (
            <ItemCard
              key={favorite.movieId}
              slug={`/movies/${favorite.movie.slug}`}
              heading={favorite.movie.name}
              subheading={getFormattedYear(favorite.movie.releaseDate)}
              image={`https://image.tmdb.org/t/p/w780${favorite.movie.posterUrl}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
