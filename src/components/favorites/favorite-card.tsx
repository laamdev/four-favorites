import Image from 'next/image'
import Link from 'next/link'

import { Favorite } from '@/types'

export const FavoriteCard = ({ favorite }: { favorite: Favorite }) => {
  return (
    <li key={favorite.id}>
      <Link href={`/favorites/${favorite.slug}`}>
        <div className='group relative aspect-[2/3] overflow-hidden rounded'>
          <Image
            src={`https://media.themoviedb.org/t/p/w600_and_h900_bestv2${favorite.artist.headshotUrl}`}
            alt={favorite.artist.name}
            fill
            className='tw-gradient tw-card-hover relative rounded object-cover object-center group-hover:scale-105'
          />
          <div className='tw-card-hover absolute inset-0 z-10 bg-black opacity-30 group-hover:opacity-0' />
          <h2 className='absolute bottom-0 left-0 z-20 rounded-tr bg-[#b6995d]/75 px-3 py-2 text-sm font-bold text-primary-foreground backdrop-blur-sm'>
            {favorite.artist.name}
          </h2>
        </div>
      </Link>
    </li>
  )
}
