'use client'

import { toast } from 'sonner'
import { MinusCircle } from '@phosphor-icons/react'

import { deleteUserMovie } from '@/app/_actions'

interface DeleteMovieButtonProps {
  movieId: number
  position: number
}

export const DeleteMovieButton = ({
  movieId,
  position
}: DeleteMovieButtonProps) => {
  return (
    <button
      onClick={async () => {
        await deleteUserMovie({ movieId: movieId, position: position })

        toast.success('Movie deleted')
      }}
      className='tw-animation absolute left-2 top-2 z-50 scale-75 transform opacity-0 group-hover:scale-100 group-hover:opacity-100'
    >
      <MinusCircle
        weight='fill'
        className='tw-animation size-12 text-white hover:text-primary'
      />
    </button>
  )
}
