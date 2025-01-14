import Link from 'next/link'
import { FilmReel } from '@phosphor-icons/react/dist/ssr'

import { Menu } from '@/components/navigation/menu'

export const Header = () => {
  return (
    <div className='absolute inset-x-0 top-0 z-50 flex items-center justify-between p-4 sm:px-8'>
      <Link href='/'>
        <FilmReel
          weight='fill'
          className='tw-animation size-7 hover:text-primary'
        />
      </Link>
      <Menu />
    </div>
  )
}
