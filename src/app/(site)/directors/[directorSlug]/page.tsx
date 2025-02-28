import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'

import { ItemCard } from '@/components/globals/item-card'
import { Hero } from '@/components/globals/hero'

import { getAllDirectors, getDirector } from '@/db/queries'

interface DirectorPageProps {
  params: Promise<{
    directorSlug: string
  }>
}

export async function generateStaticParams() {
  const directors = await getAllDirectors()
  return directors.map(director => ({ directorSlug: director.slug }))
}

export async function generateMetadata({
  params
}: DirectorPageProps): Promise<Metadata> {
  const { directorSlug } = await params
  const director = await getDirector(directorSlug)

  if (!director) return notFound()

  return {
    title: director.name,
    description: `${director.name}'s Four Favorites picks.`
  }
}

export default async function DirectorPage({ params }: DirectorPageProps) {
  const { directorSlug } = await params
  const director = await getDirector(directorSlug)

  if (!director) {
    return notFound()
  }

  return (
    <div>
      <Hero
        tagline={`${director.movies.length} ${
          director.movies.length === 1 ? 'movie' : 'movies'
        }`}
        title={director.name}
        summary={`${director.movies.length} ${
          director.movies.length === 1 ? 'movie' : 'movies'
        } featured in the Four Favorites celebrity picks.`}
      />

      <div className='py-4 sm:py-8'>
        <div className='container grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {director.movies.map(movie => (
            <ItemCard
              key={movie.slug}
              slug={`/movies/${movie.slug}`}
              heading={movie.name}
              subheading={format(parseISO(movie.releaseDate), 'yyyy')}
              image={
                movie.posterUrl
                  ? `https://image.tmdb.org/t/p/w780${movie.posterUrl}`
                  : 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg'
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
