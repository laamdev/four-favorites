import Image from 'next/image'
import Link from 'next/link'

interface ItemCardProps {
  id: string
  slug: string
  label: string
  image: string
}

export const ItemCard = ({ id, slug, label, image }: ItemCardProps) => {
  return (
    <li key={id}>
      <Link href={slug}>
        <div className='group relative aspect-[2/3] overflow-hidden rounded'>
          <Image
            src={image}
            alt={label}
            fill
            className='tw-gradient tw-animation relative rounded object-cover object-center group-hover:scale-105'
          />
          <div className='tw-animation absolute inset-0 z-10 bg-black opacity-30 group-hover:opacity-0' />
          <h2 className='absolute bottom-0 left-0 z-20 rounded-tr bg-[#b6995d]/75 px-3 py-2 text-sm font-bold text-primary-foreground backdrop-blur-sm'>
            {label}
          </h2>
        </div>
      </Link>
    </li>
  )
}
