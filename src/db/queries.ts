'use server'

import { and, desc, eq, asc, like, sql, exists, count } from 'drizzle-orm'

import { db } from '@/db'
import {
  favorites,
  userLikes,
  artists,
  moviesToFavorites,
  movies,
  userMovies
} from '@/db/schema'

interface GetFavoritesProps {
  filter?: string
  sort?: string
  query?: string
  page?: number
}

export async function getFavorites({
  filter,
  sort,
  query,
  page
}: GetFavoritesProps) {
  const orderBy =
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

  const whereClause = and(
    query ? like(favorites.name, `%${query.toLowerCase()}%`) : undefined,
    filter && filter !== 'all'
      ? exists(
          db
            .select()
            .from(artists)
            .where(
              and(
                eq(artists.favoriteId, favorites.id),
                eq(
                  artists.role,
                  filter as
                    | 'actor'
                    | 'director'
                    | 'producer'
                    | 'writer'
                    | 'composer'
                    | 'singer'
                    | 'musician'
                )
              )
            )
        )
      : undefined
  )

  const [results, totalCount] = await Promise.all([
    db.query.favorites.findMany({
      where: whereClause,
      with: {
        artist: true,
        moviesToFavorites: {
          with: {
            movie: true
          }
        }
      },
      limit: 10,
      offset: page !== undefined ? (page - 1) * 10 : 0,
      orderBy: orderBy
    }),
    db
      .select({ count: count() })
      .from(favorites)
      .where(whereClause)
      .execute()
      .then(result => result[0].count)
  ])

  return {
    favorites: results,
    totalCount: Number(totalCount)
  }
}

export async function getFavorite(slug: string, userId: string) {
  const favorite = await db.query.favorites.findFirst({
    where: eq(favorites.slug, slug),
    with: {
      artist: true,
      moviesToFavorites: {
        with: {
          movie: true
        }
      }
    }
  })

  if (!favorite) {
    return null
  }

  const likedByUser = await db.query.userLikes.findFirst({
    where: and(
      eq(userLikes.userId, userId),
      eq(userLikes.favoriteId, favorite.id)
    )
  })

  return {
    ...favorite,
    likedByUser: !!likedByUser
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
          favorite: true
        }
      }
    }
  })

  if (!movie) return null

  // Get all movies with their list counts
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

  // Calculate rank
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

  return {
    ...movie,
    rank,
    listCount
  }
}

// // export const getRankedMovies = async () => {
// //   const [moviesWithCounts, [{ totalCount }]] = await Promise.all([
// //     db
// //       .select({
// //         id: movies.id,
// //         name: movies.name,
// //         slug: movies.slug,
// //         overview: movies.overview,
// //         director: movies.director,
// //         country: movies.country,
// //         genres: movies.genres,
// //         releaseDate: movies.releaseDate,
// //         posterUrl: movies.posterUrl,
// //         listCount: count(moviesToFavorites.favoriteId).as('list_count')
// //       })
// //       .from(movies)
// //       .leftJoin(
// //         moviesToFavorites,
// //         sql`${movies.id} = ${moviesToFavorites.movieId}`
// //       )
// //       .groupBy(movies.id, movies.name, movies.slug)
// //       .orderBy(desc(sql`list_count`), asc(movies.name))
// //       .limit(10),

// //     db
// //       .select({
// //         totalCount: sql<number>`count(*)`.as('total_count')
// //       })
// //       .from(movies)
// //   ])

// //   let currentRank = 0
// //   let previousListCount = Number.MAX_SAFE_INTEGER

// //   const rankedMovies = moviesWithCounts.map(movie => {
// //     if (movie.listCount < previousListCount) {
// //       currentRank = currentRank + 1
// //     }
// //     previousListCount = movie.listCount

// //     return {
// //       ...movie,
// //       rank: currentRank
// //     }
// //   })

// //   return {
// //     movies: rankedMovies,
// //     totalCount
// //   }
// // }
interface GetRankedMoviesProps {
  filter?: string
  sort?: string
  query?: string
  page?: number
}

export const getRankedMovies = async ({
  filter,
  sort,
  query,
  page
}: GetRankedMoviesProps = {}) => {
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
              ? [desc(sql`list_count`)]
              : [desc(sql`list_count`), asc(movies.name)]

  const whereClause = and(
    query
      ? sql`LOWER(${movies.name}) LIKE ${`%${query.toLowerCase()}%`}`
      : undefined,
    filter && filter !== 'all' ? like(movies.genres, `%${filter}%`) : undefined
  )
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
        listCount: count(moviesToFavorites.favoriteId).as('list_count')
      })
      .from(movies)
      .leftJoin(
        moviesToFavorites,
        sql`${movies.id} = ${moviesToFavorites.movieId}`
      )
      .where(whereClause)
      .groupBy(movies.id, movies.name, movies.slug)
      .orderBy(...orderBy)
      .limit(10)
      .offset(page !== undefined ? (page - 1) * 10 : 0),

    db
      .select({
        totalCount: sql<number>`count(*)`.as('total_count')
      })
      .from(movies)
      .where(whereClause)
  ])

  let currentRank = 0
  let previousListCount = Number.MAX_SAFE_INTEGER

  const rankedMovies = moviesWithCounts.map(movie => {
    if (movie.listCount < previousListCount) {
      currentRank = currentRank + 1
    }
    previousListCount = movie.listCount

    return {
      ...movie,
      rank: currentRank
    }
  })

  return {
    movies: rankedMovies,
    totalCount
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
            artist: {
              columns: {
                headshotUrl: true
              }
            }
          }
        }
      }
    })

    if (!likes.length) {
      console.log(`No likes found for user ${userId}`)
    }

    return likes
  } catch (error) {
    console.error('Error fetching user liked favorites:', error)
    throw error
  }
}

export async function getUserFavoriteCount(userId: string): Promise<number> {
  if (!userId) {
    throw new Error('UserId is required')
  }

  try {
    const [result] = await db
      .select({
        count: sql<number>`count(*)`.as('count')
      })
      .from(userLikes)
      .where(eq(userLikes.userId, userId))

    return Number(result.count)
  } catch (error) {
    console.error('Error getting user favorite count:', error)
    throw new Error('Failed to get favorite count')
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

export async function checkMoviePosition(userId: string, position: number) {
  return await db.query.userMovies.findFirst({
    where: and(
      eq(userMovies.userId, userId),
      eq(userMovies.position, position)
    ),
    with: {
      movie: true
    }
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
    // Use distinct to avoid duplicate movies
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

export async function getFavoriteListsLikedByUser(userId: string) {
  return await db.query.userLikes.findMany({
    where: eq(userLikes.userId, userId),
    with: {
      favorite: {
        columns: {
          id: true,
          name: true,
          slug: true,
          publishingDate: true
        }
      }
    }
  })
}

interface GetUsersFavoritesProps {
  page?: number
  sort?: string
  filter?: string
}

export const getUsersFavorites = async ({
  page = 1,
  sort,
  filter
}: GetUsersFavoritesProps = {}) => {
  const orderBy =
    sort === 'date'
      ? [desc(userMovies.createdAt)]
      : sort === '-date'
        ? [asc(userMovies.createdAt)]
        : sort === 'position'
          ? [asc(userMovies.position)]
          : [desc(userMovies.createdAt)]

  const whereClause = and(
    filter && filter !== 'all'
      ? exists(
          db
            .select()
            .from(movies)
            .where(
              and(
                eq(movies.id, userMovies.movieId),
                like(movies.genres, `%${filter}%`)
              )
            )
        )
      : undefined
  )

  const [results, totalCount] = await Promise.all([
    db
      .select({
        userId: userMovies.userId,
        movieId: userMovies.movieId,
        position: userMovies.position,
        movie: {
          id: movies.id,
          name: movies.name,
          slug: movies.slug,
          posterUrl: movies.posterUrl,
          genres: movies.genres
        }
      })
      .from(userMovies)
      .leftJoin(movies, eq(movies.id, userMovies.movieId))
      .where(whereClause)
      .orderBy(...orderBy)
      .limit(10)
      .offset((page - 1) * 10),

    db
      .select({ count: count() })
      .from(userMovies)
      .where(whereClause)
      .then(res => res[0].count)
  ])

  // Group movies by userId
  const userFavorites = results.reduce(
    (acc, curr) => {
      const { userId, ...movieData } = curr
      if (!acc[userId]) {
        acc[userId] = []
      }
      acc[userId].push(movieData)
      return acc
    },
    {} as Record<string, any[]>
  )

  return {
    favorites: Object.entries(userFavorites).map(([userId, movies]) => ({
      userId,
      movies: movies.sort((a, b) => a.position - b.position)
    })),
    totalCount: Number(totalCount)
  }
}

export const getUserFavorites = async (userId: string) => {
  return await db.query.userMovies.findMany({
    where: eq(userMovies.userId, userId),
    with: {
      movie: true
    },
    orderBy: asc(userMovies.position)
  })
}
