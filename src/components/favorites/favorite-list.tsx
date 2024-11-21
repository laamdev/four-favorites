import Link from 'next/link'

interface ItemListProps {
  items: any
}

export const ItemList = ({ items }: ItemListProps) => {
  return (
    <ul className='mx-auto flex flex-col gap-y-5 text-center'>
      {items.map((item: any) => (
        <Link
          href={`/${item.slug}`}
          className='tw-animation font-serif text-2xl font-medium text-zinc-300 hover:text-primary'
        >
          {item.name}
        </Link>
      ))}
    </ul>
  )
}
