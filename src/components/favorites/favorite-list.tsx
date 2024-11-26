import Link from 'next/link'

interface ItemListProps {
  items: any
}

export const ItemList = ({ items }: ItemListProps) => {
  return (
    <ul className='mx-auto flex flex-col gap-y-4 text-center'>
      {items.map((item: any) => (
        <Link
          href={`/${item.slug}`}
          className='tw-animation text-2xl font-medium hover:text-primary'
        >
          {item.name}
        </Link>
      ))}
    </ul>
  )
}
