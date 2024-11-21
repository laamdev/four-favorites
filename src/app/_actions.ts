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
  console.log(JSON.stringify(favoriteId, null, 2), 'favoriteId')
  console.log(JSON.stringify(userId, null, 2), 'userId')
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
        and(eq(userLikes.userId, userId), eq(userLikes.favoriteId, favoriteId))
      )
      .execute()

    return await db
      .update(favorites)
      .set({
        likes: sql`${favorites.likes} - 1`
      })
      .where(eq(favorites.id, favoriteId))
      .returning()
      .execute()
  }

  // Like and increment
  await db
    .insert(userLikes)
    .values({
      userId,
      favoriteId
    })
    .execute()

  return await db
    .update(favorites)
    .set({
      likes: sql`${favorites.likes} + 1`
    })
    .where(eq(favorites.id, favoriteId))
    .returning()
    .execute()
}

interface addUserMovieProps {
  movie: {
    title: string
    overview: string
    poster_path: string
    release_date: string
  }
  position: number
}

export async function addUserMovie({ movie, position }: addUserMovieProps) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    // Check if movie exists
    const existingMovie = await db.query.movies.findFirst({
      where: eq(movies.name, movie.title)
    })

    let movieId: number

    if (!existingMovie) {
      // Insert new movie if it doesn't exist
      const [newMovie] = await db
        .insert(movies)
        .values({
          name: movie.title,
          slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          overview: movie.overview,
          director: 'TBD',
          posterUrl: `https://image.tmdb.org/t/p/w1280${movie.poster_path}`,
          releaseDate: new Date(movie.release_date).toISOString()
        })
        .returning()

      movieId = newMovie.id
    } else {
      movieId = existingMovie.id
    }

    // Create user-movie relationship
    await db.insert(userMovies).values({
      userId,
      movieId,
      position
    })

    revalidatePath('/user')
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

    console.log('siuuuuu')
    revalidatePath('/user')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete movie:', error)
    throw new Error('Failed to delete movie')
  }
}
