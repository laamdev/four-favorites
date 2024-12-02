import {
  pgTable,
  serial,
  varchar,
  timestamp,
  numeric,
  integer,
  pgEnum,
  primaryKey,
  unique,
  check,
  PgArray,
  text
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

export const artistsRolesEnum = pgEnum('artists_roles_enum', [
  'actor',
  'director',
  'producer',
  'writer',
  'composer',
  'costume',
  'singer',
  'musician'
])

export const favoritesCategoriesEnum = pgEnum('favorites_categories', [
  'all',
  'horror',
  'family',
  'overall'
])

export const movies = pgTable('movies', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull().unique(),
  overview: varchar('overview').notNull(),
  director: varchar('director').notNull(),
  country: varchar('country').notNull().default('US'),
  genres: text('genres').array().default([]),
  releaseDate: timestamp('release_date', {
    precision: 3,
    withTimezone: true,
    mode: 'string'
  }).notNull(),
  posterUrl: varchar('poster_url'),
  letterboxdUrl: varchar('letterboxd_url').default('https://letterboxd.com/'),
  updatedAt: timestamp('updated_at', {
    precision: 3,
    withTimezone: true,
    mode: 'string'
  })
    .defaultNow()
    .notNull(),
  createdAt: timestamp('created_at', {
    precision: 3,
    withTimezone: true,
    mode: 'string'
  })
    .defaultNow()
    .notNull()
})

export const moviesRelations = relations(movies, ({ many }) => ({
  moviesToFavorites: many(moviesToFavorites),
  userMovies: many(userMovies)
}))

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull().unique(),
  likes: numeric('likes').default('0').notNull(),
  publishingDate: timestamp('publishing_date', {
    precision: 3,
    withTimezone: true,
    mode: 'string'
  })
    .defaultNow()
    .notNull(),
  videoUrl: varchar('video_url')
    .default(
      'https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
    )
    .notNull(),
  category: favoritesCategoriesEnum().notNull().default('overall')
})

export const favoritesRelations = relations(favorites, ({ one, many }) => ({
  artist: one(artists),
  moviesToFavorites: many(moviesToFavorites),
  userLikes: many(userLikes)
}))

export const artists = pgTable('artists', {
  id: serial('id').primaryKey().notNull(),
  favoriteId: integer('favorite_id')
    .references(() => favorites.id)
    .notNull(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull().unique(),
  updatedAt: timestamp('updated_at', {
    precision: 3,
    withTimezone: true,
    mode: 'string'
  })
    .defaultNow()
    .notNull(),
  createdAt: timestamp('created_at', {
    precision: 3,
    withTimezone: true,
    mode: 'string'
  })
    .defaultNow()
    .notNull(),
  role: artistsRolesEnum().notNull().default('actor'),
  headshotUrl: varchar('headshot_url')
})

export const artistsRelations = relations(artists, ({ one }) => ({
  favorite: one(favorites, {
    fields: [artists.favoriteId],
    references: [favorites.id]
  })
}))

export const moviesToFavorites = pgTable(
  'movies_to_favorites',
  {
    movieId: integer('movie_id')
      .notNull()
      .references(() => movies.id),
    favoriteId: integer('favorite_id')
      .notNull()
      .references(() => favorites.id)
  },
  t => ({
    pk: primaryKey({ columns: [t.movieId, t.favoriteId] })
  })
)

export const moviesToFavoritesRelations = relations(
  moviesToFavorites,
  ({ one }) => ({
    favorite: one(favorites, {
      fields: [moviesToFavorites.favoriteId],
      references: [favorites.id]
    }),
    movie: one(movies, {
      fields: [moviesToFavorites.movieId],
      references: [movies.id]
    })
  })
)

export const userLikes = pgTable(
  'user_likes',
  {
    userId: varchar('user_id').notNull(),
    favoriteId: integer('favorite_id')
      .notNull()
      .references(() => favorites.id),
    createdAt: timestamp('created_at', {
      precision: 3,
      withTimezone: true,
      mode: 'string'
    })
      .defaultNow()
      .notNull()
  },
  t => ({
    pk: primaryKey({ columns: [t.userId, t.favoriteId] })
  })
)

// Relations need to be defined after all tables
export const userLikesRelations = relations(userLikes, ({ one }) => ({
  favorite: one(favorites, {
    fields: [userLikes.favoriteId],
    references: [favorites.id]
  })
}))

export const userMovies = pgTable(
  'user_movies',
  {
    id: serial('id').primaryKey().notNull(),
    userId: varchar('user_id').notNull(),
    movieId: integer('movie_id')
      .references(() => movies.id)
      .notNull(),
    position: integer('position').notNull(), // 1-4 position
    createdAt: timestamp('created_at', {
      precision: 3,
      withTimezone: true,
      mode: 'string'
    })
      .defaultNow()
      .notNull()
  },
  table => ({
    // Ensure unique movie per user
    unqMoviePerUser: unique().on(table.userId, table.movieId),
    // Ensure unique position per user
    unqPositionPerUser: unique().on(table.userId, table.position),
    // Ensure position is between 1-4
    checkPosition: check('position_range', sql`position between 1 and 4`)
  })
)

// Add relations
export const userMoviesRelations = relations(userMovies, ({ one }) => ({
  movie: one(movies, {
    fields: [userMovies.movieId],
    references: [movies.id]
  })
}))
