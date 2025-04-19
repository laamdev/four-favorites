import Link from 'next/link'

import { FeaturedCarousel } from '@/components/favorites/featured-carousel'
import { SectionHeading } from '@/components/globals/section-heading'
import { Button, buttonVariants } from '@/components/ui/button'
import { Hero } from '@/components/globals/hero'
import { SectionContainer } from '@/components/globals/section-wrapper'

import {
  getMostRecentFavorite,
  getNewDirectors,
  getOldDirectors,
  getNewStars,
  getOldStars
} from '@/db/queries'
import { getFormattedDate } from '@/lib/utils'

export default async function FourFavoritesPage() {
  const [lastUpdated, newDirectors, oldDirectors, newStars, oldStars] =
    await Promise.all([
      getMostRecentFavorite(),
      getNewDirectors(),
      getOldDirectors(),
      getNewStars(),
      getOldStars()
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

      {oldDirectors && oldDirectors.length > 0 && (
        <SectionContainer>
          <div className='container'>
            <SectionHeading text='Legendary Lenses' />
            <FeaturedCarousel
              data={{
                oldDirectors
              }}
            />
            <div className='mt-4 flex items-center justify-center sm:mt-8'>
              <Link href='/lists'>
                <Button variant='default'>All Lists</Button>
              </Link>
            </div>
          </div>
        </SectionContainer>
      )}

      {newDirectors && newDirectors.length > 0 && (
        <SectionContainer className='bg-neutral-200'>
          <div className='container'>
            <SectionHeading text='Modern Masters' />
            <FeaturedCarousel
              data={{
                newDirectors
              }}
            />
            <div className='mt-4 flex items-center justify-center sm:mt-8'>
              <Link href='/lists'>
                <Button variant='default'>All Lists</Button>
              </Link>
            </div>
          </div>
        </SectionContainer>
      )}

      {oldStars && oldStars.length > 0 && (
        <SectionContainer>
          <div className='container'>
            <SectionHeading text='Hollywood Royalty' />
            <FeaturedCarousel
              data={{
                oldStars
              }}
            />
            <div className='mt-4 flex items-center justify-center sm:mt-8'>
              <Link href='/lists'>
                <Button variant='default'>All Lists</Button>
              </Link>
            </div>
          </div>
        </SectionContainer>
      )}

      {newStars && newStars.length > 0 && (
        <SectionContainer className='bg-neutral-200'>
          <div className='container'>
            <SectionHeading text='The New Guard' />
            <FeaturedCarousel
              data={{
                newStars
              }}
            />
            <div className='mt-4 flex items-center justify-center sm:mt-8'>
              <Link href='/lists'>
                <Button variant='default'>All Lists</Button>
              </Link>
            </div>
          </div>
        </SectionContainer>
      )}

      <SectionContainer className='bg-neutral-800'>
        <div className='container'>
          <SectionHeading
            text='Are We Missing a List?'
            className='text-center text-white'
          />
          <div className='mt-2 flex flex-col items-center gap-y-6 text-center sm:mt-4'>
            <p className='max-w-2xl text-neutral-300'>
              If you've found a Four Favorites list that's not on our website,
              or noticed any errors, please let us know. We're always looking to
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
      </SectionContainer>
    </div>
  )
}
