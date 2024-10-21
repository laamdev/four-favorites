import {
  pgTable,
  serial,
  varchar,
  timestamp,
  numeric,
  integer,
  pgEnum,
  primaryKey
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const artistsRolesEnum = pgEnum('artists_roles_enum', [
  'actor',
  'director',
  'producer',
  'writer',
  'composer',
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
  genres: varchar('genres').array(),
  releaseDate: timestamp('release_date', {
    precision: 3,
    withTimezone: true,
    mode: 'string'
  }).notNull(),
  posterUrl: varchar('poster_url')
    .default('https://image.tmdb.org/t/p/w1280/')
    .notNull(),
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
  moviesToFavorites: many(moviesToFavorites)
}))

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name').notNull(),
  slug: varchar('slug').notNull().unique(),
  votes: numeric('votes').default('0').notNull(),
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
  category: favoritesCategoriesEnum().notNull().default('all')
})

export const favoritesRelations = relations(favorites, ({ one, many }) => ({
  artist: one(artists),
  moviesToFavorites: many(moviesToFavorites)
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
    .default('https://media.themoviedb.org/t/p/w600_and_h900_bestv2/')
    .notNull()
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
