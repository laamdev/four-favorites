'use client'

import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from '@phosphor-icons/react/dist/ssr'

import { addUserMovie } from '@/app/_actions'

interface AddMovieButtonProps {
  movie: any
  position: number
}

export const AddMovieButton = ({ movie, position }: AddMovieButtonProps) => {
  return (
    <div className='tw-animation absolute left-4 top-4 z-50'>
      <button
        onClick={async () => {
          const result = await addUserMovie({ movie, position })
          if (!result.success) {
            toast.error(result.error)
          } else {
            toast.success(`Added ${movie.title} as your #${position} favorite.`)
            redirect('/profile')
          }
        }}
        className='tw-animation bg-primary flex size-10 transform cursor-pointer items-center justify-center rounded-full text-white opacity-0 hover:bg-black hover:text-neutral-200 group-hover:opacity-100'
      >
        <Plus weight='bold' className='size-6' />
      </button>
    </div>
  )
}
