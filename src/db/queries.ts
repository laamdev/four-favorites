'use server'

import { and, desc, eq, asc, like, sql, exists, count } from 'drizzle-orm'

import { db } from '@/db'
import { artists, favorites, movies } from '@/db/schema'

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
            : [asc(favorites.name)]

  const whereClause = and(
    query ? like(favorites.name, sql`%${query.toLowerCase()}%`) : undefined,
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

export async function getFavorite(slug: string) {
  return await db.query.favorites.findFirst({
    where: eq(favorites.slug, slug),
    orderBy: [asc(favorites.name)],
    with: {
      artist: true,
      moviesToFavorites: {
        with: {
          movie: true
        }
      }
    }
  })
}

export async function getAllMoviesWithFavoriteCounts() {
  return await db.query.movies.findMany({
    with: {
      moviesToFavorites: true
    }
  })
}

export async function getMovie(slug: string) {
  return await db.query.movies.findFirst({
    where: eq(movies.slug, slug),
    with: {
      moviesToFavorites: {
        with: {
          favorite: true
        }
      }
    }
  })
}
