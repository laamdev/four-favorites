import Link from 'next/link'
import Image from 'next/image'

interface MovieCardProps {
  slug: string
  heading: string
  subheading?: string
  image: string
}

export const MovieCard = ({
  slug,
  heading,
  subheading,
  image
}: MovieCardProps) => {
  return (
    <Link
      href={slug}
      className='group block transform transition-transform duration-300 ease-out hover:-translate-y-2'
    >
      <div className='tw-animation relative aspect-2/3 overflow-hidden'>
        <Image
          src={image}
          alt={heading}
          fill
          className='tw-gradient tw-animation relative object-cover object-center'
        />
      </div>
      <div className='mt-2'>
        <h2 className='group-hover:text-primary tw-animation font-serif text-lg font-bold tracking-wider'>
          {heading}
        </h2>
        <p className='font-serif text-sm text-neutral-500 capitalize italic'>
          {subheading}
        </p>
      </div>
    </Link>
  )
}
