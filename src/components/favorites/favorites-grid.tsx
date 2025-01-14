import { ItemCard } from '@/components/globals/item-card'
import { PaginationFavorites } from '@/components/favorites/pagination'

import { getFavorites } from '@/db/queries'

interface FavoritesGridProps {
  filter: string | string[] | undefined
  sort: string | string[] | undefined
  query: string | string[] | undefined
  page: number
}

export const FavoritesGrid = async ({
  filter,
  sort,
  query,
  page
}: FavoritesGridProps) => {
  const favoritesPerPage = 10

  const { favorites, totalCount } = await getFavorites({
    filter: filter as string,
    sort: sort as string,
    query: query as string,
    page: page
  })

  const totalPages = Math.ceil(totalCount / favoritesPerPage)

  return (
    <div>
      <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
        {favorites.map(favorite => {
          return (
            <ItemCard
              key={favorite.id}
              slug={favorite.slug}
              heading={favorite.name}
              image={
                favorite.artistsToFavorites?.[0]?.artist?.headshotUrl?.includes(
                  'cloudinary'
                )
                  ? favorite.artistsToFavorites[0]?.artist?.headshotUrl
                  : favorite.artistsToFavorites?.[0]?.artist?.headshotUrl
                    ? `https://image.tmdb.org/t/p/h632${favorite.artistsToFavorites[0]?.artist?.headshotUrl}`
                    : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
              }
            />
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className='mt-4 sm:mt-8'>
          <PaginationFavorites
            page={page}
            totalPages={totalPages}
            totalDocs={totalCount}
          />
        </div>
      )}
    </div>
  )
}
