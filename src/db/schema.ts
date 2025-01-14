import {
  pgTable,
  unique,
  serial,
  varchar,
  timestamp,
  text,
  numeric,
  foreignKey,
  check,
  integer,
  primaryKey,
  pgEnum,
  boolean
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm/relations'

export const artistsRolesEnum = pgEnum('artists_roles_enum', [
  'actor',
  'director',
  'producer',
  'writer',
  'composer',
  'costume',
  'musician',
  'cinematographer',
  'fictional',
  'critic'
])
export const countriesEnum = pgEnum('countries_enum', [
  'AF',
  'AX',
  'AL',
  'DZ',
  'AS',
  'AD',
  'AO',
  'AI',
  'AQ',
  'AG',
  'AR',
  'AM',
  'AW',
  'AU',
  'AT',
  'AZ',
  'BS',
  'BH',
  'BD',
  'BB',
  'BY',
  'BE',
  'BZ',
  'BJ',
  'BM',
  'BT',
  'BO',
  'BQ',
  'BA',
  'BW',
  'BV',
  'BR',
  'IO',
  'BN',
  'BG',
  'BF',
  'BI',
  'CV',
  'KH',
  'CM',
  'CA',
  'KY',
  'CF',
  'TD',
  'CL',
  'CN',
  'CX',
  'CC',
  'CO',
  'KM',
  'CD',
  'CG',
  'CK',
  'CR',
  'CI',
  'HR',
  'CU',
  'CW',
  'CY',
  'CZ',
  'DK',
  'DJ',
  'DM',
  'DO',
  'EC',
  'EG',
  'SV',
  'GQ',
  'ER',
  'EE',
  'SZ',
  'ET',
  'FK',
  'FO',
  'FJ',
  'FI',
  'FR',
  'GF',
  'PF',
  'TF',
  'GA',
  'GM',
  'GE',
  'DE',
  'GH',
  'GI',
  'GR',
  'GL',
  'GD',
  'GP',
  'GU',
  'GT',
  'GG',
  'GN',
  'GW',
  'GY',
  'HT',
  'HM',
  'VA',
  'HN',
  'HK',
  'HU',
  'IS',
  'IN',
  'ID',
  'IR',
  'IQ',
  'IE',
  'IM',
  'IL',
  'IT',
  'JM',
  'JP',
  'JE',
  'JO',
  'KZ',
  'KE',
  'KI',
  'KP',
  'KR',
  'KW',
  'KG',
  'LA',
  'LV',
  'LB',
  'LS',
  'LR',
  'LY',
  'LI',
  'LT',
  'LU',
  'MO',
  'MG',
  'MW',
  'MY',
  'MV',
  'ML',
  'MT',
  'MH',
  'MQ',
  'MR',
  'MU',
  'YT',
  'MX',
  'FM',
  'MD',
  'MC',
  'MN',
  'ME',
  'MS',
  'MA',
  'MZ',
  'MM',
  'NA',
  'NR',
  'NP',
  'NL',
  'NC',
  'NZ',
  'NI',
  'NE',
  'NG',
  'NU',
  'NF',
  'MK',
  'MP',
  'NO',
  'OM',
  'PK',
  'PW',
  'PS',
  'PA',
  'PG',
  'PY',
  'PE',
  'PH',
  'PN',
  'PL',
  'PT',
  'PR',
  'QA',
  'RO',
  'RU',
  'RW',
  'RE',
  'BL',
  'SH',
  'KN',
  'LC',
  'MF',
  'PM',
  'VC',
  'WS',
  'SM',
  'ST',
  'SA',
  'SN',
  'RS',
  'SC',
  'SL',
  'SG',
  'SX',
  'SK',
  'SI',
  'SB',
  'SO',
  'ZA',
  'GS',
  'SS',
  'ES',
  'LK',
  'SD',
  'SR',
  'SJ',
  'SE',
  'CH',
  'SY',
  'TW',
  'TJ',
  'TZ',
  'TH',
  'TL',
  'TG',
  'TK',
  'TO',
  'TT',
  'TN',
  'TR',
  'TM',
  'TC',
  'TV',
  'UG',
  'UA',
  'AE',
  'GB',
  'US',
  'UM',
  'UY',
  'UZ',
  'VU',
  'VE',
  'VN',
  'VG',
  'VI',
  'WF',
  'EH',
  'YE',
  'ZM',
  'ZW'
])
export const favoritesCategories = pgEnum('favorites_categories', [
  'horror',
  'family',
  'western',
  'overall'
])
export const genresEnum = pgEnum('genres_enum', [
  '28',
  '12',
  '16',
  '35',
  '80',
  '99',
  '18',
  '10751',
  '14',
  '36',
  '27',
  '10402',
  '9648',
  '10749',
  '878',
  '10770',
  '53',
  '10752',
  '37'
])

export const movies = pgTable(
  'movies',
  {
    id: serial().primaryKey().notNull(),
    name: varchar().notNull(),
    overview: varchar().notNull(),
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
    releaseDate: timestamp('release_date', {
      precision: 3,
      withTimezone: true,
      mode: 'string'
    }).notNull(),
    posterUrl: varchar('poster_url'),
    slug: varchar().notNull(),
    director: varchar().notNull(),
    country: varchar().default('US').notNull(),
    genres: text().array().default(['']),
    letterboxdUrl: varchar('letterboxd_url').default('https://letterboxd.com/')
  },
  table => [unique('movies_slug_unique').on(table.slug)]
)

export const artists = pgTable(
  'artists',
  {
    id: serial().primaryKey().notNull(),
    name: varchar().notNull(),
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
    role: artistsRolesEnum().notNull(),
    headshotUrl: varchar('headshot_url'),
    slug: varchar().notNull()
  },
  table => [unique('artists_slug_unique').on(table.slug)]
)

export const favorites = pgTable(
  'favorites',
  {
    id: serial().primaryKey().notNull(),
    name: varchar().notNull(),
    likes: numeric().default('0').notNull(),
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
    slug: varchar().notNull(),
    category: favoritesCategories().default('overall').notNull(),
    isFeatured: boolean().default(false)
  },
  table => [unique('favorites_slug_unique').on(table.slug)]
)

export const userMovies = pgTable(
  'user_movies',
  {
    id: serial().primaryKey().notNull(),
    userId: varchar('user_id').notNull(),
    movieId: integer('movie_id').notNull(),
    position: integer().notNull(),
    createdAt: timestamp('created_at', {
      precision: 3,
      withTimezone: true,
      mode: 'string'
    })
      .defaultNow()
      .notNull()
  },
  table => [
    foreignKey({
      columns: [table.movieId],
      foreignColumns: [movies.id],
      name: 'user_movies_movie_id_movies_id_fk'
    }),
    unique('user_movies_user_id_movie_id_unique').on(
      table.userId,
      table.movieId
    ),
    unique('user_movies_user_id_position_unique').on(
      table.userId,
      table.position
    ),
    check('position_range', sql`("position" >= 1) AND ("position" <= 4)`)
  ]
)

export const moviesToFavorites = pgTable(
  'movies_to_favorites',
  {
    movieId: integer('movie_id').notNull(),
    favoriteId: integer('favorite_id').notNull()
  },
  table => [
    foreignKey({
      columns: [table.movieId],
      foreignColumns: [movies.id],
      name: 'movies_to_favorites_movie_id_movies_id_fk'
    }),
    foreignKey({
      columns: [table.favoriteId],
      foreignColumns: [favorites.id],
      name: 'movies_to_favorites_favorite_id_favorites_id_fk'
    }),
    primaryKey({
      columns: [table.movieId, table.favoriteId],
      name: 'movies_to_favorites_movie_id_favorite_id_pk'
    })
  ]
)

export const artistsToFavorites = pgTable(
  'artists_to_favorites',
  {
    artistId: integer('artist_id').notNull(),
    favoriteId: integer('favorite_id').notNull()
  },
  table => [
    foreignKey({
      columns: [table.artistId],
      foreignColumns: [artists.id],
      name: 'artists_to_favorites_artist_id_fkey'
    }),
    foreignKey({
      columns: [table.favoriteId],
      foreignColumns: [favorites.id],
      name: 'artists_to_favorites_favorite_id_fkey'
    }),
    primaryKey({
      columns: [table.artistId, table.favoriteId],
      name: 'artists_to_favorites_pkey'
    })
  ]
)

export const userLikes = pgTable(
  'user_likes',
  {
    userId: varchar('user_id').notNull(),
    favoriteId: integer('favorite_id').notNull(),
    createdAt: timestamp('created_at', {
      precision: 3,
      withTimezone: true,
      mode: 'string'
    })
      .defaultNow()
      .notNull()
  },
  table => [
    foreignKey({
      columns: [table.favoriteId],
      foreignColumns: [favorites.id],
      name: 'user_likes_favorite_id_favorites_id_fk'
    }),
    primaryKey({
      columns: [table.userId, table.favoriteId],
      name: 'user_likes_user_id_favorite_id_pk'
    })
  ]
)

export const userMoviesRelations = relations(userMovies, ({ one }) => ({
  movie: one(movies, {
    fields: [userMovies.movieId],
    references: [movies.id]
  })
}))

export const moviesRelations = relations(movies, ({ many }) => ({
  userMovies: many(userMovies),
  moviesToFavorites: many(moviesToFavorites)
}))

export const moviesToFavoritesRelations = relations(
  moviesToFavorites,
  ({ one }) => ({
    movie: one(movies, {
      fields: [moviesToFavorites.movieId],
      references: [movies.id]
    }),
    favorite: one(favorites, {
      fields: [moviesToFavorites.favoriteId],
      references: [favorites.id]
    })
  })
)

export const favoritesRelations = relations(favorites, ({ many }) => ({
  moviesToFavorites: many(moviesToFavorites),
  artistsToFavorites: many(artistsToFavorites),
  userLikes: many(userLikes)
}))

export const artistsToFavoritesRelations = relations(
  artistsToFavorites,
  ({ one }) => ({
    artist: one(artists, {
      fields: [artistsToFavorites.artistId],
      references: [artists.id]
    }),
    favorite: one(favorites, {
      fields: [artistsToFavorites.favoriteId],
      references: [favorites.id]
    })
  })
)

export const artistsRelations = relations(artists, ({ many }) => ({
  artistsToFavorites: many(artistsToFavorites)
}))

export const userLikesRelations = relations(userLikes, ({ one }) => ({
  favorite: one(favorites, {
    fields: [userLikes.favoriteId],
    references: [favorites.id]
  })
}))
