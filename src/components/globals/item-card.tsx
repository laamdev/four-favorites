import Link from 'next/link'
import Image from 'next/image'

interface ItemCardProps {
  slug: string
  heading: string
  subheading?: string
  image: string
}

export const ItemCard = ({
  slug,
  heading,
  subheading,
  image
}: ItemCardProps) => {
  return (
    <Link href={slug}>
      <div className='group relative aspect-[2/3] overflow-hidden rounded'>
        <Image
          src={image}
          alt={heading}
          fill
          className='tw-gradient tw-animation relative rounded object-cover object-center group-hover:scale-105'
        />
        <div className='tw-animation absolute inset-0 z-10 bg-black opacity-30 group-hover:opacity-0' />
      </div>
      <h2 className='mt-2 text-base font-bold sm:text-lg'>{heading}</h2>
      {subheading && (
        <p className='text-sm text-zinc-300 sm:text-base'>{subheading}</p>
      )}
    </Link>
  )
}
