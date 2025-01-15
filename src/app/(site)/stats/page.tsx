import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'
import { SectionHeading } from '@/components/globals/section-heading'
import { DecadeRadialChart } from '@/components/charts/decade-radial-chart'
import { DirectorBarChart } from '@/components/charts/director-bar-chart'

import { getMoviesByDecade, getMoviesByDirector } from '@/db/queries'

export default async function StatsPage() {
  const [moviesByDecade, moviesByDirector] = await Promise.all([
    getMoviesByDecade(),
    getMoviesByDirector()
  ])

  return (
    <div className='mb-12 mt-16 sm:mt-24'>
      <div className='flex flex-col justify-between gap-y-8 sm:flex-row sm:items-end sm:gap-y-0'>
        <div>
          <PageTitle size='lg'>{`Stats`}</PageTitle>

          <PageSummary size='lg'>
            <span>{`Visualize stats of the `}</span>
            <a
              href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
              target='_blank'
              rel='noopener noreferrer'
              className='tw-animation font-medium text-white underline hover:text-primary'
            >
              {`Four Favorites`}
            </a>
            <span>{` celebrity pick lists.`}</span>
          </PageSummary>
        </div>
      </div>

      <div className='mt-8 sm:mt-12'>
        <div className='grid grid-cols-2 gap-8'>
          <DecadeRadialChart data={moviesByDecade} />
          <DirectorBarChart data={moviesByDirector} />
        </div>
      </div>
    </div>
  )
}
