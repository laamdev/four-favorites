'use client'

import { useState } from 'react'
import { Heart } from '@phosphor-icons/react/dist/ssr'

import { likeFourFavoritesAction } from '@/app/_actions'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  favoriteId: number
  userId: string
  likes: number
  likedByUser?: boolean
}

export const LikeButton = ({
  favoriteId,
  userId,
  likes: initialLikes,
  likedByUser = false
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(likedByUser)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    try {
      setIsLoading(true)
      // Optimistic update
      const newIsLiked = !isLiked
      const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1

      setIsLiked(newIsLiked)
      setLikesCount(newLikesCount)

      // Server update
      const favorite = await likeFourFavoritesAction(favoriteId, userId)

      // Update with server value if different
      if (favorite && Number(favorite[0]?.likes) !== newLikesCount) {
        setLikesCount(Number(favorite[0].likes))
      }
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked)
      setLikesCount(likesCount)
      console.error('Failed to update like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={!userId || isLoading}
      className={cn(
        'group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed disabled:opacity-50'
      )}
    >
      <Heart
        weight='fill'
        className={cn('tw-animation size-6 group-hover:fill-white sm:size-8', {
          'fill-stone-300': !isLiked,
          'fill-primary': isLiked
        })}
      />
      <span className='w-16 text-xs tabular-nums'>
        {likesCount} {likesCount !== 1 ? 'Likes' : 'Like'}
      </span>
    </button>
  )
}
