import { FavoriteCard } from '@/components/favorites/favorite-card'

interface FavoriteGridProps {
  favorites: any
}

export const FavoriteGrid = ({ favorites }: FavoriteGridProps) => {
  return (
    <ul className='grid grid-cols-2 gap-5 md:grid-cols-5'>
      {favorites.map((favorite: any) => (
        <FavoriteCard key={favorite.id} favorite={favorite} />
      ))}
    </ul>
  )
}
