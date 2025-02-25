import { ReactNode } from 'react'

interface EmptyStateProps {
  children: ReactNode
}

export const EmptyState = ({ children }: EmptyStateProps) => {
  return (
    <div className='bg-card p-10 text-center text-sm sm:text-base'>
      {children}
    </div>
  )
}
