import Link from 'next/link'

import { FeaturedCarousel } from '@/components/favorites/featured-carousel'
import { SectionHeading } from '@/components/globals/section-heading'
import { Button, buttonVariants } from '@/components/ui/button'
import { Hero } from '@/components/globals/hero'

import { getFeaturedFavorites, getMostRecentFavorite } from '@/db/queries'
import { getFormattedDate } from '@/lib/utils'

export default async function FourFavoritesPage() {
  const [lastUpdated, featuredFavorites] = await Promise.all([
    getMostRecentFavorite(),
    getFeaturedFavorites()
  ])

  const lastUpdatedDate = lastUpdated?.publishingDate
    ? getFormattedDate(lastUpdated.publishingDate)
    : null

  return (
    <div>
      <Hero
        title='Four Favorites'
        summary={
          <>
            <div className='flex flex-wrap items-baseline justify-center gap-x-1 text-center'>
              <p>{`An ever-growing collection of Letterboxd's`}</p>
              <a
                href='https://www.youtube.com/playlist?list=PL5aexARLijfUCryhTPUxTlCo5MIkwqTBA'
                target='_blank'
                rel='noopener noreferrer'
                className='tw-animation text-primary'
              >{`#fourfavorites`}</a>
              <p>{` picks by celebrities.`}</p>
            </div>
            <div className='mt-1 sm:mt-2'>
              <p>{`Last updated on ${lastUpdatedDate}`}</p>
            </div>
          </>
        }
        isCentered
      />

      {featuredFavorites.length > 0 && (
        <div className='container px-4 py-12 sm:py-16'>
          <SectionHeading text='Featured Lists' />
          <FeaturedCarousel featuredFavorites={featuredFavorites} />
          <div className='mt-4 flex items-center justify-center sm:mt-8'>
            <Link href='/lists'>
              <Button variant='default'>All Lists</Button>
            </Link>
          </div>
        </div>
      )}

      <div className='bg-zinc-700 p-8 sm:p-12'>
        <SectionHeading
          text='Are We Missing a List?'
          className='text-center text-white'
        />
        <div className='mt-2 flex flex-col items-center gap-y-6 text-center sm:mt-4'>
          <p className='max-w-2xl text-zinc-300'>
            If you've found a Four Favorites list that's not on our website, or
            noticed any errors, please let us know. We're always looking to
            expand our collection.
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
  )
}
