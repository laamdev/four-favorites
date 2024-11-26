import { ItemCard } from '@/components/globals/item-card'

interface ItemGridProps {
  items: any[] // Make sure items is defined as an array
  baseUrl?: string
  type: 'artist' | 'movie'
}

export const ItemGrid = ({
  items = [], // Provide default empty array
  baseUrl = '',
  type = 'artist'
}: ItemGridProps) => {
  if (!items || items.length === 0) {
    return <div>No items to display</div>
  }

  return (
    <ul className='grid grid-cols-2 gap-5 md:grid-cols-5'>
      {items.map((item: any) => (
        <ItemCard
          key={item.id}
          slug={`${baseUrl}/${item.slug}`}
          heading={item.name}
          image={`https://media.themoviedb.org/t/p/w600_and_h900_bestv2${
            item.artist.headshotUrl
          }`}
        />
      ))}
    </ul>
  )
}
