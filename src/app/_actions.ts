'use server'

import { revalidatePath } from 'next/cache'
import { and, eq, sql } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

import { favorites, userLikes, userMovies, movies } from '@/db/schema'
import { db } from '@/db'

export async function likeFourFavoritesAction(
  favoriteId: number,
  userId: string
) {
  try {
    // Check if the user has already liked the favorite
    const existingLike = await db.query.userLikes.findFirst({
      where: and(
        eq(userLikes.userId, userId),
        eq(userLikes.favoriteId, favoriteId)
      )
    })

    if (existingLike) {
      // Unlike and decrement
      await db
        .delete(userLikes)
        .where(
          and(
            eq(userLikes.userId, userId),
            eq(userLikes.favoriteId, favoriteId)
          )
        )
        .execute()

      const result = await db
        .update(favorites)
        .set({
          likes: sql`${favorites.likes} - 1`
        })
        .where(eq(favorites.id, favoriteId))
        .returning()
        .execute()

      revalidatePath('/profile')
      return result
    }

    // Like and increment
    await db
      .insert(userLikes)
      .values({
        userId,
        favoriteId
      })
      .execute()

    const result = await db
      .update(favorites)
      .set({
        likes: sql`${favorites.likes} + 1`
      })
      .where(eq(favorites.id, favoriteId))
      .returning()
      .execute()

    revalidatePath('/favorites')
    return result
  } catch (error) {
    console.error('Error in likeFourFavoritesAction:', error)
    throw new Error('Failed to update favorite like status')
  }
}

interface addUserMovieProps {
  movie: {
    id: number
    title: string
    overview: string
    poster_path: string
    release_date: string
    genre_ids: string[]
  }
  position: number
}

export async function addUserMovie({ movie, position }: addUserMovieProps) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    // Check if movie exists in the movies table
    const existingMovie = await db.query.movies.findFirst({
      where: eq(movies.name, movie.title)
    })

    let movieId = existingMovie?.id || movie.id

    // Check if user already has this movie in their favorites
    const existingUserMovie = await db.query.userMovies.findFirst({
      where: and(eq(userMovies.userId, userId), eq(userMovies.movieId, movieId))
    })

    if (existingUserMovie) {
      return { success: false, error: 'Movie already in your favorites' }
    }

    if (!existingMovie) {
      // Insert new movie if it doesn't exist
      const [newMovie] = await db
        .insert(movies)
        .values({
          id: movie.id,
          name: movie.title,
          slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          overview: movie.overview,
          director: 'N/A',
          posterUrl: movie.poster_path,
          releaseDate: new Date(movie.release_date).toISOString(),
          genres: movie.genre_ids
        })
        .returning()

      movieId = newMovie.id
    }

    // Create user-movie relationship
    await db.insert(userMovies).values({
      userId,
      movieId,
      position
    })

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Failed to add movie:', error)
    throw new Error('Failed to add movie')
  }
}

export async function deleteUserMovie({
  movieId,
  position
}: {
  movieId: number
  position: number
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    await db
      .delete(userMovies)
      .where(
        and(
          eq(userMovies.userId, userId),
          eq(userMovies.movieId, movieId),
          eq(userMovies.position, position)
        )
      )

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete movie:', error)
    throw new Error('Failed to delete movie')
  }
}
