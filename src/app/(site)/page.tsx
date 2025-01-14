import Link from 'next/link'
import { EnvelopeSimple } from '@phosphor-icons/react/dist/ssr'

import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'
import { FeaturedCarousel } from '@/components/favorites/featured-carousel'
import { SectionHeading } from '@/components/globals/section-heading'
import { Button } from '@/components/ui/button'

import { getFeaturedFavorites, getMostRecentFavorite } from '@/db/queries'
import { getFormattedDate } from '@/lib/utils'

export default async function FourFavoritesPage() {
  const [lastUpdated, featuredFavorites] = await Promise.all([
    getMostRecentFavorite(),
    getFeaturedFavorites()
  ])

  return (
    <div className='mb-12 mt-24 sm:mt-28'>
      <div className='relative'>
        <div className='relative mx-auto max-w-[1400px] px-4'>
          <div className='max-w-2xl'>
            <PageTitle size='lg' className='flex flex-col text-5xl md:text-8xl'>
              <span>{`Four`}</span>
              <span>{`Favorites`}</span>
            </PageTitle>
            <PageSummary size='lg'>
              <div className='flex flex-wrap items-baseline gap-x-1 text-lg sm:text-xl'>
                <p>{`An ever-growing collection of Letterboxd's`}</p>
                <a
                  href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='tw-animation font-medium text-white underline hover:text-primary'
                >{`Four Favorites`}</a>
                <p>{` picks by celebrities.`}</p>
              </div>
              <div className='mt-1 sm:mt-2'>
                <p>{`Last updated on ${getFormattedDate(lastUpdated?.publishingDate!)}`}</p>
              </div>
            </PageSummary>
          </div>
        </div>
      </div>

      {featuredFavorites.length > 0 && (
        <div className='mt-24 sm:mt-28'>
          <SectionHeading text='Featured Lists' />
          <FeaturedCarousel featuredFavorites={featuredFavorites} />
          <div className='mt-6 sm:mt-12'>
            <Link href='/lists'>
              <Button variant='default' size='lg'>
                View All Lists
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className='mt-24 sm:mt-28'>
        <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 shadow-lg backdrop-blur-sm sm:p-12'>
          <div className='bg-grid-white/5 absolute inset-0' />
          <div className='relative'>
            <SectionHeading
              text='Found a Missing List?'
              className='text-center'
            />
            <div className='mt-8 flex flex-col items-center gap-y-6 text-center'>
              <p className='max-w-2xl text-lg text-muted-foreground'>
                If you've found a Four Favorites list that's not on our website,
                or noticed any errors, please let us know. We're always looking
                to expand our collection.
              </p>
              <Button asChild size='lg' variant='outline' className='group'>
                <a
                  href='mailto:hello@laam.dev'
                  className='inline-flex items-center gap-x-2'
                >
                  <EnvelopeSimple
                    weight='fill'
                    className='size-5 text-primary group-hover:animate-bounce'
                  />
                  <span>Contact Us</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
