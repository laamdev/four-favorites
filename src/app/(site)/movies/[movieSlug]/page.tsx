import { notFound } from 'next/navigation'

import { EmptyState } from '@/components/globals/empty-state'
import { SectionHeading } from '@/components/globals/section-heading'
import { ItemCard } from '@/components/globals/item-card'

import { getMovie, getMoviesSlugs } from '@/db/queries'
import { MovieHero } from '@/components/movies/movie-hero'

interface MoviePageProps {
  params: Promise<{ movieSlug: string }>
}

export async function generateStaticParams() {
  const slugs = await getMoviesSlugs()

  return slugs.map(slug => ({
    movieSlug: slug
  }))
}

export const generateMetadata = async ({ params }: MoviePageProps) => {
  const { movieSlug } = await params
  const movie = await getMovie(movieSlug)

  if (!movie) {
    return {
      title: 'Movie Not Found'
    }
  }

  return {
    title: movie?.name
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { movieSlug } = await params

  try {
    const movie = await getMovie(movieSlug)

    if (!movie) {
      return notFound()
    }

    return (
      <div>
        <MovieHero movie={movie} />

        <div className='bg-card py-16'>
          <div className='container'>
            <SectionHeading text='Picked by' />
            {movie.favorites.length > 0 ? (
              <div className='mt-4 grid grid-cols-2 gap-4 sm:mt-8 sm:grid-cols-5'>
                {movie.favorites.map(favorite => (
                  <ItemCard
                    key={favorite.id}
                    slug={`/lists/${favorite.slug}`}
                    heading={favorite.name}
                    subheading={favorite.artists[0].role}
                    image={
                      favorite.artists[0]?.headshotUrl?.includes('cloudinary')
                        ? favorite.artists[0]?.headshotUrl
                        : favorite.artists[0].headshotUrl
                          ? `https://image.tmdb.org/t/p/h632${favorite.artists[0].headshotUrl}`
                          : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
                    }
                  />
                ))}
              </div>
            ) : (
              <div className='mt-4 sm:mt-8'>
                <EmptyState>
                  This movie is not included in any lists yet.
                </EmptyState>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching movie:', error)
    throw new Error('Failed to load movie data. Please try again later.')
  }
}
