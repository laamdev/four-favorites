import { FavoriteCard } from '@/components/favorites/favorite-card'

interface FavoriteGridProps {
  favorites: any
}

export const FavoriteGrid = ({ favorites }: FavoriteGridProps) => {
  return (
    <ul className='grid grid-cols-5 gap-7'>
      {favorites.map(favorite => (
        <FavoriteCard key={favorite.id} favorite={favorite} />
      ))}
    </ul>
  )
}
