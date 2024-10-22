import Link from 'next/link'

interface FavoriteListProps {
  favorites: any
}

export const FavoriteList = ({ favorites }: FavoriteListProps) => {
  return (
    <ul className='mx-auto flex flex-col gap-y-5 text-center'>
      {favorites.map((favorite: any) => (
        <Link
          href={`/favorites/${favorite.slug}`}
          className='tw-link-hover font-serif text-2xl font-medium text-zinc-300 hover:text-primary'
        >
          {favorite.name}
        </Link>
      ))}
    </ul>
  )
}
