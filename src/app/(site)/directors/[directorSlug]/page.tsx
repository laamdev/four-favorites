import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'

import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'
import { ItemCard } from '@/components/globals/item-card'

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

  return { title: director.name }
}

export default async function DirectorPage({ params }: DirectorPageProps) {
  const { directorSlug } = await params
  const director = await getDirector(directorSlug)

  if (!director) {
    return notFound()
  }

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div className='flex flex-col justify-between gap-y-8 sm:flex-row sm:items-end sm:gap-y-0'>
        <div>
          <PageTitle size='lg'>{director.name}</PageTitle>
          <PageSummary size='lg'>
            {director.movies.length}{' '}
            {director.movies.length === 1 ? 'movie' : 'movies'} in the Four
            Favorites lists
          </PageSummary>
        </div>
      </div>

      <div className='mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
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
  )
}
