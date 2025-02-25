import { and, desc, eq, asc, like, sql, exists, count } from 'drizzle-orm'

import { db } from '@/db'
import {
  favorites,
  userLikes,
  artists,
  moviesToFavorites,
  movies,
  userMovies,
  artistsToFavorites,
  artistsRolesEnum
} from '@/db/schema'
import { movieGenres } from '@/data/movie-genres'

export interface DecadeCount {
  decade: number
  count: number
}

export interface DirectorCount {
  director: string
  count: number
}

interface GetFavoritesProps {
  filter?: string
  sort?: string
  query?: string
  page?: number
}

interface RankedMovie {
  id: number
  name: string
  slug: string
  overview: string
  director: string
  country: string
  genres: string[] | null
  releaseDate: string
  posterUrl: string | null
  list_count: number
}

interface DirectorDetails {
  name: string
  movies: {
    id: number
    name: string
    slug: string
    overview: string
    director: string
    country: string
    genres: string[] | null
    releaseDate: string
    posterUrl: string | null
    favorites: {
      id: number
      name: string
      slug: string
      publishingDate: string
      videoUrl: string
      likes: string
      category: 'horror' | 'family' | 'western' | 'overall'
    }[]
  }[]
}

interface DirectorWithSlug {
  name: string
  slug: string
  movieCount: number
}

interface GenreWithCount {
  id: number
  name: string
  slug: string
  movieCount: number
}

export async function getFavorites({
  filter,
  sort,
  query,
  page
}: GetFavoritesProps) {
  const itemsPerPage = 10

  const whereClause = and(
    query
      ? sql`LOWER(${favorites.name}) LIKE ${`%${query.toLowerCase()}%`}`
      : undefined,
    filter && filter !== 'all'
      ? exists(
          db
            .select()
            .from(artistsToFavorites)
            .innerJoin(artists, eq(artistsToFavorites.artistId, artists.id))
            .where(
              and(
                eq(artistsToFavorites.favoriteId, favorites.id),
                eq(
                  artists.role,
                  filter as (typeof artistsRolesEnum.enumValues)[number]
                )
              )
            )
        )
      : undefined
  )

  const [results, [{ count: totalCount }]] = await Promise.all([
    db.query.favorites.findMany({
      where: whereClause,
      with: {
        artistsToFavorites: {
          with: {
            artist: {
              columns: {
                id: true,
                name: true,
                role: true,
                headshotUrl: true,
                slug: true
              }
            }
          }
        },
        moviesToFavorites: {
          with: {
            movie: true
          }
        }
      },
      limit: itemsPerPage,
      offset: ((page ?? 1) - 1) * itemsPerPage,
      orderBy:
        sort === 'name'
          ? [asc(favorites.name)]
          : sort === '-name'
            ? [desc(favorites.name)]
            : sort === 'publishing_date'
              ? [asc(favorites.publishingDate)]
              : sort === '-publishing_date'
                ? [desc(favorites.publishingDate)]
                : sort === 'most_liked'
                  ? [desc(favorites.likes)]
                  : [desc(favorites.publishingDate)]
    }),
    db
      .select({
        count: sql<number>`count(DISTINCT ${favorites.id})`
      })
      .from(favorites)
      .where(whereClause)
  ])

  return {
    favorites: results.map(favorite => ({
      ...favorite,
      id: favorite.id.toString(),
      artists: favorite.artistsToFavorites.map(atf => atf.artist)
    })),
    totalCount: Number(totalCount)
  }
}

export async function getFavorite(slug: string, userId: string) {
  const favorite = await db.query.favorites.findFirst({
    where: eq(favorites.slug, slug),
    with: {
      artistsToFavorites: {
        with: {
          artist: {
            columns: {
              id: true,
              name: true,
              role: true,
              headshotUrl: true,
              slug: true
            }
          }
        }
      },
      moviesToFavorites: {
        with: {
          movie: true
        }
      }
    }
  })

  if (!favorite) return null

  const likedByUser = await db.query.userLikes.findFirst({
    where: and(
      eq(userLikes.userId, userId),
      eq(userLikes.favoriteId, favorite.id)
    )
  })

  return {
    ...favorite,
    likedByUser: !!likedByUser,
    artists: favorite.artistsToFavorites.map(atf => atf.artist)
  }
}

export async function getAllMoviesWithFavoriteCounts() {
  return await db.query.movies.findMany({
    with: {
      moviesToFavorites: true
    }
  })
}

export async function getMovie(slug: string) {
  const movie = await db.query.movies.findFirst({
    where: eq(movies.slug, slug),
    with: {
      moviesToFavorites: {
        with: {
          favorite: {
            with: {
              artistsToFavorites: {
                with: {
                  artist: true
                }
              }
            }
          }
        }
      }
    }
  })

  if (!movie) return null

  const moviesWithCounts = await db
    .select({
      id: movies.id,
      name: movies.name,
      listCount: sql<number>`count(${moviesToFavorites.favoriteId})`.as(
        'list_count'
      )
    })
    .from(movies)
    .leftJoin(moviesToFavorites, eq(movies.id, moviesToFavorites.movieId))
    .groupBy(movies.id, movies.name)
    .orderBy(desc(sql`list_count`), asc(movies.name))

  let currentRank = 0
  let previousListCount = Number.MAX_SAFE_INTEGER
  let rank = 0
  let listCount = 0

  for (const m of moviesWithCounts) {
    if (m.listCount < previousListCount) {
      currentRank++
    }
    previousListCount = m.listCount

    if (m.id === movie.id) {
      rank = currentRank
      listCount = m.listCount
      break
    }
  }

  const favorites = movie.moviesToFavorites.map(mtf => ({
    id: mtf.favorite.id,
    name: mtf.favorite.name,
    slug: mtf.favorite.slug,
    artists: mtf.favorite.artistsToFavorites.map(atf => atf.artist)
  }))

  return {
    ...movie,
    rank,
    listCount,
    favorites
  }
}

export async function getUserLikedFavorites(userId: string) {
  if (!userId) {
    throw new Error('UserId is required')
  }

  try {
    const likes = await db.query.userLikes.findMany({
      where: eq(userLikes.userId, userId),
      with: {
        favorite: {
          with: {
            artistsToFavorites: {
              with: {
                artist: {
                  columns: {
                    headshotUrl: true,
                    role: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return likes
  } catch (error) {
    console.error('Error fetching user liked favorites:', error)
    throw error
  }
}

export async function getUserMovies(userId: string) {
  if (!userId) throw new Error('UserId is required')

  return await db.query.userMovies.findMany({
    where: eq(userMovies.userId, userId),
    with: {
      movie: {
        columns: {
          id: true,
          name: true,
          slug: true,
          posterUrl: true,
          releaseDate: true
        }
      }
    },
    orderBy: (userMovies, { asc }) => [asc(userMovies.position)]
  })
}

export async function getFavoriteListMovies() {
  return await db.query.moviesToFavorites.findMany({
    with: {
      movie: {
        columns: {
          id: true,
          name: true,
          slug: true,
          posterUrl: true,
          director: true,
          releaseDate: true
        }
      }
    },
    orderBy: (moviesToFavorites, { asc }) => [asc(moviesToFavorites.movieId)]
  })
}

export async function getMostRecentFavorite() {
  return await db.query.favorites.findFirst({
    orderBy: desc(favorites.publishingDate),
    columns: {
      publishingDate: true
    }
  })
}

export async function getFavoritesSlugs() {
  const favorites = await db.query.favorites.findMany({
    columns: {
      slug: true
    }
  })
  return favorites.map(favorite => favorite.slug)
}

export async function getMoviesSlugs() {
  const movies = await db.query.movies.findMany({
    columns: {
      slug: true
    }
  })
  return movies.map(movie => movie.slug)
}

export async function getRankedMovies({
  filter,
  sort,
  query,
  page = 1
}: {
  filter?: string
  sort?: string
  query?: string
  page?: number
}) {
  const itemsPerPage = 10

  const whereClause = and(
    query
      ? sql`LOWER(${movies.name}) LIKE ${`%${query.toLowerCase()}%`}`
      : undefined,
    filter && filter !== 'all'
      ? sql`${filter} = ANY(${movies.genres})`
      : undefined
  )

  const orderBy =
    sort === 'name'
      ? [asc(movies.name)]
      : sort === '-name'
        ? [desc(movies.name)]
        : sort === 'release_date'
          ? [asc(movies.releaseDate)]
          : sort === '-release_date'
            ? [desc(movies.releaseDate)]
            : sort === 'most_listed'
              ? [desc(sql`list_count`), asc(movies.name)]
              : [desc(sql`list_count`), asc(movies.name)]

  const [moviesWithCounts, [{ totalCount }]] = await Promise.all([
    db
      .select({
        id: movies.id,
        name: movies.name,
        slug: movies.slug,
        overview: movies.overview,
        director: movies.director,
        country: movies.country,
        genres: movies.genres,
        releaseDate: movies.releaseDate,
        posterUrl: movies.posterUrl,
        list_count: sql<number>`count(${moviesToFavorites.favoriteId})`.as(
          'list_count'
        )
      })
      .from(movies)
      .leftJoin(moviesToFavorites, eq(movies.id, moviesToFavorites.movieId))
      .where(whereClause)
      .groupBy(movies.id)
      .orderBy(...orderBy)
      .limit(itemsPerPage)
      .offset((page - 1) * itemsPerPage),

    db
      .select({
        totalCount: sql<number>`count(DISTINCT ${movies.id})`
      })
      .from(movies)
      .where(whereClause)
  ])

  let currentRank = 1
  let previousCount: number | null = null

  const rankedMovies: RankedMovie[] = moviesWithCounts.map(movie => {
    if (previousCount !== null && movie.list_count < previousCount) {
      currentRank = currentRank + 1
    }
    previousCount = movie.list_count

    return {
      ...movie,
      rank: currentRank
    }
  })

  return {
    movies: rankedMovies,
    totalCount: Number(totalCount)
  }
}

export async function checkMoviePosition(userId: string, position: number) {
  if (!userId) throw new Error('UserId is required')

  return await db.query.userMovies.findFirst({
    where: and(
      eq(userMovies.userId, userId),
      eq(userMovies.position, position)
    ),
    with: {
      movie: {
        columns: {
          id: true,
          name: true,
          slug: true,
          posterUrl: true,
          releaseDate: true
        }
      }
    }
  })
}

export function getFormattedYear(date: string | Date): string {
  if (!date) return ''

  try {
    const parsedDate = new Date(date)
    return parsedDate.getFullYear().toString()
  } catch (error) {
    console.error('Error formatting year:', error)
    return ''
  }
}

export async function getUserFavorites(userId: string) {
  if (!userId) throw new Error('UserId is required')

  return await db.query.userMovies.findMany({
    where: eq(userMovies.userId, userId),
    with: {
      movie: {
        columns: {
          id: true,
          name: true,
          slug: true,
          posterUrl: true,
          releaseDate: true,
          director: true,
          overview: true
        }
      }
    },
    orderBy: (userMovies, { asc }) => [asc(userMovies.position)]
  })
}

export async function getMoviesByDecade(): Promise<DecadeCount[]> {
  const decadeExpression = sql<number>`EXTRACT(YEAR FROM ${movies.releaseDate}::timestamp)::integer / 10 * 10`

  return await db
    .select({
      decade: decadeExpression,
      count: count(movies.id)
    })
    .from(movies)
    .innerJoin(moviesToFavorites, eq(movies.id, moviesToFavorites.movieId))
    .groupBy(decadeExpression)
    .orderBy(decadeExpression)
}

export async function getMoviesByDirector(): Promise<DirectorCount[]> {
  const results = await db
    .select({
      director: movies.director,
      count: sql<number>`count(DISTINCT ${movies.id})`.as('count')
    })
    .from(movies)
    .innerJoin(moviesToFavorites, eq(movies.id, moviesToFavorites.movieId))
    .groupBy(movies.director)
    .having(sql`count(DISTINCT ${movies.id}) > 0`)
    .orderBy(desc(sql`count`))

  return results.map(result => ({
    director: result.director,
    count: Number(result.count)
  }))
}

export async function getDirector(
  slug: string
): Promise<DirectorDetails | null> {
  const directorMovies = await db
    .select({
      id: movies.id,
      name: movies.name,
      slug: movies.slug,
      overview: movies.overview,
      director: movies.director,
      country: movies.country,
      genres: movies.genres,
      releaseDate: movies.releaseDate,
      posterUrl: movies.posterUrl,
      letterboxdUrl: movies.letterboxdUrl,
      favoriteCount: sql<number>`count(${moviesToFavorites.favoriteId})`.as(
        'favorite_count'
      )
    })
    .from(movies)
    .leftJoin(moviesToFavorites, eq(movies.id, moviesToFavorites.movieId))
    .where(
      sql`LOWER(${movies.director}) = ${slug.replace(/-/g, ' ').toLowerCase()}`
    )
    .groupBy(movies.id)
    .orderBy(desc(sql`favorite_count`))

  if (!directorMovies.length) return null

  // Get favorites for each movie
  const moviesWithFavorites = await Promise.all(
    directorMovies.map(async movie => {
      const favorites = await db.query.moviesToFavorites.findMany({
        where: eq(moviesToFavorites.movieId, movie.id),
        with: {
          favorite: true
        }
      })

      return {
        ...movie,
        favorites: favorites.map(mtf => mtf.favorite)
      }
    })
  )

  return {
    name: directorMovies[0].director,
    movies: moviesWithFavorites
  }
}

export async function getAllDirectors({ offset = 0, limit = 20 } = {}): Promise<
  DirectorWithSlug[]
> {
  const results = await db
    .select({
      director: movies.director,
      count: sql<number>`count(DISTINCT ${movies.id})`.as('count')
    })
    .from(movies)
    .innerJoin(moviesToFavorites, eq(movies.id, moviesToFavorites.movieId))
    .groupBy(movies.director)
    .having(sql`count(DISTINCT ${movies.id}) > 0`)
    .orderBy(desc(sql`count`))

  // Process directors and handle multiple directors per field
  const directorsMap = new Map<string, number>()

  results.forEach(result => {
    const directors = result.director.split(',').map(d => d.trim())
    directors.forEach(director => {
      const currentCount = directorsMap.get(director) || 0
      directorsMap.set(director, currentCount + Number(result.count))
    })
  })

  // Convert to array, sort by movie count, and apply pagination
  return Array.from(directorsMap.entries())
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      movieCount: count
    }))
    .sort((a, b) => b.movieCount - a.movieCount)
    .slice(offset, offset + limit)
}

export async function getAllGenres(): Promise<GenreWithCount[]> {
  const results = await db
    .select({
      genres: movies.genres,
      count: sql<number>`count(DISTINCT ${movies.id})`.as('count')
    })
    .from(movies)
    .innerJoin(moviesToFavorites, eq(movies.id, moviesToFavorites.movieId))
    .groupBy(movies.genres)
    .having(sql`count(DISTINCT ${movies.id}) > 0`)
    .orderBy(desc(sql`count`))

  // Process genres from the array in each row
  const genresMap = new Map<number, number>()

  results.forEach(result => {
    if (result.genres) {
      result.genres.forEach(genreId => {
        const currentCount = genresMap.get(Number(genreId)) || 0
        genresMap.set(Number(genreId), currentCount + Number(result.count))
      })
    }
  })

  // Convert to array and map to genre names
  return Array.from(genresMap.entries())
    .map(([id, count]) => {
      const genre = movieGenres.find(g => g.id === id)
      return {
        id,
        name: genre?.name || 'Unknown Genre',
        slug: (genre?.name || 'unknown').toLowerCase().replace(/\s+/g, '-'),
        movieCount: count
      }
    })
    .sort((a, b) => b.movieCount - a.movieCount)
}

export async function getFeaturedFavorites() {
  const results = await db.query.favorites.findMany({
    where: eq(favorites.isFeatured, true),
    with: {
      artistsToFavorites: {
        with: {
          artist: true
        }
      },
      moviesToFavorites: {
        with: {
          movie: true
        }
      }
    },
    orderBy: desc(favorites.publishingDate)
  })

  // Transform the results to ensure we have the correct structure
  return results.map(favorite => ({
    ...favorite,
    artistsToFavorites: favorite.artistsToFavorites.map(atf => ({
      artist: atf.artist
    }))
  }))
}

export async function getLastFiveFavorites() {
  const results = await db.query.favorites.findMany({
    with: {
      artistsToFavorites: {
        with: {
          artist: true
        }
      },
      moviesToFavorites: {
        with: {
          movie: true
        }
      }
    },
    orderBy: desc(favorites.publishingDate),
    limit: 5
  })

  return results.map(favorite => ({
    ...favorite,
    artistsToFavorites: favorite.artistsToFavorites.map(atf => ({
      artist: atf.artist
    }))
  }))
}

export const getMoviesByGenre = async (genreId: number) => {
  return await db.query.movies.findMany({
    where: sql`${genreId.toString()} = ANY(${movies.genres})`,
    with: {
      moviesToFavorites: {
        with: {
          favorite: true
        }
      }
    }
  })
}
