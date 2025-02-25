import { DecadeRadialChart } from '@/components/charts/decade-radial-chart'
import { DirectorBarChart } from '@/components/charts/director-bar-chart'
import { Hero } from '@/components/globals/hero'
import { SectionContainer } from '@/components/globals/section-wrapper'

import { getMoviesByDecade, getMoviesByDirector } from '@/db/queries'

export default async function StatsPage() {
  const [moviesByDecade, moviesByDirector] = await Promise.all([
    getMoviesByDecade(),
    getMoviesByDirector()
  ])

  return (
    <div>
      <Hero
        title='Stats'
        summary='Visualize stats of the Four Favorites celebrity pick lists.'
        isCentered
      />

      <SectionContainer>
        <div className='container'>
          <div className='grid grid-cols-2 gap-8'>
            <DecadeRadialChart data={moviesByDecade} />

            <DirectorBarChart data={moviesByDirector} />
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
