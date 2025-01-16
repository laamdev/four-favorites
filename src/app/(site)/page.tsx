import Link from 'next/link'

import { PageTitle } from '@/components/globals/page-title'
import { PageSummary } from '@/components/globals/page-summary'
import { FeaturedCarousel } from '@/components/favorites/featured-carousel'
import { SectionHeading } from '@/components/globals/section-heading'
import { Button, buttonVariants } from '@/components/ui/button'

import { getFeaturedFavorites, getMostRecentFavorite } from '@/db/queries'
import { getFormattedDate } from '@/lib/utils'

export default async function FourFavoritesPage() {
  const [lastUpdated, featuredFavorites] = await Promise.all([
    getMostRecentFavorite(),
    getFeaturedFavorites()
  ])

  return (
    <div className='mt-24'>
      <div>
        <PageTitle className='flex flex-col'>
          <span>{`Four`}</span>
          <span>{`Favorites`}</span>
        </PageTitle>
        <PageSummary>
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

      {featuredFavorites.length > 0 && (
        <div className='mt-16 sm:mt-24'>
          <SectionHeading text='Featured Lists' />
          <FeaturedCarousel featuredFavorites={featuredFavorites} />
          <div className='mt-8 flex items-center justify-center sm:mt-16'>
            <Link href='/lists'>
              <Button variant='default'>View All Lists</Button>
            </Link>
          </div>
        </div>
      )}

      <div className='mt-16 sm:mt-24'>
        <div className='relative overflow-hidden rounded-md bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 backdrop-blur-sm sm:p-12'>
          <div className='bg-grid-white/5 absolute inset-0' />
          <div className='relative'>
            <SectionHeading
              text='Are We Missing a List?'
              className='text-center'
            />
            <div className='mt-2 flex flex-col items-center gap-y-6 text-center sm:mt-4'>
              <p className='max-w-2xl text-sm text-muted-foreground sm:text-lg'>
                If you've found a Four Favorites list that's not on our website,
                or noticed any errors, please let us know. We're always looking
                to expand our collection.
              </p>
              <a
                className={buttonVariants({
                  variant: 'outline',
                  className: 'group'
                })}
                href='mailto:hello@laam.dev'
              >
                <span>Contact Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
