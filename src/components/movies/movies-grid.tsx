import { ItemCard } from '@/components/globals/item-card'
import { PaginationFavorites } from '@/components/favorites/pagination'

import { getRankedMovies } from '@/db/queries'
import { getYear } from '@/lib/utils'

interface MoviesGridProps {
  filter: string | string[] | undefined
  sort: string | string[] | undefined
  query: string | string[] | undefined
  page: number
}

export const MoviesGrid = async ({
  filter,
  sort,
  query,
  page
}: MoviesGridProps) => {
  const moviesPerPage = 10

  const { movies, totalCount } = await getRankedMovies({
    filter: filter as string,
    sort: sort as string,
    query: query as string,
    page: page
  })

  const totalPages = Math.ceil(totalCount / moviesPerPage)

  return (
    <div className='mt-4 sm:mt-8'>
      <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
        {movies.map(movie => {
          return (
            <ItemCard
              key={movie.id}
              slug={`/movies/${movie.slug}`}
              heading={movie.name}
              subheading={getYear(movie.releaseDate)}
              image={
                movie.posterUrl?.includes('cloudinary')
                  ? movie.posterUrl
                  : movie.posterUrl
                    ? `https://image.tmdb.org/t/p/w780${movie.posterUrl}`
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
