'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const tabs = [
  { id: 1, label: 'Favorites', href: '/' },
  { id: 2, label: 'Movies', href: '/movies' }
]

export const Header = () => {
  return (
    <div className='flex flex-wrap items-center gap-2 py-7'>
      {tabs.map(tab => (
        <Chip key={tab.id} tab={tab} />
      ))}
    </div>
  )
}

const Chip = ({ tab }) => {
  const pathname = usePathname()
  const selected = pathname === tab.href
  return (
    <Link
      href={tab.href}
      className={`${
        selected
          ? 'text-primary-foreground'
          : 'text-zinc-300 hover:bg-zinc-700 hover:text-zinc-200'
      } relative rounded-md px-2.5 py-0.5 text-sm transition-colors`}
    >
      <span className='relative z-10'>{tab.label}</span>
      {selected && (
        <motion.span
          layoutId='pill-tab'
          transition={{ type: 'spring', duration: 0.5 }}
          className='absolute inset-0 z-0 rounded-md bg-primary text-primary-foreground'
        />
      )}
    </Link>
  )
}
