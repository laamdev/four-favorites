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
    <div className='tw-animation absolute top-4 left-4 z-50 flex flex-col gap-y-2'>
      <button
        onClick={async () => {
          await deleteUserMovie({ movieId: movieId, position: position })
          toast.success('Movie deleted')
        }}
        className='tw-animation bg-primary flex size-10 transform cursor-pointer items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-black'
      >
        <Minus className='size-6' />
      </button>
      <Link
        href={`/movies/${movieSlug}`}
        className='tw-animation bg-primary flex size-10 transform cursor-pointer items-center justify-center rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-black'
      >
        <Eye className='size-6' />
      </Link>
    </div>
  )
}
