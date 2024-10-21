import Link from 'next/link'

interface FavoriteListProps {
  favorites: any
}

export const FavoriteList = ({ favorites }: FavoriteListProps) => {
  return (
    <ul className='flex flex-col gap-y-2.5'>
      {favorites.map(favorite => (
        <Link
          href={`/favorites/${favorite.slug}`}
          className='tw-link-hover text-lg font-medium text-zinc-300 hover:text-foreground'
        >
          {favorite.name} {favorite.category}
        </Link>
      ))}
    </ul>
  )
}
