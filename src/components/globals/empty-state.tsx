import { ReactNode } from 'react'

interface EmptyStateProps {
  children: ReactNode
}

export const EmptyState = ({ children }: EmptyStateProps) => {
  return (
    <div className='rounded-lg bg-zinc-800/50 p-10 text-center'>{children}</div>
  )
}
