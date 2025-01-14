import Link from 'next/link'
import Image from 'next/image'

interface ItemCardProps {
  slug: string
  heading: string
  subheading?: string
  image: string
}

export const ItemCard = ({ slug, heading, image }: ItemCardProps) => {
  return (
    <Link href={slug} className='group'>
      <div className='tw-animation relative aspect-[2/3] overflow-hidden rounded border-2 border-transparent group-hover:border-primary'>
        <Image
          src={image}
          alt={heading}
          fill
          className='tw-gradient tw-animation relative rounded object-cover object-center group-hover:scale-105'
        />
        <div className='tw-animation absolute inset-0 z-10 bg-black opacity-30 group-hover:opacity-0' />
      </div>
      <h2 className='mt-2 text-lg font-bold'>{heading}</h2>
    </Link>
  )
}
