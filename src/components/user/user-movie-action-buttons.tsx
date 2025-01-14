'use client'

import { toast } from 'sonner'
import { Eye, Minus } from '@phosphor-icons/react'

import { deleteUserMovie } from '@/app/_actions'
import Link from 'next/link'

interface UserMovieActionButtonsProps {
  movieId: number
  position: number
  movieSlug?: string
}

export const UserMovieActionButtons = ({
  movieId,
  position,
  movieSlug
}: UserMovieActionButtonsProps) => {
  return (
    <div className='tw-animation absolute left-2 top-2 z-50 flex flex-col gap-y-2'>
      <button
        onClick={async () => {
          await deleteUserMovie({ movieId: movieId, position: position })
          toast.success('Movie deleted')
        }}
        className='tw-animation flex size-10 scale-75 transform items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:scale-100 group-hover:opacity-100'
      >
        <Minus className='tw-animation size-6 text-white hover:text-primary' />
      </button>
      <Link
        href={`/movies/${movieSlug}`}
        className='tw-animation flex size-10 scale-75 transform items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:scale-100 group-hover:opacity-100'
      >
        <Eye className='tw-animation size-6 text-white hover:text-primary' />
      </Link>
    </div>
  )
}
