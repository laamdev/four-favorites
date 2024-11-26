'use client'

import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import { PlusCircle } from '@phosphor-icons/react/dist/ssr'

import { addUserMovie } from '@/app/_actions'

interface AddMovieButtonProps {
  movie: any
  position: number
}

export const AddMovieButton = ({ movie, position }: AddMovieButtonProps) => {
  return (
    <button
      onClick={async () => {
        await addUserMovie({ movie, position })

        toast.success(`Added ${movie.title} as your #${position} favorite.`)

        redirect('/profile')
      }}
      className='tw-animation absolute left-2 top-2 z-50 scale-75 transform opacity-0 group-hover:scale-100 group-hover:opacity-100'
    >
      <PlusCircle
        weight='fill'
        className='tw-animation h-6 w-6 text-white hover:text-primary'
      />
    </button>
  )
}
